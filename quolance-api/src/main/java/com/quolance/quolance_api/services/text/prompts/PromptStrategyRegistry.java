package com.quolance.quolance_api.services.text.prompts;

import com.quolance.quolance_api.entities.enums.PromptType;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class PromptStrategyRegistry {

    private final Map<PromptType, PromptStrategy> registry;

    public PromptStrategyRegistry(List<PromptStrategy> strategies) {
        this.registry = strategies.stream()
                .collect(Collectors.toMap(PromptStrategy::getType, strategy -> strategy));
    }

    public PromptStrategy getStrategy(PromptType type) {
        if (!registry.containsKey(type)) {
            throw new IllegalArgumentException("No prompt strategy found for type: " + type);
        }
        return registry.get(type);
    }
}
