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

    FoodOverviewResponse convertToOverviewResponse(Food food);

    FoodDetailResponse convertToDetailResponse(Food food);

    default List<FoodDetailResponse.IngredientResponse> mapIngredients(List<Food.IngredientFood> ingredients) {
        if (ingredients == null) return null;
        return ingredients.stream().map(this::mapIngredient).toList();
    }

    default FoodDetailResponse.IngredientResponse mapIngredient(Food.IngredientFood ingredient) {
        FoodDetailResponse.IngredientResponse response = FoodDetailResponse.IngredientResponse.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .weight(ingredient.getWeight())
                .build();
        return response;
    }

}
