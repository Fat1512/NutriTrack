package com.tpd.eatwise_server.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserStatusRequest {

    private Long age;


    private String eatingHabit;


    private String gender;


    private List<String> healthIssues;


    private Long height;


    private String mainGoal;


    private List<String> specificDiet;


    private Long weight;


    private Long targetWeight;


    private Boolean isOnboarded;

    private Double goalCal;

    private Double goalProtein;

    private Double goalCarb;

    private Double goalFat;

    private Double dailyGoalCal;
}
