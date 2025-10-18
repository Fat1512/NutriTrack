package com.tpd.eatwise_server.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tpd.eatwise_server.exceptions.ExceptionResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAccessDeniedException implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ExceptionResponse exceptionResponse = ExceptionResponse.builder()
                .type("/exception/" + accessDeniedException.getClass().getSimpleName())
                .title("Access denied")
                .detail(accessDeniedException.getMessage())
                .timeStamp(System.currentTimeMillis())
                .status(HttpStatus.FORBIDDEN.value())
                .build();

        ObjectMapper objectMapper = new ObjectMapper();

        response.getWriter().write(objectMapper.writeValueAsString(exceptionResponse));
        response.flushBuffer();
    }
}
