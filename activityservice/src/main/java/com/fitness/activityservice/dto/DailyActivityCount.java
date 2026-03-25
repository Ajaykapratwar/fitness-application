package com.fitness.activityservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyActivityCount {
    private String date;
    private long count;
    private long calories;
}
