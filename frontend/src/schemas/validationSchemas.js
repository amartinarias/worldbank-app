// validationSchemas.js
import * as yup from 'yup';

/**
 * Validation schema for the World Bank country lookup form.
 * Used by Yup to validate the 'isoCode' input.
 */
export const worldBankSchema = yup.object({
    isoCode: yup.string()
        // Automatically convert input to uppercase before other checks.
        .required('ISO Code is required.')
        // Ensures the field is not empty or null
        .transform(value => value.toUpperCase())
        // Ensures the field contains exactly 2 or 3 uppercase letters (A-Z).
        .matches(/^[A-Z]{2,3}$/, 'ISO code must be 2 or 3 letters.'),
});