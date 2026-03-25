package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.dto.ActivityStatsResponse;
import com.fitness.activityservice.dto.DailyActivityCount;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.model.ActivityType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${spring.rabbitmq.exchange.name}")
    private String exchange;

    @Value("${spring.rabbitmq.routing.key}")
    private String routingKey;

    public ActivityResponse trackActivity(ActivityRequest request) {

        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if(!isValidUser) {
            throw new RuntimeException("Invalid User: " + request.getUserId());
        }

        LocalDateTime startTime = request.getStartTime() != null
                ? request.getStartTime()
                : LocalDateTime.now();

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(startTime)
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);

        // publish to RabbitMQ for AI processing
        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
        } catch (Exception e) {
            log.error("Fail to publish activity to RabbitMQ: ", e);
        }
        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());

        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() ->
                        new NoSuchElementException("Activity not found with id: " + activityId)
                );

        return mapToResponse(activity);
    }

    public ActivityStatsResponse getActivityStats(String userId, int days) {
        int window = Math.max(1, Math.min(days, 366));
        LocalDateTime since = LocalDateTime.now().minusDays(window);
        List<Activity> activities = activityRepository.findByUserIdAndCreatedAtAfter(userId, since);

        ActivityStatsResponse stats = new ActivityStatsResponse();
        stats.setTotalActivities(activities.size());
        stats.setTotalCaloriesBurned(activities.stream()
                .mapToLong(a -> a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0)
                .sum());
        stats.setTotalDurationMinutes(activities.stream()
                .mapToLong(a -> a.getDuration() != null ? a.getDuration() : 0)
                .sum());

        Map<String, Long> byType = new LinkedHashMap<>();
        Map<String, Long> calByType = new LinkedHashMap<>();
        for (ActivityType t : ActivityType.values()) {
            byType.put(t.name(), 0L);
            calByType.put(t.name(), 0L);
        }
        for (Activity a : activities) {
            if (a.getType() == null) {
                continue;
            }
            String key = a.getType().name();
            byType.merge(key, 1L, Long::sum);
            int cals = a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0;
            calByType.merge(key, (long) cals, Long::sum);
        }
        stats.setActivitiesByType(byType);
        stats.setCaloriesByType(calByType);

        List<DailyActivityCount> daily = new ArrayList<>();
        for (int i = window - 1; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusDays(i);
            long count = 0;
            long cals = 0;
            for (Activity a : activities) {
                LocalDate ad = activityDate(a);
                if (d.equals(ad)) {
                    count++;
                    cals += a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0;
                }
            }
            daily.add(new DailyActivityCount(d.toString(), count, cals));
        }
        stats.setDailyBreakdown(daily);
        return stats;
    }

    private static LocalDate activityDate(Activity a) {
        if (a.getStartTime() != null) {
            return a.getStartTime().toLocalDate();
        }
        if (a.getCreatedAt() != null) {
            return a.getCreatedAt().toLocalDate();
        }
        return LocalDate.now();
    }
}
