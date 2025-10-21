package com.tpd.eatwise_server.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateGoalRequest {

    private double goalCal;

    private double goalProtein;

    private double goalCarb;

    private double goalFat;

    private double dailyGoalCal;
}
