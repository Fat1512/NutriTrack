package com.tpd.eatwise_server.controller;

import com.tpd.eatwise_server.dto.request.FoodCreateRequest;
import com.tpd.eatwise_server.dto.response.FoodDetailResponse;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.PageResponse;
import com.tpd.eatwise_server.service.FoodService;
import com.tpd.eatwise_server.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static com.tpd.eatwise_server.utils.AppConstant.*;

@RestController
@RequestMapping(value = "/api/v1")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;
//    private final UploadService uploadService;

    @PostMapping("/food")
    public ResponseEntity<MessageResponse> creatFood(@RequestBody FoodCreateRequest request) {
        MessageResponse messageResponse = foodService.createFood(request);
        return new ResponseEntity<>(messageResponse, HttpStatus.CREATED);
    }

    @GetMapping("/food/{id}")
    public ResponseEntity<FoodDetailResponse> getFood(@PathVariable String id) {
        FoodDetailResponse pageResponse = foodService.getFood(id);
        return ResponseEntity.ok(pageResponse);
    }

    @GetMapping("/foods")
    public ResponseEntity<PageResponse> getFoods(@RequestParam(value = "page", defaultValue = PAGE_DEFAULT) String page,
                                                 @RequestParam(value = "size", defaultValue = PAGE_SIZE) String size) {
        PageResponse pageResponse = foodService.getFoods(Integer.parseInt(page), Integer.parseInt(size));
        return ResponseEntity.ok(pageResponse);
    }

//    @PostMapping("/food/image")
//    public ResponseEntity<MessageResponse> uploadImage(@RequestParam(value = "file") MultipartFile file) {
//        MessageResponse messageResponse = uploadService.uploadImage(file);
//        return new ResponseEntity<>(messageResponse, HttpStatus.CREATED);
//    }
}
