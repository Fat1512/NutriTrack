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

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
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

    public boolean checkActive() {
        if (foods == null) return false;
        boolean allMealsEmpty =
                getFoods().get(Meal.BREAKFAST).isEmpty() &&
                        getFoods().get(Meal.LUNCH).isEmpty() &&
                        getFoods().get(Meal.DINNER).isEmpty();
        return !allMealsEmpty || waterConsumeDay > 0;
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
