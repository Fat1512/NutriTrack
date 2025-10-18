package com.tpd.eatwise_server.service;

import com.tpd.eatwise_server.dto.UserAuthDTO;
import com.tpd.eatwise_server.dto.request.LoginRequest;
import com.tpd.eatwise_server.dto.request.RegisterRequest;

public interface AuthService {
    UserAuthDTO login(LoginRequest loginRequest);
    void register(RegisterRequest loginRequest);
}