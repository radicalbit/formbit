import { ObjectSchema, ValidationError as YupValidationError, ValidateOptions as YupValidateOptions } from 'yup'
import { ACTIONS } from '../helpers/constants'

/**
 * @private
 */
export type Action = keyof typeof ACTIONS

/**
 * Checks the given json against the form schema and returns and array of errors.
 * It returns undefined if the json is valid.
 *
 */
export type Check<Values extends InitialValues> =
    (json: Form, options?: CheckFnOptions<Values>) => ValidationError[] | undefined

/**
 * Reset isDirty value to false
 */
export type ClearIsDirty = () => void

/**
 * Invoked in case of errors raised by validation
 */
export type ErrorCallback<Values extends InitialValues> = (writer: Writer<Values>, setError: SetError) => void

/**
 * Invoked in case of errors raised by validation of check method
 *
 */
export type ErrorCheckCallback<Values extends InitialValues> =
    (json: Form, inner: ValidationError[], writer: Writer<Values>, setError: SetError) => void

/**
 * Returns the error message for the given path if any.
 * It doesn't trigger any validation
 *
 */
export type ErrorFn = (path: string) => string | undefined;

/**
 * Object including all the registered errors messages since the last validation.
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
 *
 */
export type Errors = Record<string, string>

/**
 * Object containing the updated form
 */
export type Form = { __metadata?: Object } & Object

export type GenericCallback<Values extends InitialValues> = SuccessCallback<Values> | ErrorCallback<Values>
/**
 *  Initialize the form with new initial values
 */
export type Initialize<Values extends InitialValues> = (values: Partial<Values>) => void

/**
 *  InitialValues used to setup formbit, used also to reset the form to the original version.
 *
 */
export type InitialValues = { __metadata?: Object } & Object

/**
 * Returns true if the form is Dirty (user already interacted with the form), false otherwise.
 *
 */
export type IsDirty = boolean

/**
 * Returns true if the form is NOT valid
 * It doesn't perform any validation, it checks if any errors are present
 */
export type IsFormInvalid = () => boolean

/**
 * Returns true id the form is valid
 * It doesn't perform any validation, it checks if any errors are present
 */
export type IsFormValid = () => boolean

/**
 * Object including all the values that are being live validated.
 * Usually fields that fail validation (using one of the method that triggers validation)
 * will automatically set to be live-validated.
 *
 * A value/path is live-validated when validated at every change of the form.
 *
 * By default no field is live-validated
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
 *   "age": "Age must be greater then 18"
 * }
 * ```
 *
 */
export type LiveValidation = Record<string, true>

/**
 * Returns true if live validation is active for the given path
 *
 */
export type LiveValidationFn = (path: string) => true | undefined

/**
 * Generic object with string as keys
 *
 */
export type Object = Record<string, unknown>

/**
 * @private
 */
export type PrivateValidateForm<Values extends InitialValues> = (
    successCallback?: SuccessCallback<Values>,
    errorCallback?: ErrorCallback<Partial<Values>>,
    options?: { options?: ValidateOptions, isDirty?: boolean }) => void

/**
 *
 * This method updates the form state deleting value and set isDirty to true.
 *
 * After writing, it validates all the paths contained into pathsToValidate (if any)
 * and all the fields that have the live validation active.
 *
 *
 */
export type Remove<Values extends InitialValues> = (path: string, options?: WriteFnOptions<Values>) => void

/**
 * Reset form to the initial state.
 * Errors and liveValidation are set back to empty objects.
 * isDirty is set back to false
 *
 */
export type ResetForm = () => void

/**
 * Type imported from the yup library.
 * It represents any validation schema created with the yup.object() method
 *
 * Link to the Yup documentation {@link https://github.com/jquense/yup}
 *
 */
export type ValidationSchema<Values extends InitialValues> = ObjectSchema<Values>

/**
 * Set a message(value) to the given error path.
 *
 */
export type SetError = (path: string, value: string) => void

/**
 * Override the current schema with the given one.
 *
 */
export type SetSchema<Values extends InitialValues> = (newSchema: ValidationSchema<Values>) => void

/**
 * Perform a validation against the current form object, and execute the successCallback if the validation pass
 * otherwise it executes the errorCallback
 *
 */
export type SubmitForm<Values extends InitialValues> = (
    successCallback: SuccessSubmitCallback<Values>,
    errorCallback?: ErrorCallback<Partial<Values>>,
    options?: ValidateOptions) => void

/**
 * Success callback invoked by some formbit methods when the operation is successful.
 *
 */
export type SuccessCallback<Values extends InitialValues> = (writer: Writer<Values>, setError: SetError) => void

/**
 * Success callback invoked by the check method when the operation is successful.
 *
 */
export type SuccessCheckCallback<Values extends InitialValues> =
    (json: Form, writer: Writer<Values>, setError: SetError) => void

/**
 * Success callback invoked by the submit method when the validation is successful.
 * Is the right place to send your data to the backend.
 *
 */
export type SuccessSubmitCallback<Values extends InitialValues> =
    (
        writer: Writer<Values | Omit<Values, '__metadata'>>,
        setError: SetError, clearIsDirty: ClearIsDirty
    ) => void

/**
 *
 * This method only validate the specified path. Do not check for fields that have the
 * live validation active.
 */
export type Validate<Values extends InitialValues> = (path: string, options?: ValidateFnOptions<Values>) => void

/**
 *
 * This method only validate the specified paths. Do not check for fields that have the
 * live validation active.
 */
export type ValidateAll<Values extends InitialValues> = (paths: string[], options?: ValidateFnOptions<Values>) => void

/**
 * This method validates the entire form and set the corresponding errors if any.
 *
 */
export type ValidateForm<Values extends InitialValues> = (
    successCallback?: SuccessCallback<Values>,
    errorCallback?: ErrorCallback<Values>,
    options?: ValidateOptions) => void

export type ValidationFormbitError = Pick<ValidationError, 'message' | 'path'>

/**
 * Type imported from the yup library.
 * It represents the object with all the options that can be passed to the internal yup validation method,
 *
 * Link to the Yup documentation {@link https://github.com/jquense/yup}
 *
 */
export type ValidateOptions = YupValidateOptions

/**
 *
 * This method update the form state writing $value into the $path, setting isDirty to true.
 *
 * After writing, it validates all the paths contained into $pathsToValidate (if any)
 * and all the fields that have the live validation active.
 */
export type Write<Values extends InitialValues> =
    (path: keyof Values | string, value: unknown, options?: WriteFnOptions<Values>) => void

/**
 * This method takes an array of [path, value] and update the form state writing
 * all those values into the specified paths.
 *
 * It set isDirty to true.
 *
 * After writing, it validate all the paths contained into $pathToValidate and all
 * the fields that have the live validation active.
 *
 */
export type WriteAll<Values extends InitialValues> =
    (arr: WriteAllValue<Values>[], options?: WriteFnOptions<Values>) => void

/**
 * Tuple of [key, value] pair.
 *
 */
export type WriteAllValue<Values extends InitialValues> = [keyof Values | string, unknown]

/**
 * @private
 */
export type WriteOrRemove<Values extends Form> =
    (path: keyof Values | string, value: unknown, options?: WriteFnOptions<Values>, action?: Action) => void

/**
 * Internal form state storing all the data of the form (except the validation schema)
 *
 */
export type Writer<Values extends InitialValues> = {
    form: Values,
    initialValues: Values
    errors: Errors,
    liveValidation: LiveValidation,
    isDirty: IsDirty,
}

/**
 * Options object to change the behavior of the check method
 *
 */
export type CheckFnOptions<Values extends InitialValues> = {
    successCallback?: SuccessCheckCallback<Values>,
    errorCallback?: ErrorCheckCallback<Values>,
    options?: ValidateOptions
}

/**
 * Options object to change the behavior of the validate methods
 *
 */
export type ValidateFnOptions<Values extends InitialValues> = {
    successCallback?: SuccessCallback<Partial<Values>>,
    errorCallback?: ErrorCallback<Partial<Values>>,
    options?: ValidateOptions
}

/**
 * Type imported from the yup library.
 * It represents the error object returned when a validation fails
 *
 * Link to the Yup documentation {@link https://github.com/jquense/yup}
 *
 */
export type ValidationError = YupValidationError

/**
 * Options object to change the behavior of the write methods
 *
 */
export type WriteFnOptions<Values extends InitialValues> = {
    noLiveValidation?: boolean,
    pathsToValidate?: string[]
} & ValidateFnOptions<Values>

/**
 * Object returned by useFormbit() and useFormbitContextHook()
 * It contains all the data and methods needed to handle the form.
 *
 */
export type FormbitObject<Values extends InitialValues> = {
    /**
     * Checks the given json against the form schema and returns and array of errors.
     * It returns undefined if the json is valid.
     *
     */
    check: Check<Partial<Values>>,

    /**
     * Returns the error message for the given path if any.
     * It doesn't trigger any validation
     *
     */
    error: ErrorFn,

    /**
     * Object including all the registered errors messages since the last validation.
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
    *
    */
    errors: Errors,

    /**
     * Object containing the updated form
     */
    form: Partial<Values>,

    /**
     *  Initialize the form with new initial values
     */
    initialize: Initialize<Values>,

    /**
     * Returns true if the form is Dirty (user already interacted with the form), false otherwise.
     *
     */
    isDirty: boolean,

    /**
     * Returns true if the form is NOT valid
     * It doesn't perform any validation, it checks if any errors are present
     */
    isFormInvalid: IsFormInvalid,

    /**
     * Returns true id the form is valid
     * It doesn't perform any validation, it checks if any errors are present
     */
    isFormValid: IsFormValid,

    /**
     * Returns true if live validation is active for the given path
     */
    liveValidation: LiveValidationFn,

    /**
     *
     * This method updates the form state deleting value, setting isDirty to true.
     *
     * After writing, it validates all the paths contained into pathsToValidate (if any)
     * and all the fields that have the live validation active.
     *
     *
     */
    remove: Remove<Values>,

    /**
     * Reset form to the initial state.
     * Errors and liveValidation are set back to empty objects.
     * isDirty is set back to false
     *
     */
    resetForm: ResetForm,

    /**
     * Set a message(value) to the given error path.
     *
     */
    setError: SetError,

    /**
     * Override the current schema with the given one.
     *
     */
    setSchema: SetSchema<Values>,

    /**
     * Perform a validation against the current form object, and execute the successCallback if the validation pass
     * otherwise it executes the errorCallback
     *
     */
    submitForm: SubmitForm<Values>,

    /**
     *
     * This method only validate the specified path. Do not check for fields that have the
     * live validation active.
     */
    validate: Validate<Values>,

    /**
     *
     * This method only validate the specified paths. Do not check for fields that have the
     * live validation active.
     */
    validateAll: ValidateAll<Values>,

    /**
     * This method validates the entire form and set the corresponding errors if any.
     *
     */
    validateForm: ValidateForm<Partial<Values>>,

    /**
     *
     * This method update the form state writing $value into the $path, setting isDirty to true.
     *
     * After writing, it validates all the paths contained into $pathsToValidate (if any)
     * and all the fields that have the live validation active.
     */
    write: Write<Values>,

    /**
     *
     *
     * This method takes an array of [path, value] and update the form state writing
     * all those values into the specified paths.
     *
     * It set isDirty to true.
     *
     * After writing, it validate all the paths contained into $pathToValidate and all
     * the fields that have the live validation active.
     */
    writeAll: WriteAll<Values>,
}
