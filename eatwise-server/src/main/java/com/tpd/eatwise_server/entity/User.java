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
package com.tpd.eatwise_server.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "user")
@Data
@Builder
public class User {
    @Id
    private String id;

    @Field("username")
    private String username;

    @Field("password")
    private String password;

    @Field("age")
    private Long age;

    @Field("eating_habit")
    private String eatingHabit;

    @Field("gender")
    private String gender;

    @Field("health_issues")
    private List<String> healthIssues;

    @Field("height")
    private Long height;

    @Field("main_goal")
    private String mainGoal;

    @Field("specific_diet")
    private List<String> specificDiet;

    @Field("weight")
    private Long weight;

    @Field("target_weight")
    private Long targetWeight;

    @Field("is_onboarded")
    private Boolean isOnboarded;
    @Field("goal_cal")
    private Double goalCal;
    @Field("goal_protein")
    private Double goalProtein;
    @Field("goal_carb")
    private Double goalCarb;
    @Field("goal_fat")
    private Double goalFat;
    @Field("daily_goal_cal")
    private Double dailyGoalCal;
}
