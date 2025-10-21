package com.tpd.eatwise_server.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }
}
