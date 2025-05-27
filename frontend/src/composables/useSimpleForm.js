//useSimpleForm.js
import { ref } from 'vue';

/**
 * Manages basic form data, errors, and validation using a Yup schema.
 * @param {object} initialState - Starting form values.
 * @param {object} schema - Yup validation schema.
 */
export function useSimpleForm(initialState, schema) {
    const formData = ref({ ...initialState });
    const formErrors = ref({});

    /**
     * Validates the form using the schema.
     * Returns true if valid, false otherwise.
     * Updates formErrors with the first error found.
     */
    const validateForm = async () => {
        formErrors.value = {}; // Clear previous errors.
        try {
            await schema.validate(formData.value);
            return true; // If validation passed.
        } catch (error) {
            if (error.name === 'ValidationError') {
                // Set the single error message to its corresponding field.
                formErrors.value = { [error.path]: error.message };
            } else {
                // Handle unexpected errors during validation.
                console.error('Validation Error:', error);
                formErrors.value = { _general: 'An unexpected error occurred.' };
            }
            return false; // Validation failed.
        }
    };

    /**
     * Updates the form field's value and clears any validation errors.
     */
    const updateField = (field, value) => {
        formData.value[field] = value;
        formErrors.value = {};
    };

    return {
        formData,
        formErrors,
        validateForm,
        updateField,
    };
}