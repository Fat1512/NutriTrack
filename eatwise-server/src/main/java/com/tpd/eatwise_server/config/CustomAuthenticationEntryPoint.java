package com.tpd.eatwise_server.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tpd.eatwise_server.exceptions.ExceptionResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        log.error("Authentication failed");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ExceptionResponse exceptionResponse = ExceptionResponse.builder()
                .type("/exception/" + authException.getClass().getSimpleName())
                .title("Access denied")
                .detail(authException.getMessage())
                .timeStamp(System.currentTimeMillis())
                .status(HttpStatus.UNAUTHORIZED.value())
                .build();

        ObjectMapper objectMapper = new ObjectMapper();

        response.getWriter().write(objectMapper.writeValueAsString(exceptionResponse));
        response.flushBuffer();
    }
}
