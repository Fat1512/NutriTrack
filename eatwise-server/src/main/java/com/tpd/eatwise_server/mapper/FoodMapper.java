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
package com.tpd.eatwise_server.mapper;

import com.tpd.eatwise_server.dto.request.FoodCreateRequest;
import com.tpd.eatwise_server.dto.response.FoodDetailResponse;
import com.tpd.eatwise_server.dto.response.FoodOverviewResponse;
import com.tpd.eatwise_server.entity.Food;
import com.tpd.eatwise_server.entity.Ingredient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FoodMapper {

    @Mapping(target = "ingredients", ignore = true)
    Food convertToEntity(FoodCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ingredients", ignore = true)
    @Mapping(target = "totalCal", ignore = true)
    @Mapping(target = "totalProtein", ignore = true)
    @Mapping(target = "totalFat", ignore = true)
    @Mapping(target = "totalCarb", ignore = true)
    Food copy(Food source);

    FoodOverviewResponse convertToOverviewResponse(Food food);

    FoodDetailResponse convertToDetailResponse(Food food);

    default List<FoodDetailResponse.IngredientResponse> mapIngredients(List<Food.IngredientFood> ingredients) {
        if (ingredients == null) return null;
        return ingredients.stream().map(this::mapIngredient).toList();
    }

    default FoodDetailResponse.IngredientResponse mapIngredient(Food.IngredientFood ingredient) {
        FoodDetailResponse.IngredientResponse response = FoodDetailResponse.IngredientResponse.builder()
                .id(ingredient.getId())
                .fat(ingredient.getFat())
                .cal(ingredient.getCal())
                .carb(ingredient.getCarb())
                .protein(ingredient.getProtein())
                .name(ingredient.getName())
                .weight(ingredient.getWeight())
                .build();
        return response;
    }

}
