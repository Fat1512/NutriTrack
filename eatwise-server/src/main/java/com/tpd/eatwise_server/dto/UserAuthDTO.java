package com.tpd.eatwise_server.dto;


import com.tpd.eatwise_server.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Builder
@Setter
@Getter
public class UserAuthDTO {
    private User user;
    private TokenDTO tokenDTO;
}