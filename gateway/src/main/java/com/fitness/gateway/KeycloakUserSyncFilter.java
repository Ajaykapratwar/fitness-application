package com.fitness.gateway;

import com.fitness.gateway.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (userId != null && token != null) {
            log.info("Validating user with ID: {}", userId);
            return userService.validateUser(userId)
                    .flatMap(exist -> {
                        if (exist) {
                            log.info("User {} is exist", userId);
                            return Mono.empty();
                        } else {
                            log.warn("User {} is not exist", userId);
                            exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        }
                    })
                    .then(Mono.defer(() ->
                            ServerHttpRequest mutateRequest = exchange.getRequest().mutate()));
                                    .header("X-User-Id", userId)
                                    .build();
                            return chain.filter(exchange.mutate().request(mutateRequest).build());
                    });
        } else {
            log.warn("No X-User-Id header found in the request");
        }
        return chain.filter(exchange);
    }
}
