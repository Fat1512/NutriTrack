package com.tpd.eatwise_server.service.impl;

import com.tpd.eatwise_server.dto.request.FoodCreateRequest;
import com.tpd.eatwise_server.dto.response.FoodDetailResponse;
import com.tpd.eatwise_server.dto.response.FoodOverviewResponse;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.PageResponse;
import com.tpd.eatwise_server.entity.Food;
import com.tpd.eatwise_server.entity.Ingredient;
import com.tpd.eatwise_server.exceptions.ResourceNotFoundExeption;
import com.tpd.eatwise_server.mapper.FoodMapper;
import com.tpd.eatwise_server.repository.FoodRepository;
import com.tpd.eatwise_server.repository.IngredientRepository;
import com.tpd.eatwise_server.service.FoodService;
import com.tpd.eatwise_server.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;
    private final IngredientRepository ingredientRepository;
    private final FoodMapper foodMapper;

    @Override
    public MessageResponse createFood(FoodCreateRequest request) {
        Food food = foodMapper.convertToEntity(request);
        food.setCreatedAt(LocalDateTime.now());
        double totalProtein = 0;
        double totalFat = 0;
        double totalCal = 0;
        double totalCarb = 0;
        for (FoodCreateRequest.IngredientRequest i : request.getIngredients()) {
            Optional<Ingredient> optionalIngredient = ingredientRepository.findByName(i.getName());

            if (!optionalIngredient.isPresent()) continue;

            Ingredient ingredient = optionalIngredient.get();

            totalProtein += ingredient.getProtein() * i.getWeight();
            totalCarb += ingredient.getCarb() * i.getWeight();
            totalFat += ingredient.getFat() * i.getWeight();
            totalCal += ingredient.getCal() * i.getWeight();

            food.addIngredient(ingredient, i.getWeight());
        }
        food.setTotalCal(totalCal);
        food.setTotalProtein(totalProtein);
        food.setTotalFat(totalFat);
        food.setTotalCarb(totalCarb);

        foodRepository.save(food);

        return MessageResponse.builder()
                .message("Successfully create food")
                .status(HttpStatus.CREATED)
                .build();
    }

    @Override
    public PageResponse<FoodOverviewResponse> getFoods(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Food> pageFood = foodRepository.findAll(pageable);

        List<FoodOverviewResponse> data = pageFood.get()
                .map(p -> foodMapper.convertToOverviewResponse(p))
                .collect(Collectors.toList());


        return PageResponse.<FoodOverviewResponse>builder()
                .content(data)
                .last(pageFood.isLast())
                .totalPages(pageFood.getTotalPages())
                .page(page)
                .size(pageFood.getSize())
                .totalElements(pageFood.getTotalElements())
                .build();
    }

    @Override
    public FoodDetailResponse getFood(String id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundExeption("Not found food"));


        return foodMapper.convertToDetailResponse(food);
    }
}
