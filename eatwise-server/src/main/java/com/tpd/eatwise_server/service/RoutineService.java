package com.tpd.eatwise_server.service;

import com.tpd.eatwise_server.dto.request.RoutineAddFoodRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.NutrientAggregationResponse;
import com.tpd.eatwise_server.dto.response.RoutineResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface RoutineService {
    MessageResponse addFoodToRoutine(String userId, RoutineAddFoodRequest request);

    MessageResponse updateWaterConsume(String routineId, double water);

    MessageResponse getMarkDay(int month, int year);

    List<NutrientAggregationResponse> staticsNutrient(int month, int year);

    RoutineResponse getByUserIdAndPickedDate(String userId, String pickedDate);

    NutrientAggregationResponse aggNutrientConsume(String userId);
}
