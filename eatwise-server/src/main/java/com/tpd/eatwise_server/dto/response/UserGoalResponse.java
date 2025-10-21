package com.tpd.eatwise_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserGoalResponse {
    private String id;

    private double goalCal;

    private double goalProtein;

    private double goalCarb;

    private double goalFat;

    private double dailyGoalCal;
}
