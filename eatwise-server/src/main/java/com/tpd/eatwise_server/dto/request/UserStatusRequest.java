/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
