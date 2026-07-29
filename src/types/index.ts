import { ObjectSchema, ValidationError as YupValidationError, ValidateOptions as YupValidateOptions } from 'yup'
import { ACTIONS } from '../helpers/constants'

// ─── Core value types ────────────────────────────────────────────────────────

/**
 * Base shape of every form handled by formbit: an open record of values, plus an
 * optional `__metadata` field formbit uses to carry data that must survive a
 * reset/initialize but must NOT be submitted.
 *
 * The generic `Values` you pass to `useFormbit<Values>()` must extend this type.
 */
export type FormbitValues = Record<string, unknown> & { __metadata?: Record<string, unknown> }

/**
 * Error messages registered since the last validation, stored under the same
 * dot-path as the corresponding form value.
 *
 * @example
 * form:   { age: 1 }
 * errors: { age: "Age must be greater than 18" }
 */
export type Errors = Record<string, string>

/**
 * Fields currently under live-validation (re-validated on every form change).
 * A field is added here automatically when it fails a validation. Empty by default.
 *
 * @example
 * form:           { age: 1 }
 * liveValidation: { age: true }
 */
export type LiveValidation = Record<string, true>

/**
 * The whole internal state of the form (everything except the validation schema).
 */
export type FormState<Values extends FormbitValues> = {
    form: Values,
    initialValues: Values,
    errors: Errors,
    liveValidation: LiveValidation,
    isDirty: boolean,
}

// ─── Yup re-exports ────────────────────────────────────────────────────────────

/** A validation schema built with `yup.object()`. See {@link https://github.com/jquense/yup}. */
export type ValidationSchema<Values extends FormbitValues> = ObjectSchema<Values>

/** Options forwarded to yup's validation methods. See {@link https://github.com/jquense/yup}. */
export type ValidateOptions = YupValidateOptions

/** The error object yup throws when a validation fails. See {@link https://github.com/jquense/yup}. */
export type ValidationError = YupValidationError

// ─── Callbacks ───────────────────────────────────────────────────────────────

/** Invoked by validation methods when the form (or the validated paths) are valid. */
export type SuccessCallback<Values extends FormbitValues> =
    (writer: FormState<Values>, setError: SetError) => void

/** Invoked by validation methods when validation fails. */
export type ErrorCallback<Values extends FormbitValues> =
    (writer: FormState<Values>, setError: SetError) => void

/** Invoked by `check()` when the given json is valid. */
export type CheckSuccessCallback<Values extends FormbitValues> =
    (json: FormbitValues, writer: FormState<Values>, setError: SetError) => void

/** Invoked by `check()` when the given json is invalid. */
export type CheckErrorCallback<Values extends FormbitValues> =
    (json: FormbitValues, inner: ValidationError[], writer: FormState<Values>, setError: SetError) => void

/**
 * Invoked by `submitForm()` once the whole form is valid — the place to send data
 * to the backend. `__metadata` is stripped from `writer.form` before this runs.
 */
export type SubmitSuccessCallback<Values extends FormbitValues> =
    (
        writer: FormState<Omit<Values, '__metadata'>>,
        setError: SetError,
        clearIsDirty: () => void
    ) => void

// ─── Method signatures ─────────────────────────────────────────────────────────

/** See {@link FormbitObject.check}. */
export type Check<Values extends FormbitValues> =
    (json: FormbitValues, options?: CheckFnOptions<Values>) => ValidationError[] | undefined

/** See {@link FormbitObject.initialize}. */
export type Initialize<Values extends FormbitValues> = (values: Partial<Values>) => void

/** See {@link FormbitObject.remove}. */
export type Remove<Values extends FormbitValues> = (path: string, options?: WriteFnOptions<Values>) => void

/** See {@link FormbitObject.setError}. */
export type SetError = (path: string, value: string) => void

/** See {@link FormbitObject.setSchema}. */
export type SetSchema<Values extends FormbitValues> = (newSchema: ValidationSchema<Values>) => void

/** A single `[path, value]` pair accepted by `writeAll`. */
export type WriteAllValue<Values extends FormbitValues> = [keyof Values | string, unknown]

/** See {@link FormbitObject.write}. */
export type Write<Values extends FormbitValues> =
    (path: keyof Values | string, value: unknown, options?: WriteFnOptions<Values>) => void

/** See {@link FormbitObject.writeAll}. */
export type WriteAll<Values extends FormbitValues> =
    (arr: WriteAllValue<Values>[], options?: WriteFnOptions<Values>) => void

/** See {@link FormbitObject.removeAll}. */
export type RemoveAll<Values extends FormbitValues> =
    (arr: string[], options?: WriteFnOptions<Values>) => void

/** See {@link FormbitObject.validate}. */
export type Validate<Values extends FormbitValues> = (path: string, options?: ValidateFnOptions<Values>) => void

/** See {@link FormbitObject.validateAll}. */
export type ValidateAll<Values extends FormbitValues> = (paths: string[], options?: ValidateFnOptions<Values>) => void

/** See {@link FormbitObject.validateForm}. */
export type ValidateForm<Values extends FormbitValues> = (
    successCallback?: SuccessCallback<Values>,
    errorCallback?: ErrorCallback<Values>,
    options?: ValidateOptions) => void

/** See {@link FormbitObject.submitForm}. */
export type SubmitForm<Values extends FormbitValues> = (
    successCallback: SubmitSuccessCallback<Values>,
    errorCallback?: ErrorCallback<Partial<Values>>,
    options?: ValidateOptions) => void

// ─── Options ─────────────────────────────────────────────────────────────────

/** Options accepted by `check()`. */
export type CheckFnOptions<Values extends FormbitValues> = {
    successCallback?: CheckSuccessCallback<Values>,
    errorCallback?: CheckErrorCallback<Values>,
    options?: ValidateOptions
}

/** Options accepted by the `validate` methods. */
export type ValidateFnOptions<Values extends FormbitValues> = {
    successCallback?: SuccessCallback<Partial<Values>>,
    errorCallback?: ErrorCallback<Partial<Values>>,
    options?: ValidateOptions
}

/** Options accepted by the `write`/`remove` methods (validate options plus path control). */
export type WriteFnOptions<Values extends FormbitValues> = {
    noLiveValidation?: boolean,
    pathsToValidate?: string[]
} & ValidateFnOptions<Values>

// ─── Internal types (not part of the public surface) ──────────────────────────

/** @internal */
export type Action = keyof typeof ACTIONS

/** @internal */
export type GenericCallback<Values extends FormbitValues> = SuccessCallback<Values> | ErrorCallback<Values>

/** @internal Subset of a yup ValidationError kept by formbit's sync validation. */
export type ValidationFormbitError = Pick<ValidationError, 'message' | 'path'>

/** @internal */
export type WriteOrRemove<Values extends FormbitValues> =
    (path: keyof Values | string, value: unknown, options?: WriteFnOptions<Values>, action?: Action) => void

/** @internal */
export type PrivateValidateForm<Values extends FormbitValues> = (
    successCallback?: SuccessCallback<Values>,
    errorCallback?: ErrorCallback<Partial<Values>>,
    options?: { options?: ValidateOptions }) => void

// ─── FormbitObject ───────────────────────────────────────────────────────────

/**
 * The object returned by `useFormbit()` and `useFormbitContext()`. Holds the form
 * state and every method needed to read, mutate and validate the form.
 */
export type FormbitObject<Values extends FormbitValues> = {
    // --- State ---

    /** The current form values. Partial: fields may be missing until validated. */
    form: Partial<Values>,

    /**
     * Error messages registered since the last validation, keyed by the value's dot-path.
     *
     * @example
     * form:   { age: 1 }
     * errors: { age: "Age must be greater than 18" }
     */
    errors: Errors,

    /** True once the user has interacted with the form. */
    isDirty: boolean,

    // --- Queries (never trigger validation) ---

    /** Returns the error message registered for `path`, if any. */
    error: (path: string) => string | undefined,

    /** True if no errors are currently registered. Does not run validation. */
    isFormValid: () => boolean,

    /** True if any error is currently registered. Does not run validation. */
    isFormInvalid: () => boolean,

    /** True if live-validation is active for `path`. */
    liveValidation: (path: string) => true | undefined,

    /** Validates `json` against the current schema; returns the errors, or undefined if valid. */
    check: Check<Partial<Values>>,

    // --- Mutations ---

    /**
     * Writes `value` at `path`, sets `isDirty`, then validates `pathsToValidate`
     * plus every live-validated field.
     */
    write: Write<Values>,

    /**
     * Writes every `[path, value]` pair, sets `isDirty`, then validates
     * `pathsToValidate` plus every live-validated field.
     */
    writeAll: WriteAll<Values>,

    /**
     * Removes the value at `path`, sets `isDirty`, then validates `pathsToValidate`
     * plus every live-validated field.
     */
    remove: Remove<Values>,

    /**
     * Removes every given path, sets `isDirty`, then validates `pathsToValidate`
     * plus every live-validated field.
     */
    removeAll: RemoveAll<Values>,

    /** Re-initializes the form with new initial values. */
    initialize: Initialize<Values>,

    /** Resets form, errors, liveValidation and isDirty back to their initial state. */
    resetForm: () => void,

    /** Sets the error message at `path`. */
    setError: SetError,

    /** Replaces the current validation schema. */
    setSchema: SetSchema<Values>,

    /** Validates only `path` (ignores live-validated fields). */
    validate: Validate<Values>,

    /** Validates only the given `paths` (ignores live-validated fields). */
    validateAll: ValidateAll<Values>,

    /** Validates the whole form and registers any error. */
    validateForm: ValidateForm<Partial<Values>>,

    /** Validates the whole form and, if valid, runs the success callback to submit. */
    submitForm: SubmitForm<Values>,
}
