package com.quolance.quolance_api.util;

import java.util.Map;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ApiException extends RuntimeException {
    private String message;
    private int status = 400;
    private Map<String, String> errors;
}
