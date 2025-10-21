package com.tpd.eatwise_server.mapper;

import com.tpd.eatwise_server.dto.response.IngredientResponse;
import com.tpd.eatwise_server.entity.Ingredient;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IngredientMapper {
    IngredientResponse convertToResponse(Ingredient ingredient);
}
