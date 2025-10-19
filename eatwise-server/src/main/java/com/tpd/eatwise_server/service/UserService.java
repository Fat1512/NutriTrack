package com.tpd.eatwise_server.service;

import com.tpd.eatwise_server.dto.request.UserPersonalizationRequest;
import com.tpd.eatwise_server.entity.User;

public interface UserService {
    User updatePersonalization(String userId, UserPersonalizationRequest request);
}
