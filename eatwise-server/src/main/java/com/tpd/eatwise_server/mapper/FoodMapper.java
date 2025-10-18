package com.tpd.eatwise_server.mapper;

import com.tpd.eatwise_server.dto.request.FoodCreateRequest;
import com.tpd.eatwise_server.dto.response.FoodOverviewResponse;
import com.tpd.eatwise_server.entity.Food;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FoodMapper {

    @Mapping(target = "ingredients", ignore = true)
    Food convertToEntity(FoodCreateRequest request);

    FoodOverviewResponse convertToOverviewResponse(Food food);
}
