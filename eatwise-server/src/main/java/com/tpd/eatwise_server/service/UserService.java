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
package com.tpd.eatwise_server.service;

import com.tpd.eatwise_server.dto.request.UserPersonalizationRequest;
import com.tpd.eatwise_server.dto.request.UserUpdateGoalRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.dto.response.UserGoalResponse;
import com.tpd.eatwise_server.entity.User;

public interface UserService {
    User updatePersonalization(String userId, UserPersonalizationRequest request);

    UserGoalResponse getGoalUser();

    MessageResponse updateUserGoal(UserUpdateGoalRequest request);
}
