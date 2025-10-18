package com.tpd.eatwise_server.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Setter @Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TokenDTO {
    private String accessToken;
}