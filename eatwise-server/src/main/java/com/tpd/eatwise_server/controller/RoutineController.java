package com.tpd.eatwise_server.controller;

import com.tpd.eatwise_server.dto.request.FoodCreateRequest;
import com.tpd.eatwise_server.dto.request.RoutineAddFoodRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.RoutineResponse;
import com.tpd.eatwise_server.entity.User;
import com.tpd.eatwise_server.service.AuthService;
import com.tpd.eatwise_server.service.RoutineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping(value = "/api/v1")
@RequiredArgsConstructor
public class RoutineController {
    private final RoutineService routineService;
    private final AuthService authService;

    @PostMapping("/routine/food")
    public ResponseEntity<MessageResponse> addFoodToRoutine(@RequestBody RoutineAddFoodRequest request) {

        User user = authService.getCurrentUser();
        MessageResponse messageResponse = routineService.addFoodToRoutine(user.getId(), request);
        return new ResponseEntity<>(messageResponse, HttpStatus.CREATED);
    }

    @GetMapping("/routine/pickedDate")
    public ResponseEntity<RoutineResponse> getRoutineByPickedDate(
            @RequestParam("pickedDate") String pickedDate) {
        User user = authService.getCurrentUser();
        RoutineResponse messageResponse = routineService.getByUserIdAndPickedDate(user.getId(), pickedDate);
        return ResponseEntity.ok(messageResponse);
    }
}
