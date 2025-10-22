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
package com.tpd.eatwise_server.service.impl;

import com.mongodb.DuplicateKeyException;
import com.tpd.eatwise_server.dto.request.RoutineAddFoodRequest;
import com.tpd.eatwise_server.dto.request.UserStatusRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.NutrientAggregationResponse;
import com.tpd.eatwise_server.dto.response.RoutineResponse;
import com.tpd.eatwise_server.entity.Food;
import com.tpd.eatwise_server.entity.Ingredient;
import com.tpd.eatwise_server.entity.Routine;
import com.tpd.eatwise_server.entity.User;
import com.tpd.eatwise_server.exceptions.ResourceNotFoundExeption;
import com.tpd.eatwise_server.mapper.FoodMapper;
import com.tpd.eatwise_server.mapper.RoutineMapper;
import com.tpd.eatwise_server.mapper.UserMapper;
import com.tpd.eatwise_server.repository.FoodRepository;
import com.tpd.eatwise_server.repository.IngredientRepository;
import com.tpd.eatwise_server.repository.RoutineRepository;
import com.tpd.eatwise_server.service.AuthService;
import com.tpd.eatwise_server.service.RoutineService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RoutineServiceImpl implements RoutineService {
    private final RoutineRepository routineRepository;
    private final FoodRepository foodRepository;
    private final FoodMapper foodMapper;
    private final IngredientRepository ingredientRepository;
    private final AuthService authService;
    private final RoutineMapper routineMapper;
    private final UserMapper userMapper;
    private final RestTemplate restTemplate;
    @Value(value = "${app.ai-server}")
    private String AI_SERVER_URL;

    @Override
    @Transactional
    public MessageResponse addFoodToRoutine(String userId, RoutineAddFoodRequest request) {
        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new ResourceNotFoundExeption("Not found"));
        Food copyFood = foodMapper.copy(food);
        Routine routine = routineRepository.findRoutinePickedDate(userId, request.getPickedDate())
                .orElse(new Routine(userId, request.getPickedDate()));

        if (request.getIngredientExtra() != null && !request.getIngredientExtra().isEmpty()) {
            double totalCal = 0;
            double totalCarb = 0;
            double totalFat = 0;
            double totalProtein = 0;

            for (var x : request.getIngredientExtra()) {
                Ingredient ingredient = ingredientRepository.findByName(x.getName())
                        .orElseThrow(() -> new ResourceNotFoundExeption("Not found ingredient"));

                totalCal += ingredient.getCal() * x.getWeight();
                totalProtein += ingredient.getProtein() * x.getWeight();
                totalFat += ingredient.getFat() * x.getWeight();
                totalCarb += ingredient.getCarb() * x.getWeight();
                copyFood.addIngredient(ingredient, x.getWeight());
            }
            copyFood.setTotalCal(totalCal);
            copyFood.setTotalProtein(totalProtein);
            copyFood.setTotalFat(totalFat);
            copyFood.setTotalCarb(totalCarb);
        }
        routine.addFoodRoutine(request.getMeal(), copyFood);
        routineRepository.save(routine);
        return MessageResponse.builder()
                .message("Successfully add food to routine")
                .status(HttpStatus.OK)
                .build();
    }

    @Override
    public MessageResponse analyzeRoutine(String pickedDate) {
        User user = authService.getCurrentUser();
        LocalDate date = LocalDate.parse(pickedDate, DateTimeFormatter.ISO_LOCAL_DATE);

        Routine routine = routineRepository.findRoutinePickedDate(user.getId(), date)
                .orElse(new Routine(user.getId(), date));

        UserStatusRequest statusRequest = userMapper.convertToUserRequest(user);

        String flaskUrl = AI_SERVER_URL + "/analyze-routine";


        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("userStatus", statusRequest);
        requestBody.put("routine", routine);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, requestBody, Map.class);
            Map<String, Object> flaskResult = response.getBody();

            return MessageResponse.builder()
                    .status(HttpStatus.OK)
                    .message("Successfully analyze routine")
                    .data(flaskResult)
                    .build();
        } catch (Exception e) {
            return MessageResponse.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .message("Failed to call Flask API: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public MessageResponse updateWaterConsume(String routineId, double water) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new ResourceNotFoundExeption("Not found routine"));
        routine.setWaterConsumeDay(water);
        routineRepository.save(routine);
        return MessageResponse.builder()
                .message("Successfully update water consume")
                .status(HttpStatus.OK)
                .build();
    }

    @Override
    public MessageResponse getMarkDay(int month, int year) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.plusMonths(1);

        User user = authService.getCurrentUser();
        List<LocalDate> dateList = routineRepository.findByUserIdAndMonth(user.getId(), startOfMonth, endOfMonth)
                .stream()
                .filter(Routine::checkActive)
                .map(Routine::getPickedDate)
                .sorted()
                .toList();
        return MessageResponse.builder()
                .message("Successfully get marked day")
                .status(HttpStatus.OK)
                .data(dateList)
                .build();
    }

    @Override
    public List<NutrientAggregationResponse> staticsNutrient(int month, int year) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.plusMonths(1);

        User user = authService.getCurrentUser();

        List<NutrientAggregationResponse> mapList = routineRepository.staticNutrient(user.getId(), startOfMonth, endOfMonth)
                .stream()
                .map(i -> NutrientAggregationResponse.builder()
                        .date((String) i.get("_id"))
                        .consumeCal((Double) i.get("totalCal"))
                        .consumeFat((Double) i.get("totalFat"))
                        .consumeProtein((Double) i.get("totalProtein"))
                        .consumeCarb((Double) i.get("totalCarb"))
                        .build()
                )
                .toList();

        return mapList;
    }

    @Override
    @Transactional
    public RoutineResponse getByUserIdAndPickedDate(String userId, String pickedDate) {
        LocalDate date = LocalDate.parse(pickedDate, DateTimeFormatter.ISO_LOCAL_DATE);

        Routine routine = routineRepository
                .findRoutinePickedDate(userId, date)
                .orElseGet(() -> {
                    Routine newRoutine = new Routine(userId, date);
                    try {
                        return routineRepository.save(newRoutine);
                    } catch (DuplicateKeyException e) {
                        return routineRepository.findRoutinePickedDate(userId, date)
                                .orElseThrow();
                    }
                });

        double consumeCal = 0;
        for (var x : routine.getFoods().entrySet()) {
            double cal = x.getValue().stream()
                    .mapToDouble(f -> f.getTotalCal())
                    .sum();
            consumeCal += cal;
        }
        RoutineResponse response = routineMapper.convertToResponse(routine);
        response.setConsumeCaloDaily(consumeCal);

        return response;
    }

    @Override
    public NutrientAggregationResponse aggNutrientConsume(String userId) {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        LocalDate startOfWeek = now.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = now.with(DayOfWeek.SUNDAY);


        NutrientAggregationResponse mapList = routineRepository.findWeeklyTotal(userId, startOfWeek, endOfWeek)
                .orElse(new NutrientAggregationResponse());

        return mapList;
    }
}
