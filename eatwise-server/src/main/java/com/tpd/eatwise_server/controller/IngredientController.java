package com.tpd.eatwise_server.controller;

import com.tpd.eatwise_server.dto.response.IngredientResponse;
import com.tpd.eatwise_server.dto.response.PageResponse;
import com.tpd.eatwise_server.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.tpd.eatwise_server.utils.AppConstant.PAGE_DEFAULT;
import static com.tpd.eatwise_server.utils.AppConstant.PAGE_SIZE;

@RestController
@RequestMapping(value = "/api/v1")
@RequiredArgsConstructor
public class IngredientController {
    private final IngredientService ingredientService;

    @GetMapping("/ingredients")
    public ResponseEntity<List<IngredientResponse>> getFoods() {
        List<IngredientResponse> responses = ingredientService.findAll();
        return ResponseEntity.ok(responses);
    }
}
