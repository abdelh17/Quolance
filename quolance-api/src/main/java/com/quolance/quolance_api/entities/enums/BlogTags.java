package com.quolance.quolance_api.entities.enums;

public enum BlogTags {
    QUESTION("Questions"),
    SUPPORT("Support"),
    FREELANCING("Freelancing"),
    SKILL_MATCHING("Skill Matching"),
    REMOTE_WORK("Remote Work"),
    AI_SUGGESTIONS("AI-Driven Suggestions"),
    SECURITY("Security"),
    TALENT_MARKETPLACE("Talent Marketplace"),
    GLOBAL_OPPORTUNITIES("Global Opportunities"),
    VERIFIED_PROFILES("Verified Profiles"),
    COLLABORATION_TOOLS("Collaboration Tools"),
    PROFESSIONAL_NETWORK("Professional Network"),
    BILLING("Billing");

    private final String displayName;

    // Constructor
    BlogTags(String displayName) {
        this.displayName = displayName;
    }

    // Getter
    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}