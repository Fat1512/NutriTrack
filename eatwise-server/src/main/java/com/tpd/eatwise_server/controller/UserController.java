package com.tpd.eatwise_server.controller;

import com.tpd.eatwise_server.dto.request.UserPersonalizationRequest;
import com.tpd.eatwise_server.dto.response.MessageResponse;
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
