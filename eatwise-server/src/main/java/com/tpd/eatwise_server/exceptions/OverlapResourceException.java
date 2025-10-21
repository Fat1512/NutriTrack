package com.tpd.eatwise_server.exceptions;

public class OverlapResourceException extends RuntimeException {
    public OverlapResourceException(String message) {
        super(message);
    }
}
