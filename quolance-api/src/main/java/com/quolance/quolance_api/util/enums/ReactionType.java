package com.quolance.quolance_api.util.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Getter;

@Getter
public enum ReactionType {
    LIKE, LOVE, LAUGH, SAD, ANGRY;

    @JsonCreator
    public static ReactionType forValue(String value) {
        return ReactionType.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
