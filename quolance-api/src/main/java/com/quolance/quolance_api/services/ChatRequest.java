package com.quolance.quolance_api.services;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ChatRequest {
    private String message;
    private List<String> chatHistory = new ArrayList<>();
}