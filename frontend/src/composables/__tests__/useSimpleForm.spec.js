import { describe, it, expect, beforeEach } from 'vitest';
import { useSimpleForm } from '../useSimpleForm';
import { worldBankSchema } from '../../schemas/validationSchemas';

describe('useSimpleForm (with updateField clearing all errors)', () => {
    const initialState = { isoCode: '' };
    let formData, formErrors, validateForm, updateField;

    beforeEach(() => {
        // Re-initialize the composable before each test
        const composableResult = useSimpleForm({ ...initialState }, worldBankSchema);
        formData = composableResult.formData;
        formErrors = composableResult.formErrors;
        validateForm = composableResult.validateForm;
        updateField = composableResult.updateField;
    });

    // TEST 1:
    it('initializes with given state and empty errors', () => {
        expect(formData.value).toEqual({ isoCode: '' });
        expect(formErrors.value).toEqual({});
    });

    // TEST 2:
    it('updateField updates formData and clears all formErrors', () => {
        // Arrange: Set up some initial errors
        formErrors.value = { isoCode: 'Previous isoCode error', anotherField: 'Another error' };

        // Act: Update the 'isoCode' field
        updateField('isoCode', 'US');

        // Assert: Check formData and that all errors are cleared
        expect(formData.value.isoCode).toBe('US');
        expect(formErrors.value).toEqual({});
    });

    //  TEST 3:
    it('updateField clears any pre-existing errors when a field is updated', () => {
        // Arrange: Set up some initial errors
        formErrors.value = { anotherField: 'Some other pre-existing error' };

        // Act: Update the 'isoCode' field
        updateField('isoCode', 'GB');

        // Assert: Check formData and that all errors are cleared
        expect(formData.value.isoCode).toBe('GB');
        expect(formErrors.value).toEqual({});
    });

    // TEST 4:
    it('validateForm returns true for valid data and sets no errors', async () => {
        // Arrange: Set a valid value for isoCode.
        updateField('isoCode', 'GB');

        // Act: Perform validation.
        const isValid = await validateForm();

        // Assert: Check that validation passed and no errors were set.
        expect(isValid).toBe(true);
        expect(formErrors.value).toEqual({});
    });

    // TEST 5:
    it('validateForm correctly uses Yup transform for uppercase', async () => {
        // Arrange: Set a lowercase value that becomes valid after transformation.
        updateField('isoCode', 'fr');

        // Act: Perform validation.
        const isValid = await validateForm();

        // Assert: Validation should pass, original formData should be unchanged by transform, and no errors.
        expect(isValid).toBe(true);
        expect(formData.value.isoCode).toBe('fr');
        expect(formErrors.value).toEqual({});
    });

    // TEST 6:
    it('validateForm returns false and sets errors for required field', async () => {
        // Arrange: Set the field to an empty string.
        updateField('isoCode', '');

        // Act: Perform validation.
        const isValid = await validateForm();

        // Assert: Check that validation failed and the correct error message is set.
        expect(isValid).toBe(false);
        expect(formErrors.value.isoCode).toBe('ISO Code is required.');
    });

    // TEST 7:
    it('validateForm returns false and sets errors for pattern mismatch (too short)', async () => {
        // Arrange: Set an input that is too short according to the schema.
        updateField('isoCode', 'U');

        // Act: Perform validation.
        const isValid = await validateForm();

        // Assert: Check that validation failed and the correct error message is set.
        expect(isValid).toBe(false);
        expect(formErrors.value.isoCode).toBe('ISO code must be 2 or 3 letters.');
    });

    // TEST 8:
    it('validateForm returns false and sets errors for pattern mismatch (too long)', async () => {
        // Arrange: Set an input that is too long according to the schema.
        updateField('isoCode', 'USA1');

        // Act: Perform validation.
        const isValid = await validateForm();

        // Assert: Check that validation failed and the correct error message is set.
        expect(isValid).toBe(false);
        expect(formErrors.value.isoCode).toBe('ISO code must be 2 or 3 letters.');
    });
});