package com.quolance.quolance_api.util;

import java.util.HashMap;
import java.util.Map;

public class FeatureToggle {
    private Map<String, Boolean> toggles = new HashMap<>();

    public Map<String, Boolean> getToggles() {
        return toggles;
    }

    public void setToggles(Map<String, Boolean> toggles) {
        this.toggles = toggles;
    }

    public boolean isEnabled(String featureName) {
        return toggles.getOrDefault(featureName, false);
    }
}