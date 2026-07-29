import { ObjectSchema, ValidationError as YupValidationError, ValidateOptions as YupValidateOptions } from 'yup'
import { ACTIONS } from '../helpers/constants'

// ─── Core value types ────────────────────────────────────────────────────────

/**
 * Base shape of every form handled by formbit: an open record of values, plus an
 * optional `__metadata` field formbit uses to carry data that must survive a
 * reset/initialize but must NOT be submitted.
 *
 * The generic `T` you pass to `useFormbit<T>()` must extend this type.
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
export type FormState<T extends FormbitValues> = {
    form: T,
    initialValues: T,
    errors: Errors,
    liveValidation: LiveValidation,
    isDirty: boolean,
}

// ─── Yup re-exports ────────────────────────────────────────────────────────────

/** A validation schema built with `yup.object()`. See {@link https://github.com/jquense/yup}. */
export type ValidationSchema<T extends FormbitValues> = ObjectSchema<T>

/** Options forwarded to yup's validation methods. See {@link https://github.com/jquense/yup}. */
export type ValidateOptions = YupValidateOptions

/** The error object yup throws when a validation fails. See {@link https://github.com/jquense/yup}. */
export type ValidationError = YupValidationError

// ─── Callbacks ───────────────────────────────────────────────────────────────

/** Invoked by validation methods when the form (or the validated paths) are valid. */
export type SuccessCallback<T extends FormbitValues> =
    (writer: FormState<T>, setError: SetError) => void

/** Invoked by validation methods when validation fails. */
export type ErrorCallback<T extends FormbitValues> =
    (writer: FormState<T>, setError: SetError) => void

/** Invoked by `check()` when the given json is valid. */
export type CheckSuccessCallback<T extends FormbitValues> =
    (json: FormbitValues, writer: FormState<T>, setError: SetError) => void

/** Invoked by `check()` when the given json is invalid. */
export type CheckErrorCallback<T extends FormbitValues> =
    (json: FormbitValues, inner: ValidationError[], writer: FormState<T>, setError: SetError) => void

/**
 * Invoked by `submitForm()` once the whole form is valid — the place to send data
 * to the backend. `__metadata` is stripped from `writer.form` before this runs.
 */
export type SubmitSuccessCallback<T extends FormbitValues> =
    (
        writer: FormState<Omit<T, '__metadata'>>,
        setError: SetError,
        clearIsDirty: () => void
    ) => void

// ─── Method signatures ─────────────────────────────────────────────────────────

/** See {@link FormbitObject.check}. */
export type Check<T extends FormbitValues> =
    (json: FormbitValues, options?: CheckFnOptions<T>) => ValidationError[] | undefined

/** See {@link FormbitObject.initialize}. */
export type Initialize<T extends FormbitValues> = (values: Partial<T>) => void

/** See {@link FormbitObject.remove}. */
export type Remove<T extends FormbitValues> = (path: string, options?: WriteFnOptions<T>) => void

/** See {@link FormbitObject.setError}. */
export type SetError = (path: string, value: string) => void

/** See {@link FormbitObject.setSchema}. */
export type SetSchema<T extends FormbitValues> = (newSchema: ValidationSchema<T>) => void

/** A single `[path, value]` pair accepted by `writeAll`. */
export type WriteAllValue<T extends FormbitValues> = [keyof T | string, unknown]

/** See {@link FormbitObject.write}. */
export type Write<T extends FormbitValues> =
    (path: keyof T | string, value: unknown, options?: WriteFnOptions<T>) => void

/** See {@link FormbitObject.writeAll}. */
export type WriteAll<T extends FormbitValues> =
    (arr: WriteAllValue<T>[], options?: WriteFnOptions<T>) => void

/** See {@link FormbitObject.removeAll}. */
export type RemoveAll<T extends FormbitValues> =
    (arr: string[], options?: WriteFnOptions<T>) => void

/** See {@link FormbitObject.validate}. */
export type Validate<T extends FormbitValues> = (path: string, options?: ValidateFnOptions<T>) => void

/** See {@link FormbitObject.validateAll}. */
export type ValidateAll<T extends FormbitValues> = (paths: string[], options?: ValidateFnOptions<T>) => void

/** See {@link FormbitObject.validateForm}. */
export type ValidateForm<T extends FormbitValues> = (
    successCallback?: SuccessCallback<T>,
    errorCallback?: ErrorCallback<T>,
    options?: ValidateOptions) => void

/** See {@link FormbitObject.submitForm}. */
export type SubmitForm<T extends FormbitValues> = (
    successCallback: SubmitSuccessCallback<T>,
    errorCallback?: ErrorCallback<Partial<T>>,
    options?: ValidateOptions) => void

// ─── Options ─────────────────────────────────────────────────────────────────

/** Options accepted by `check()`. */
export type CheckFnOptions<T extends FormbitValues> = {
    successCallback?: CheckSuccessCallback<T>,
    errorCallback?: CheckErrorCallback<T>,
    options?: ValidateOptions
}

/** Options accepted by the `validate` methods. */
export type ValidateFnOptions<T extends FormbitValues> = {
    successCallback?: SuccessCallback<Partial<T>>,
    errorCallback?: ErrorCallback<Partial<T>>,
    options?: ValidateOptions
}

/** Options accepted by the `write`/`remove` methods (validate options plus path control). */
export type WriteFnOptions<T extends FormbitValues> = {
    noLiveValidation?: boolean,
    pathsToValidate?: string[]
} & ValidateFnOptions<T>

// ─── Internal types (not part of the public surface) ──────────────────────────

/** @internal */
export type Action = keyof typeof ACTIONS

/** @internal */
export type GenericCallback<T extends FormbitValues> = SuccessCallback<T> | ErrorCallback<T>

/** @internal Subset of a yup ValidationError kept by formbit's sync validation. */
export type ValidationFormbitError = Pick<ValidationError, 'message' | 'path'>

/** @internal */
export type WriteOrRemove<T extends FormbitValues> =
    (path: keyof T | string, value: unknown, options?: WriteFnOptions<T>, action?: Action) => void

/** @internal */
export type PrivateValidateForm<T extends FormbitValues> = (
    successCallback?: SuccessCallback<T>,
    errorCallback?: ErrorCallback<Partial<T>>,
    options?: { options?: ValidateOptions }) => void

// ─── FormbitObject ───────────────────────────────────────────────────────────

/**
 * The object returned by `useFormbit()` and `useFormbitContext()`. Holds the form
 * state and every method needed to read, mutate and validate the form.
 */
export type FormbitObject<T extends FormbitValues> = {
    // --- State ---

    /** The current form values. Partial: fields may be missing until validated. */
    form: Partial<T>,

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
    check: Check<Partial<T>>,

    // --- Mutations ---

    /**
     * Writes `value` at `path`, sets `isDirty`, then validates `pathsToValidate`
     * plus every live-validated field.
     */
    write: Write<T>,

    /**
     * Writes every `[path, value]` pair, sets `isDirty`, then validates
     * `pathsToValidate` plus every live-validated field.
     */
    writeAll: WriteAll<T>,

    /**
     * Removes the value at `path`, sets `isDirty`, then validates `pathsToValidate`
     * plus every live-validated field.
     */
    remove: Remove<T>,

    /**
     * Removes every given path, sets `isDirty`, then validates `pathsToValidate`
     * plus every live-validated field.
     */
    removeAll: RemoveAll<T>,

    /** Re-initializes the form with new initial values. */
    initialize: Initialize<T>,

    /** Resets form, errors, liveValidation and isDirty back to their initial state. */
    resetForm: () => void,

    /** Sets the error message at `path`. */
    setError: SetError,

    /** Replaces the current validation schema. */
    setSchema: SetSchema<T>,

    /** Validates only `path` (ignores live-validated fields). */
    validate: Validate<T>,

    /** Validates only the given `paths` (ignores live-validated fields). */
    validateAll: ValidateAll<T>,

    /** Validates the whole form and registers any error. */
    validateForm: ValidateForm<Partial<T>>,

    /** Validates the whole form and, if valid, runs the success callback to submit. */
    submitForm: SubmitForm<T>,
}
