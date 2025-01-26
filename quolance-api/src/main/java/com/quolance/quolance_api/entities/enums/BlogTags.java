package com.quolance.quolance_api.entities.enums;

public enum BlogTags {
    QUESTION,
    SUPPORT,
    FREELANCING,
    SKILL_MATCHING,
    REMOTE_WORK,
    AI_SUGGESTIONS,
    SECURITY,
    TALENT_MARKETPLACE,
    GLOBAL_OPPORTUNITIES,
    VERIFIED_PROFILES,
    COLLABORATION_TOOLS,
    PROFESSIONAL_NETWORK,
    BILLING;

    @Override
    public String toString() {
        // Replace underscores with spaces and capitalize words for display purposes
        return name().replace('_', ' ').toLowerCase();
    }
}