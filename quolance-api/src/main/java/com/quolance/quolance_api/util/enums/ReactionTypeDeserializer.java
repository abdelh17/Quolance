package com.quolance.quolance_api.util.enums;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.quolance.quolance_api.util.enums.ReactionType;

import java.io.IOException;

public class ReactionTypeDeserializer extends JsonDeserializer<ReactionType> {
    @Override
    public ReactionType deserialize(JsonParser parser, DeserializationContext context) throws IOException {
        String value = parser.getText().toUpperCase();
        try {
            return ReactionType.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw new IOException("Invalid reaction type: " + value);
        }
    }
}
