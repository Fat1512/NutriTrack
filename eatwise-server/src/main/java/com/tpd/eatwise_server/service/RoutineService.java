package com.tpd.eatwise_server.service;

import com.tpd.eatwise_server.dto.request.RoutineAddFoodRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.RoutineResponse;

import java.time.LocalDate;

public interface RoutineService {
    MessageResponse addFoodToRoutine(String userId, RoutineAddFoodRequest request);

    RoutineResponse getByUserIdAndPickedDate(String userId, String pickedDate);
}
