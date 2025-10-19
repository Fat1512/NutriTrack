package com.tpd.eatwise_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class FoodDetailResponse {
    private String id;
    private String name;
    private String image;
    private double totalCal;
    private double totalProtein;
    private double totalFat;
    private double totalCarb;
    private List<IngredientResponse> ingredients;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    @Builder
    public static class IngredientResponse {
        private int id;
        private String name;
        private double weight;
    }
}
