package com.tpd.eatwise_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientResponse {
    private int id;
    private String name;
    private double cal;
    private double fat;
    private double carb;
    private double protein;
}
