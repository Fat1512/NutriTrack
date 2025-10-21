package com.tpd.eatwise_server.dto.request;

import lombok.*;

import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPersonalizationRequest {
    private Long age;

    private String eatingHabit;

    private String gender;

    private List<String> healthIssues;

    private Long height;

    private String mainGoal;

    private List<String> specificDiet;

    private Long weight;

    private Long targetWeight;
}
