package com.quolance.quolance_api.entities.enums;

import java.util.Arrays;

public enum ProjectSortFields {

    ID("id"),
    TITLE("title"),
    EXPIRATION_DATE("expirationDate"),
    CREATION_DATE("creationDate"),
    PROJECT_STATUS("projectStatus");

    private final String fieldName;

    ProjectSortFields(String fieldName) {
        this.fieldName = fieldName;
    }

    public static boolean isValidField(String field) {
        return Arrays.stream(values())
                .map(ProjectSortFields::getFieldName)
                .anyMatch(name -> name.equals(field));
    }

    public String getFieldName() {
        return fieldName;
    }
}
