package com.quolance.quolance_api.services.ai_models;

import org.json.JSONObject;

import java.util.Map;

public interface AiService {

    Map<String, Object> callAiApi(String prompt);

    /**
     * @param response the response from the AI API
     * @return the cleaned response text
     */
    String cleanApiResponse(Object response);

    void validateApiConfig();

    Map<String, Object> callAiApi(JSONObject jsonObject);

}
