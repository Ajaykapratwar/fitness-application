package com.fitness.activityservice.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ActivityStatsResponse {
    private long totalActivities;
    private long totalCaloriesBurned;
    private long totalDurationMinutes;
    private Map<String, Long> activitiesByType;
    private Map<String, Long> caloriesByType;
    private List<DailyActivityCount> dailyBreakdown;
}
