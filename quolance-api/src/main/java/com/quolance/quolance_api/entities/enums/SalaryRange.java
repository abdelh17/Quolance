package com.quolance.quolance_api.entities.enums;

public enum SalaryRange {
    RANGE_0_50K("$0-50K"),
    RANGE_50K_100K("$50K-100K"),
    RANGE_100K_150K("$100K-150K"),
    RANGE_150K_200K("$150K-200K"),
    RANGE_200K_PLUS("$200K+");

    private final String range;

    SalaryRange(String range) {
        this.range = range;
    }

    public String getRange() {
        return range;
    }
}
