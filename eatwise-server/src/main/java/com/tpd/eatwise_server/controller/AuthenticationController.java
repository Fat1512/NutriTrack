package com.tpd.eatwise_server.controller;

import com.tpd.eatwise_server.dto.UserAuthDTO;
import com.tpd.eatwise_server.dto.request.LoginRequest;
import com.tpd.eatwise_server.dto.request.RegisterRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
import com.tpd.eatwise_server.entity.User;
import com.tpd.eatwise_server.service.AuthService;
import com.tpd.eatwise_server.utils.APIResponseMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<MessageResponse> login(@RequestBody LoginRequest loginRequest) {
        UserAuthDTO userAuthDTO = authService.login(loginRequest);
        MessageResponse apiResponse = MessageResponse.builder()
                .status(HttpStatus.OK)
                .message("da login")
                .data(userAuthDTO)
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@RequestBody RegisterRequest registerRequest)  {
        authService.register(registerRequest);
        MessageResponse apiResponse = MessageResponse.builder()
                .status(HttpStatus.OK)
                .message(APIResponseMessage.SUCCESSFULLY_REGISTER.name())
                .data(null)
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping("/profile")
    public ResponseEntity<MessageResponse> profile() {
        User user = authService.getCurrentUser();
        MessageResponse apiResponse = MessageResponse.builder()
                .status(HttpStatus.OK)
                .message(APIResponseMessage.SUCCESSFULLY_RETRIEVED.name())
                .data(user)
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

}