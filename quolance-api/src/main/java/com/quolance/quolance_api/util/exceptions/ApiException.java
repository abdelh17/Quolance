package com.quolance.quolance_api.util.exceptions;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ApiException extends RuntimeException {
    private String message;
    private int status = 400;
    private Map<String, String> errors;

    public ApiException(String message) {
        super(message);
        this.message = message;
    }
}
