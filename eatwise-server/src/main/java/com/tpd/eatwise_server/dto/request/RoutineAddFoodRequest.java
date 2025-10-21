package com.tpd.eatwise_server.dto.request;

import com.tpd.eatwise_server.entity.Meal;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoutineAddFoodRequest {
    private LocalDate pickedDate;
    private Meal meal;
    private String foodId;
    private List<IngredientExtraRequest> ingredientExtra;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    @Builder
    public static class IngredientExtraRequest {
        private int id;
        private String name;
        private double weight;
    }
}
