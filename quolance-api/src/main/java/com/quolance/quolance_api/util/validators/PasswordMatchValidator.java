package com.quolance.quolance_api.util.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.lang.reflect.Field;

/**
 * Validator to ensure that two password fields match within an object.
 * This is used for validation annotations like @PasswordMatch.
 */
public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, Object> {

    private String passwordFieldName;      // Name of the password field
    private String passwordMatchFieldName; // Name of the confirm password field

    /**
     * Initializes the validator with the fields specified in the @PasswordMatch annotation.
     *
     * @param constraintAnnotation The annotation instance containing configuration.
     */
    @Override
    public void initialize(PasswordMatch constraintAnnotation) {
        passwordFieldName = constraintAnnotation.passwordField();
        passwordMatchFieldName = constraintAnnotation.passwordConfirmationField();
    }

    /**
     * Validates if the password and confirmation password fields match.
     *
     * @param value   The object containing the fields to validate.
     * @param context Context in which the constraint is evaluated.
     * @return true if the password fields match; false otherwise.
     */
    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        try {
            // Retrieve the fields from the object class or its superclass
            Field passwordField = getField(value.getClass(), passwordFieldName);
            Field passwordMatchField = getField(value.getClass(), passwordMatchFieldName);

            // Make the fields accessible for reflection
            passwordField.setAccessible(true);
            passwordMatchField.setAccessible(true);

            // Get the values of the fields
            String password = (String) passwordField.get(value);
            String passwordMatch = (String) passwordMatchField.get(value);

            // Check if the password and confirm password fields are equal
            return password != null && password.equals(passwordMatch);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Retrieves a field from the class or its superclass if it exists.
     * This allows validation of fields that may be inherited from parent classes.
     *
     * @param clazz     The class to search for the field.
     * @param fieldName The name of the field to find.
     * @return The Field object.
     * @throws NoSuchFieldException if the field does not exist in the class hierarchy.
     */
    private Field getField(Class<?> clazz, String fieldName) throws NoSuchFieldException {
        while (clazz != null) { // Traverse the class hierarchy
            try {
                return clazz.getDeclaredField(fieldName); // Try to find the field in the current class
            } catch (NoSuchFieldException e) {
                clazz = clazz.getSuperclass(); // Move to the superclass
            }
        }
        // If the field is not found in the entire hierarchy, throw an exception
        throw new NoSuchFieldException("Field '" + fieldName + "' not found in class hierarchy.");
    }
}