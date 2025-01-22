package com.quolance.quolance_api.util.exceptions;

import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
public class HttpErrorResponse {
    private String message;
    private int status;
    private Map<String, String> errors;
    private List<String> generalErrors;

    public static HttpErrorResponse of(String message, int status, Map<String, String> errors, List<String> generalErrors) {
        HttpErrorResponse response = new HttpErrorResponse();
        response.message = message;
        response.status = status;
        response.errors = errors;
        response.generalErrors = generalErrors;
        return response;
    }

    public static HttpErrorResponse of(String message, int status) {
        HttpErrorResponse response = new HttpErrorResponse();
        response.message = message;
        response.status = status;
        return response;
    }
}
