package com.tpd.eatwise_server.exceptions;

public class ResourceNotFoundExeption extends RuntimeException{
    public ResourceNotFoundExeption(String message) {
        super(message);
    }
}
