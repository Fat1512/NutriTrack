package com.tpd.eatwise_server.dto.response;

import com.tpd.eatwise_server.entity.Food;
import com.tpd.eatwise_server.entity.Meal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineResponse {
    private String id;
    private String userId;
    private LocalDate pickedDate;
    private LocalDateTime createdAt;
    private Map<Meal, List<Food>> foods;
    private double waterConsumeDay;
}
