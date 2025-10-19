package com.tpd.eatwise_server.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "routine")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Routine {

    @Id
    private String id;
    private String userId;
    private LocalDate pickedDate;
    private LocalDateTime createdAt;
    private Map<Meal, List<Food>> foods;
    private double waterConsumeDay;

    public void addFoodRoutine(Meal key, Food food) {
        if (this.foods == null)
            new HashMap<>();

        this.foods.computeIfAbsent(key, k -> new ArrayList<>()).add(food);
    }

    public Routine(String userId, LocalDate pickedDate) {
        this.userId = userId;
        this.pickedDate = pickedDate;
        this.foods = new HashMap<>();
        foods.put(Meal.BREAKFAST, new ArrayList<>());
        foods.put(Meal.LUNCH, new ArrayList<>());
        foods.put(Meal.DINNER, new ArrayList<>());

        this.createdAt = LocalDateTime.now();
        this.waterConsumeDay = 0;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FoodRoutine {
        private Food food;
        private boolean isDone;
    }

}
