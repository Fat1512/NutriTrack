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

import com.tpd.eatwise_server.dto.TokenDTO;
import com.tpd.eatwise_server.dto.UserAuthDTO;
import com.tpd.eatwise_server.dto.request.LoginRequest;
import com.tpd.eatwise_server.dto.request.RegisterRequest;
import com.tpd.eatwise_server.entity.User;
import com.tpd.eatwise_server.exceptions.BadRequestException;
import com.tpd.eatwise_server.repository.UserRepository;
import com.tpd.eatwise_server.service.AuthService;
import com.tpd.eatwise_server.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserAuthDTO login(LoginRequest loginRequest) {
        String usernameOrEmail = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        if (usernameOrEmail == null || password == null)
            throw new BadCredentialsException("Wrong username or password");

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(usernameOrEmail, password));

        UserDetails userDetail = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByUsername(userDetail.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Username doesn't exist"));

        TokenDTO tokenDTO = jwtService.generateToken(userDetail.getUsername(), user.getId());

        return UserAuthDTO.builder()
                .user(user)
                .tokenDTO(tokenDTO)
                .build();
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityUtils.getAuthentication();
        return userRepository.findByUsername(((UserDetails) authentication.getPrincipal()).getUsername())
                .orElseThrow(() -> new BadRequestException("User doesn't exist"));
    }

    @Override
    public void register(RegisterRequest loginRequest) {
        User user = User.builder()
                .username(loginRequest.getUsername())
                .password(passwordEncoder.encode(loginRequest.getPassword()))
                .build();
        userRepository.save(user);
    }
}












































