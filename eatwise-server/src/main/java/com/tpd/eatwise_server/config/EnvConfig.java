package com.tanle.e_commerce.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    private static final Dotenv dotenv = Dotenv.load(); // Automatically loads .env from project root

    public static String get(String key) {
        return dotenv.get(key);
    }
}
