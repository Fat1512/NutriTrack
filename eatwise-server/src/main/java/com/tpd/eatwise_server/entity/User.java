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
}
