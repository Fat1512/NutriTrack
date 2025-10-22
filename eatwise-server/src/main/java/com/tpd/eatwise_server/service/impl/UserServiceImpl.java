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

import com.tpd.eatwise_server.dto.request.UserPersonalizationRequest;
import com.tpd.eatwise_server.dto.request.UserUpdateGoalRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.UserGoalResponse;
import com.tpd.eatwise_server.entity.User;
import com.tpd.eatwise_server.exceptions.ResourceNotFoundExeption;
import com.tpd.eatwise_server.mapper.UserMapper;
import com.tpd.eatwise_server.repository.UserRepository;
import com.tpd.eatwise_server.service.AuthService;
import com.tpd.eatwise_server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthService authService;

    @Override
    public User updatePersonalization(String userId, UserPersonalizationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAge(request.getAge());
        user.setEatingHabit(request.getEatingHabit());
        user.setGender(request.getGender());
        user.setHealthIssues(request.getHealthIssues());
        user.setHeight(request.getHeight());
        user.setMainGoal(request.getMainGoal());
        user.setSpecificDiet(request.getSpecificDiet());
        user.setWeight(request.getWeight());
        user.setTargetWeight(request.getTargetWeight());
        user.setIsOnboarded(true);
        userRepository.save(user);
        return user;
    }

    @Override
    public UserGoalResponse getGoalUser() {
        User user = authService.getCurrentUser();

        return userMapper.convertToUserGoalResponse(user);
    }

    @Override
    @Transactional
    public MessageResponse updateUserGoal(UserUpdateGoalRequest request) {
        User user = authService.getCurrentUser();

        userMapper.updateUserGoal(request, user);
        userRepository.save(user);
        return MessageResponse.builder()
                .status(HttpStatus.OK)
                .message("Successfully update goal user")
                .build();
    }
}

