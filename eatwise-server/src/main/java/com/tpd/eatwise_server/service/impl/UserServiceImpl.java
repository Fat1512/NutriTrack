package com.tpd.eatwise_server.service.impl;

import com.tpd.eatwise_server.dto.request.UserPersonalizationRequest;
import com.tpd.eatwise_server.entity.User;
import com.tpd.eatwise_server.repository.UserRepository;
import com.tpd.eatwise_server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

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
}

