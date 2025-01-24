package com.quolance.quolance_api.unit.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.blog.ReactionDto;
import com.quolance.quolance_api.util.enums.ReactionType;

public class ReactionDtoTest {
        public static void main(String[] args) throws Exception {
            ObjectMapper objectMapper = new ObjectMapper();
    
            String json = "{ \"blogPostId\": 1, \"userId\": 1, \"reactionType\": \"LIKE\" }";
            ReactionDto dto = objectMapper.readValue(json, ReactionDto.class);
    
            System.out.println("Deserialized DTO: " + dto);
        
    }
}

 
