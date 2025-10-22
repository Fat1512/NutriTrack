/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.tpd.eatwise_server.controller;

import com.tpd.eatwise_server.dto.request.FoodCreateRequest;
import com.tpd.eatwise_server.dto.request.RoutineAddFoodRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.NutrientAggregationResponse;
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
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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

    @PutMapping("/routine/{id}/water-consume")
    public ResponseEntity<MessageResponse> updateWaterConsume(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        double waterConsume = Double.parseDouble(request.getOrDefault("waterConsume", "0"));
        MessageResponse messageResponse = routineService.updateWaterConsume(id, waterConsume);
        return new ResponseEntity<>(messageResponse, HttpStatus.CREATED);
    }

    @GetMapping("/routine/analyze-routine")
    public ResponseEntity<MessageResponse> analyzeRoutine(
            @RequestParam("pickedDate") String pickedDate) {

        MessageResponse messageResponse = routineService.analyzeRoutine(pickedDate);
        return ResponseEntity.ok(messageResponse);
    }

    @GetMapping("/routine/pickedDate")
    public ResponseEntity<RoutineResponse> getRoutineByPickedDate(
            @RequestParam("pickedDate") String pickedDate) {
        User user = authService.getCurrentUser();
        RoutineResponse messageResponse = routineService.getByUserIdAndPickedDate(user.getId(), pickedDate);
        return ResponseEntity.ok(messageResponse);
    }

    @GetMapping("/routine/statics")
    public ResponseEntity<List<NutrientAggregationResponse>> getStaticsNutrient(
            @RequestParam(value = "month", required = false) String month,
            @RequestParam(value = "year", required = false) String year) {
        LocalDate now = LocalDate.now();

        int targetMonth = (month != null) ? Integer.parseInt(month) : now.getMonthValue();
        int targetYear = (year != null) ? Integer.parseInt(year) : now.getYear();

        List<NutrientAggregationResponse> messageResponse = routineService.staticsNutrient(targetMonth, targetYear);
        return ResponseEntity.ok(messageResponse);
    }

    @GetMapping("/routine/marked")
    public ResponseEntity<MessageResponse> getMarkedDay(
            @RequestParam(value = "month", required = false) String month,
            @RequestParam(value = "year", required = false) String year) {
        LocalDate now = LocalDate.now();

        int targetMonth = (month != null) ? Integer.parseInt(month) : now.getMonthValue();
        int targetYear = (year != null) ? Integer.parseInt(year) : now.getYear();

        MessageResponse messageResponse = routineService.getMarkDay(targetMonth, targetYear);
        return ResponseEntity.ok(messageResponse);
    }


    @GetMapping("/routine/consume-nutrient")
    public ResponseEntity<NutrientAggregationResponse> getAggreationConsumeNutrient() {
        User user = authService.getCurrentUser();
        NutrientAggregationResponse messageResponse = routineService.aggNutrientConsume(user.getId());
        return ResponseEntity.ok(messageResponse);
    }
}
