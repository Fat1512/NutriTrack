package com.tpd.eatwise_server.service.impl;

import com.tpd.eatwise_server.dto.request.RoutineAddFoodRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.RoutineResponse;
import com.tpd.eatwise_server.entity.Food;
import com.tpd.eatwise_server.entity.Ingredient;
import com.tpd.eatwise_server.entity.Routine;
import com.tpd.eatwise_server.exceptions.ResourceNotFoundExeption;
import com.tpd.eatwise_server.mapper.FoodMapper;
import com.tpd.eatwise_server.mapper.RoutineMapper;
import com.tpd.eatwise_server.repository.FoodRepository;
import com.tpd.eatwise_server.repository.IngredientRepository;
import com.tpd.eatwise_server.repository.RoutineRepository;
import com.tpd.eatwise_server.service.RoutineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class RoutineServiceImpl implements RoutineService {
    private final RoutineRepository routineRepository;
    private final FoodRepository foodRepository;
    private final FoodMapper foodMapper;
    private final IngredientRepository ingredientRepository;
    private final RoutineMapper routineMapper;

    @Override
    @Transactional
    public MessageResponse addFoodToRoutine(String userId, RoutineAddFoodRequest request) {
        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new ResourceNotFoundExeption("Not found"));
        Food copyFood = foodMapper.copy(food);
        Routine routine = routineRepository.findRoutinePickedDate(userId, request.getPickedDate())
                .orElse(new Routine());

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
    @Transactional
    public RoutineResponse getByUserIdAndPickedDate(String userId, String pickedDate) {
        LocalDate date = LocalDate.parse(pickedDate, DateTimeFormatter.ISO_LOCAL_DATE);

        Routine routine = routineRepository
                .findRoutinePickedDate(userId, date)
                .orElseGet(() -> {
                    Routine newRoutine = new Routine(userId, date);
                    return routineRepository.save(newRoutine);
                });

        return routineMapper.convertToResponse(routine);
    }
}
