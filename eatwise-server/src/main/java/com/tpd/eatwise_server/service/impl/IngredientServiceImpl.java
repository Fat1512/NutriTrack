package com.tpd.eatwise_server.service.impl;

import com.tpd.eatwise_server.dto.response.FoodDetailResponse;
import com.tpd.eatwise_server.dto.response.IngredientResponse;
import com.tpd.eatwise_server.entity.Ingredient;
import com.tpd.eatwise_server.mapper.IngredientMapper;
import com.tpd.eatwise_server.repository.IngredientRepository;
import com.tpd.eatwise_server.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IngredientServiceImpl implements IngredientService {
    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    @Override
    public List<IngredientResponse> findAll() {
        List<IngredientResponse> ingredientResponses = ingredientRepository.findAll().stream()
                .map(i -> ingredientMapper.convertToResponse(i))
                .collect(Collectors.toList());
        return ingredientResponses;
    }
}
