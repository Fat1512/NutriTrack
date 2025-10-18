package com.tpd.eatwise_server.exceptions;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public  class ExceptionResponse {
    private String type;
    private String title;
    private int status;
    private String detail;
    private long timeStamp;
}
