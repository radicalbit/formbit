import { ObjectSchema, ValidationError as YupValidationError, ValidateOptions as YupValidateOptions } from 'yup'
import { ACTIONS } from '../helpers/constants'

// ─── Internal / Utility Types ────────────────────────────────────────────────

/**
 * @internal
 * @private
 */
export type Action = keyof typeof ACTIONS

/**
 * @internal
 * Generic object with string keys.
 */
export type FormbitRecord = Record<string, unknown>

/** @deprecated Use {@link FormbitRecord} instead. Renamed to avoid shadowing the global `Object`. */
export type Object = FormbitRecord

/**
 * @internal
 */
export type GenericCallback<Values extends InitialValues> = SuccessCallback<Values> | ErrorCallback<Values>

/**
 * @internal
 */
export type ValidationFormbitError = Pick<ValidationError, 'message' | 'path'>

/**
 * @internal
 * @private
 */
export type WriteOrRemove<Values extends Form> =
    (path: keyof Values | string, value: unknown, options?: WriteFnOptions<Values>, action?: Action) => void

/**
 * @internal
 * @private
 */
export type PrivateValidateForm<Values extends InitialValues> = (
    successCallback?: SuccessCallback<Values>,
    errorCallback?: ErrorCallback<Partial<Values>>,
    options?: { options?: ValidateOptions, isDirty?: boolean }) => void

// ─── Core Value Types ────────────────────────────────────────────────────────

/**
 * Base type for form values: a record of string keys with an optional `__metadata` field.
 */
export type FormbitValues = { __metadata?: FormbitRecord } & FormbitRecord

/** Object containing the updated form. */
export type Form = FormbitValues

/** InitialValues used to set up formbit; also used to reset the form to its original version. */
export type InitialValues = FormbitValues

/**
 * Object including all the registered error messages since the last validation.
 * Errors are stored using the same path of the corresponding form values.
 *
 * @example
 * If the form object has this structure:
 * ```json
 * {
 *   "age": 1
 * }
 * ```
 * and age is a non valid field, errors object will look like this
 * ```json
 * {
 *   "age": "Age must be greater then 18"
 * }
 * ```
 */
export type Errors = Record<string, string>

/**
 * Object including all the values that are being live validated.
 * Usually fields that fail validation (using one of the methods that triggers validation)
 * will automatically be set to live-validated.
 *
 * A value/path is live-validated when validated at every change of the form.
 *
 * By default no field is live-validated.
 *
 * @example
 * If the form object has this structure:
 * ```json
 * {
 *   "age": 1
 * }
 * ```
 * and age is a field that is being live-validated, liveValidation object will look like this
 * ```json
 * {
 *   "age": true
 * }
 * ```
 */
export type LiveValidation = Record<string, true>

// ─── FormState (formerly Writer) ─────────────────────────────────────────────

/**
 * Internal form state storing all the data of the form (except the validation schema).
 */
export type FormState<Values extends InitialValues> = {
    form: Values,
    initialValues: Values
    errors: Errors,
    liveValidation: LiveValidation,
    isDirty: boolean,
}

/** @deprecated Use {@link FormState} instead. */
export type Writer<Values extends InitialValues> = FormState<Values>

// ─── Yup Re-exports ─────────────────────────────────────────────────────────

/**
 * Type imported from the yup library.
 * It represents any validation schema created with the yup.object() method.
 *
 * Link to the Yup documentation {@link https://github.com/jquense/yup}
 */
export type ValidationSchema<Values extends InitialValues> = ObjectSchema<Values>

/**
 * Type imported from the yup library.
 * It represents the object with all the options that can be passed to the internal yup validation method.
 *
 * Link to the Yup documentation {@link https://github.com/jquense/yup}
 */
export type ValidateOptions = YupValidateOptions

/**
 * Type imported from the yup library.
 * It represents the error object returned when a validation fails.
 *
 * Link to the Yup documentation {@link https://github.com/jquense/yup}
 */
export type ValidationError = YupValidationError

// ─── Callback Types ──────────────────────────────────────────────────────────

/**
 * Success callback invoked by some formbit methods when the operation is successful.
 */
export type SuccessCallback<Values extends InitialValues> = (writer: FormState<Values>, setError: SetError) => void

/**
 * Invoked in case of errors raised by validation.
 */
export type ErrorCallback<Values extends InitialValues> = (writer: FormState<Values>, setError: SetError) => void

/**
 * Success callback invoked by the check method when the operation is successful.
 */
export type CheckSuccessCallback<Values extends InitialValues> =
    (json: Form, writer: FormState<Values>, setError: SetError) => void

/** @deprecated Use {@link CheckSuccessCallback} instead. */
export type SuccessCheckCallback<Values extends InitialValues> = CheckSuccessCallback<Values>

/**
 * Invoked in case of errors raised by validation of check method.
 */
export type CheckErrorCallback<Values extends InitialValues> =
    (json: Form, inner: ValidationError[], writer: FormState<Values>, setError: SetError) => void

/** @deprecated Use {@link CheckErrorCallback} instead. */
export type ErrorCheckCallback<Values extends InitialValues> = CheckErrorCallback<Values>

/**
 * Success callback invoked by the submit method when the validation is successful.
 * Is the right place to send your data to the backend.
 */
export type SubmitSuccessCallback<Values extends InitialValues> =
    (
        writer: FormState<Values | Omit<Values, '__metadata'>>,
        setError: SetError, clearIsDirty: () => void
    ) => void

/** @deprecated Use {@link SubmitSuccessCallback} instead. */
export type SuccessSubmitCallback<Values extends InitialValues> = SubmitSuccessCallback<Values>

// ─── Deprecated Single-Use Aliases (kept for backward compatibility) ─────────

/** @deprecated Inlined into {@link FormbitObject}. */
export type ErrorFn = (path: string) => string | undefined

/** @deprecated Inlined into {@link FormbitObject}. */
export type IsFormValid = () => boolean

/** @deprecated Inlined into {@link FormbitObject}. */
export type IsFormInvalid = () => boolean

/** @deprecated Inlined into {@link FormbitObject}. */
export type ClearIsDirty = () => void

/** @deprecated Inlined into {@link FormbitObject}. */
export type ResetForm = () => void

/** @deprecated Inlined into {@link FormbitObject}. */
export type LiveValidationFn = (path: string) => true | undefined

/** @deprecated Inlined into {@link FormbitObject}. */
export type IsDirty = boolean

// ─── Method Types ────────────────────────────────────────────────────────────

/** See {@link FormbitObject.check}. */
export type Check<Values extends InitialValues> =
    (json: Form, options?: CheckFnOptions<Values>) => ValidationError[] | undefined

/** See {@link FormbitObject.initialize}. */
export type Initialize<Values extends InitialValues> = (values: Partial<Values>) => void

/** See {@link FormbitObject.remove}. */
export type Remove<Values extends InitialValues> = (path: string, options?: WriteFnOptions<Values>) => void

/** See {@link FormbitObject.setError}. */
export type SetError = (path: string, value: string) => void

/** See {@link FormbitObject.setSchema}. */
export type SetSchema<Values extends InitialValues> = (newSchema: ValidationSchema<Values>) => void

/** See {@link FormbitObject.submitForm}. */
export type SubmitForm<Values extends InitialValues> = (
    successCallback: SubmitSuccessCallback<Values>,
    errorCallback?: ErrorCallback<Partial<Values>>,
    options?: ValidateOptions) => void

/** See {@link FormbitObject.validate}. */
export type Validate<Values extends InitialValues> = (path: string, options?: ValidateFnOptions<Values>) => void

/** See {@link FormbitObject.validateAll}. */
export type ValidateAll<Values extends InitialValues> = (paths: string[], options?: ValidateFnOptions<Values>) => void

/** See {@link FormbitObject.validateForm}. */
export type ValidateForm<Values extends InitialValues> = (
    successCallback?: SuccessCallback<Values>,
    errorCallback?: ErrorCallback<Values>,
    options?: ValidateOptions) => void

/** See {@link FormbitObject.write}. */
export type Write<Values extends InitialValues> =
    (path: keyof Values | string, value: unknown, options?: WriteFnOptions<Values>) => void

/** See {@link FormbitObject.writeAll}. */
export type WriteAll<Values extends InitialValues> =
    (arr: WriteAllValue<Values>[], options?: WriteFnOptions<Values>) => void

/** See {@link FormbitObject.removeAll}. */
export type RemoveAll<Values extends InitialValues> =
    (arr: string[], options?: WriteFnOptions<Values>) => void

/**
 * Tuple of [key, value] pair.
 */
export type WriteAllValue<Values extends InitialValues> = [keyof Values | string, unknown]

// ─── Options Types ───────────────────────────────────────────────────────────

/**
 * Options object to change the behavior of the check method.
 */
export type CheckFnOptions<Values extends InitialValues> = {
    successCallback?: CheckSuccessCallback<Values>,
    errorCallback?: CheckErrorCallback<Values>,
    options?: ValidateOptions
}

/**
 * Options object to change the behavior of the validate methods.
 */
export type ValidateFnOptions<Values extends InitialValues> = {
    successCallback?: SuccessCallback<Partial<Values>>,
    errorCallback?: ErrorCallback<Partial<Values>>,
    options?: ValidateOptions
}

/**
 * Options object to change the behavior of the write methods.
 */
export type WriteFnOptions<Values extends InitialValues> = {
    noLiveValidation?: boolean,
    pathsToValidate?: string[]
} & ValidateFnOptions<Values>

// ─── FormbitObject ───────────────────────────────────────────────────────────

/**
 * Object returned by useFormbit() and useFormbitContextHook().
 * It contains all the data and methods needed to handle the form.
 */
export type FormbitObject<Values extends InitialValues> = {
    // --- State ---

    /**
     * Object containing the updated form.
     */
    form: Partial<Values>,

    /**
     * Object including all the registered error messages since the last validation.
     * Errors are stored using the same path of the corresponding form values.
     *
     * @example
     * If the form object has this structure:
     * ```json
     * {
     *   "age": 1
     * }
     * ```
     * and age is a non valid field, errors object will look like this
     * ```json
     * {
     *   "age": "Age must be greater then 18"
     * }
     * ```
     */
    errors: Errors,

    /**
     * Returns true if the form is Dirty (user already interacted with the form), false otherwise.
     */
    isDirty: boolean,

    // --- Queries ---

    /**
     * Returns the error message for the given path if any.
     * It doesn't trigger any validation.
     */
    error: (path: string) => string | undefined,

    /**
     * Returns true if the form is valid.
     * It doesn't perform any validation, it checks if any errors are present.
     */
    isFormValid: () => boolean,

    /**
     * Returns true if the form is NOT valid.
     * It doesn't perform any validation, it checks if any errors are present.
     */
    isFormInvalid: () => boolean,

    /**
     * Returns true if live validation is active for the given path.
     */
    liveValidation: (path: string) => true | undefined,

    // --- Mutations ---

    /**
     * This method updates the form state writing $value into the $path, setting isDirty to true.
     *
     * After writing, it validates all the paths contained into $pathsToValidate (if any)
     * and all the fields that have the live validation active.
     */
    write: Write<Values>,

    /**
     * This method takes an array of [path, value] and updates the form state writing
     * all those values into the specified paths.
     *
     * It sets isDirty to true.
     *
     * After writing, it validates all the paths contained into $pathToValidate and all
     * the fields that have the live validation active.
     */
    writeAll: WriteAll<Values>,

    /**
     * This method updates the form state deleting value, setting isDirty to true.
     *
     * After writing, it validates all the paths contained into pathsToValidate (if any)
     * and all the fields that have the live validation active.
     */
    remove: Remove<Values>,

    /**
     * This method updates the form state deleting multiple values, setting isDirty to true.
     */
    removeAll: RemoveAll<Values>,

    /**
     * Initialize the form with new initial values.
     */
    initialize: Initialize<Values>,

    /**
     * Reset form to the initial state.
     * Errors and liveValidation are set back to empty objects.
     * isDirty is set back to false.
     */
    resetForm: () => void,

    /**
     * Set a message (value) to the given error path.
     */
    setError: SetError,

    /**
     * Override the current schema with the given one.
     */
    setSchema: SetSchema<Values>,

    /**
     * This method only validates the specified path. Does not check for fields that have the
     * live validation active.
     */
    validate: Validate<Values>,

    /**
     * This method only validates the specified paths. Does not check for fields that have the
     * live validation active.
     */
    validateAll: ValidateAll<Values>,

    /**
     * This method validates the entire form and sets the corresponding errors if any.
     */
    validateForm: ValidateForm<Partial<Values>>,

    /**
     * Perform a validation against the current form object, and execute the successCallback if the validation passes,
     * otherwise it executes the errorCallback.
     */
    submitForm: SubmitForm<Values>,

    /**
     * Checks the given json against the form schema and returns an array of errors.
     * It returns undefined if the json is valid.
     */
    check: Check<Partial<Values>>,
}
