package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;

    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepository.findByUserId(userId);
    }

    public List<Recommendation> getRecommendationsSince(String userId, String since) {
        if (since == null || since.isBlank()) {
            return recommendationRepository.findByUserId(userId);
        }
        try {
            Instant instant = Instant.parse(since);
            LocalDateTime sinceTime = LocalDateTime.ofInstant(instant, ZoneOffset.UTC);
            return recommendationRepository.findByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(userId, sinceTime);
        } catch (DateTimeParseException e) {
            return Collections.emptyList();
        }
    }

    public Recommendation getActivityRecommendation(String activityId) {
        return recommendationRepository.findByActivityId(activityId)
                .orElseThrow(() -> new RuntimeException("No recommendation found with activityId: " + activityId));
    }
}
