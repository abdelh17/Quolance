package com.quolance.quolance_api.entities.enums;

public enum ProfileField {
    FIRST_NAME(10),
    LAST_NAME(10),
    USERNAME(10),
    PROFILE_IMAGE(10),
    BIO(10),
    CONTACT_EMAIL(10),
    CITY(10),
    STATE(10),
    EXPERIENCE_LEVEL(10),
    SOCIAL_MEDIA_LINKS(10),
    SKILLS(10),
    AVAILABILITY(10);

    private final int weight;

    ProfileField(int weight) {
        this.weight = weight;
    }

    public int getWeight() {
        return weight;
    }
}

