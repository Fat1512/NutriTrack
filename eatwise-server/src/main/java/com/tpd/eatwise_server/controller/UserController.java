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
