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
