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
package com.tpd.eatwise_server.controller;

import com.tpd.eatwise_server.dto.request.UserPersonalizationRequest;
import com.tpd.eatwise_server.dto.request.UserUpdateGoalRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.UserGoalResponse;
import com.tpd.eatwise_server.entity.User;
import com.tpd.eatwise_server.service.AuthService;
import com.tpd.eatwise_server.service.UserService;
import com.tpd.eatwise_server.utils.APIResponseMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping("/goal")
    public ResponseEntity<UserGoalResponse> getUserGoal() {
        UserGoalResponse response = userService.getGoalUser();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/goal")
    public ResponseEntity<MessageResponse> updateUserGoal(@RequestBody UserUpdateGoalRequest request) {
        MessageResponse response = userService.updateUserGoal(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/personalization")
    public ResponseEntity<MessageResponse> updatePersonalization(@PathVariable("userId") String userId,
                                                                 @RequestBody UserPersonalizationRequest request) {
        var user = userService.updatePersonalization(userId, request);
        MessageResponse apiResponse = MessageResponse.builder()
                .status(HttpStatus.OK)
                .message(APIResponseMessage.SUCCESSFULLY_UPDATED.name())
                .data(user)
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
