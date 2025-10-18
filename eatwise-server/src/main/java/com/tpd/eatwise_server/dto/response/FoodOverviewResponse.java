package com.tpd.eatwise_server.dto.response;

import com.tpd.eatwise_server.entity.Food;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class FoodOverviewResponse {
    private String id;
    private String image;
    private double totalCal;
    private double totalProtein;
    private double totalFat;
    private double totalCarb;
}
