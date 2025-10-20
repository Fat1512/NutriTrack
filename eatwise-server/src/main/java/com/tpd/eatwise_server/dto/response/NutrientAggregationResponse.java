package com.tpd.eatwise_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutrientAggregationResponse {
    private String date;

    private double consumeProtein;
    private double consumeCal;
    private double consumeCarb;
    private double consumeFat;
}
