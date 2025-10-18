package com.tpd.eatwise_server.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodCreateRequest {
    private String name;
    private String image;
    private List<IngredientRequest> ingredients;

    @Data
    @NoArgsConstructor
    public static class IngredientRequest {
        private String name;
        private double weight;
    }
}
