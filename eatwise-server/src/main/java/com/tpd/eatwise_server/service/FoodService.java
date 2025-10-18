package com.tpd.eatwise_server.service;

import com.tpd.eatwise_server.dto.request.FoodCreateRequest;
import com.tpd.eatwise_server.dto.response.FoodOverviewResponse;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.PageResponse;

public interface FoodService {
    MessageResponse createFood(FoodCreateRequest request);

    PageResponse<FoodOverviewResponse> getFoods(int page, int size);
}
