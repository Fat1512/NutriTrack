package com.tpd.eatwise_server.service;

import com.tpd.eatwise_server.dto.response.IngredientResponse;

import java.util.List;

public interface IngredientService {
    List<IngredientResponse> findAll();
}
