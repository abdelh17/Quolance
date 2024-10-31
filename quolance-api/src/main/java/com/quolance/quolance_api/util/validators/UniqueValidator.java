package com.quolance.quolance_api.util.validators;

import com.quolance.quolance_api.repositories.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

@Component
public class UniqueValidator implements ConstraintValidator<Unique, String> {

    private final UserRepository userRepository;
    private String columnName;

    public UniqueValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void initialize(Unique constraintAnnotation) {
        columnName = constraintAnnotation.columnName();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true; // Consider null or blank values as valid (optional, adjust as needed)
        }

        switch (columnName.toLowerCase()) {
            case "email":
                return !userRepository.existsByEmail(value);
            // Add more cases if you want to check other columns
            default:
                throw new IllegalArgumentException("Unknown column: " + columnName);
        }
    }
}
