package com.tpd.eatwise_server.service;

import com.tpd.eatwise_server.dto.UserAuthDTO;
import com.tpd.eatwise_server.dto.request.LoginRequest;
import com.tpd.eatwise_server.dto.request.RegisterRequest;
import com.tpd.eatwise_server.entity.User;

public interface AuthService {
    UserAuthDTO login(LoginRequest loginRequest);
    void register(RegisterRequest loginRequest);
    User getCurrentUser();
}