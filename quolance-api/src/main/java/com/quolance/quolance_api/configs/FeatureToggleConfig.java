package com.quolance.quolance_api.configs;

import com.quolance.quolance_api.util.FeatureToggle;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:toggles.properties")
public class FeatureToggleConfig {
    @Bean
    @ConfigurationProperties(prefix = "feature.toggles")
    public FeatureToggle featureToggle() {
        return new FeatureToggle();
    }
}