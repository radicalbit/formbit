import objLeaves from './helpers/obj-leaves'
import {
  useCallback, useRef, useState
} from 'react'
import { ACTIONS } from './helpers/constants'
import {
  Check,
  FormbitObject,
  FormState,
  FormbitValues,
  LiveValidation,
  PrivateValidateForm,
  Remove,
  RemoveAll,
  SetError,
  SubmitForm,
  SuccessCallback,
  Validate,
  ValidateAll,
  ValidateForm,
  ValidationSchema,
  Write,
  WriteAll,
  WriteOrRemove
} from './types'
import { isValidationError } from './types/helpers'
import { validateSyncAll } from './validate-sync-all'
import useExecuteCallbacks from './use-execute-callbacks'
import { cloneDeep, get, isEmpty, omit, set } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

type UseFormbitParams<T extends FormbitValues> = {
  initialValues?: Partial<T>,
  yup: ValidationSchema<T>
}

export default <T extends FormbitValues>({
  initialValues = {},
  yup: schema
}: UseFormbitParams<T>): FormbitObject<T> => {
  const schemaRef = useRef<ValidationSchema<T>>(schema)

  const [writer, setWriter] = useState<FormState<Partial<T>>>({
    form: initialValues,
    initialValues,
    errors: {},
    liveValidation: {},
    isDirty: false
  })

  const initialize = useCallback((values: Partial<T>) => {
    const { __metadata } = values

    if (__metadata) {
      setWriter((w) => ({
        ...w,
        initialValues: values,
        form: values,
        errors: {},
        liveValidation: {},
        isDirty: false
      }))

      return
    }

    setWriter((w) => {
      const { form: { __metadata } } = w
      const newValues = { ...values, __metadata }

      return {
        ...w,
        initialValues: newValues,
        form: newValues,
        errors: {},
        liveValidation: {},
        isDirty: false
      }
    })
  }, [])

  const setSchema = useCallback((newSchema: ValidationSchema<T>) => { schemaRef.current = newSchema }, [])

  const setError: SetError = useCallback((path, value) => {
    setWriter((w) => {
      const errors = set(cloneDeep(w.errors), path, value)

      return { ...w, errors }
    })
  }, [])

  const executeCb = useExecuteCallbacks<Partial<T>>(writer, setError)

  const writeOrRemove: WriteOrRemove<T> = useCallback((
    path,
    value,
    {
      noLiveValidation = false,
      pathsToValidate = [],
      successCallback,
      errorCallback,
      options = {}
    } = {},
    action
  ) => {
    const newUUID = (function getUUID() {
      if (successCallback || errorCallback) {
        return uuidv4()
      }

      return undefined
    })()

    setWriter((w) => {
      const liveValidationPaths = noLiveValidation ? [] : Object.keys(w.liveValidation)
      const paths = pathsToValidate.concat(liveValidationPaths)

      const form = (function execute() {
        switch (action) {
          case ACTIONS.write: return set(cloneDeep(w.form), path, value)

          case ACTIONS.remove: return omit<Partial<T>>(cloneDeep(w.form), path)

          default: return cloneDeep(w.form)
        }
      }())

      const newWriter: FormState<Partial<T>> = { ...w, form, isDirty: true }

      if (paths.length === 0) {
        newUUID && executeCb(newUUID, successCallback)

        return newWriter
      }

      // Teardown errors
      const cleanErrors = paths.reduce(
        (acc, key) => set(acc, key, undefined),
        cloneDeep(newWriter.errors)
      )

      // VALIDATE
      const inner = validateSyncAll(paths, schemaRef.current, newWriter.form, options)

      if (isEmpty(inner)) {
        const neww = { ...newWriter, errors: cleanErrors }

        newUUID && executeCb(newUUID, successCallback)

        return neww
      }

      const errors = inner.reduce(
        (acc, { path: innerPath, message }) => innerPath ? set(acc, innerPath, message) : acc,
        cleanErrors
      )

      const liveValidation: LiveValidation = inner.reduce(
        (acc, { path: innerPath }) => innerPath ? ({ ...acc, [innerPath]: true }) : acc,
        newWriter.liveValidation
      )

      const neww = { ...newWriter, errors, liveValidation }

      newUUID && executeCb(newUUID, errorCallback)

      return neww
    })
  }, [executeCb])

  const write: Write<T> = useCallback((path, value, options) =>
    writeOrRemove(path, value, options, ACTIONS.write), [writeOrRemove])

  const remove: Remove<T> = useCallback((path, options) =>
    writeOrRemove(path, undefined, options, ACTIONS.remove), [writeOrRemove])

  const writeAll: WriteAll<T> = useCallback((
    arr,
    {
      noLiveValidation = false,
      pathsToValidate = [],
      successCallback,
      errorCallback,
      options = {}
    } = {}
  ) => {
    const newUUID = (function getUUID() {
      if (successCallback || errorCallback) {
        return uuidv4()
      }

      return undefined
    })()

    setWriter((w) => {
      const liveValidationPaths = noLiveValidation ? [] : Object.keys(w.liveValidation)
      const paths = pathsToValidate.concat(liveValidationPaths)

      const form = arr.reduce(
        (acc, [key, val]) => set(acc, key, val),
        cloneDeep(w.form)
      )

      const newWriter = { ...w, form, isDirty: true }

      if (paths.length === 0) {
        newUUID && executeCb(newUUID, successCallback)

        return newWriter
      }

      // Teardown errors
      const cleanErrors = paths.reduce(
        (acc, key) => set(acc, key, undefined),
        cloneDeep(newWriter.errors)
      )

      // VALIDATE ALL
      const inner = validateSyncAll(paths, schemaRef.current, newWriter.form, options)

      if (isEmpty(inner)) {
        const neww = { ...newWriter, errors: cleanErrors }

        newUUID && executeCb(newUUID, successCallback)

        return neww
      }

      const errors = inner.reduce(
        (acc, { path = '', message }) => set(acc, path, message),
        cleanErrors
      )

      const liveValidation: LiveValidation = inner.reduce(
        (acc, { path = '' }) => ({ ...acc, [path]: true }),
        newWriter.liveValidation
      )

      const neww = { ...newWriter, errors, liveValidation }

      newUUID && executeCb(newUUID, errorCallback)

      return neww
    })
  }, [executeCb])

  const removeAll: RemoveAll<T> = useCallback(
    (
      arr,
      {
        noLiveValidation = false,
        pathsToValidate = [],
        successCallback,
        errorCallback,
        options = {}
      } = {}
    ) => {
      const newUUID = (function getUUID() {
        if (successCallback || errorCallback) {
          return uuidv4()
        }

        return undefined
      })()

      setWriter((w) => {
        const liveValidationPaths = noLiveValidation ? [] : Object.keys(w.liveValidation)
        const paths = pathsToValidate.concat(liveValidationPaths)

        const form = arr.reduce(
          (acc, path) => set(acc, path, undefined),
          cloneDeep(w.form)
        )

        const newWriter = { ...w, form, isDirty: true }

        if (paths.length === 0) {
          newUUID && executeCb(newUUID, successCallback)
          return newWriter
        }

        const cleanErrors = paths.reduce(
          (acc, key) => set(acc, key, undefined),
          cloneDeep(newWriter.errors)
        )

        const inner = validateSyncAll(paths, schemaRef.current, newWriter.form, options)

        if (isEmpty(inner)) {
          const neww = { ...newWriter, errors: cleanErrors }
          newUUID && executeCb(newUUID, successCallback)
          return neww
        }

        const errors = inner.reduce(
          (acc, { path = '', message }) => set(acc, path, message),
          cleanErrors
        )

        const liveValidation: LiveValidation = inner.reduce(
          (acc, { path = '' }) => ({ ...acc, [path]: true }),
          newWriter.liveValidation
        )

        const neww = { ...newWriter, errors, liveValidation }

        newUUID && executeCb(newUUID, errorCallback)

        return neww
      })
    },
    [executeCb]
  )

  const validate: Validate<T> = useCallback((
    path,
    {
      successCallback,
      errorCallback,
      options
    } = {}
  ) => {
    const newUUID = (function getUUID() {
      if (successCallback || errorCallback) {
        return uuidv4()
      }

      return undefined
    })()

    setWriter((w) => {
      // Teardown errors
      const cleanErrors = set(cloneDeep(w.errors), path, undefined)

      // VALIDATE
      const inner = validateSyncAll([path], schemaRef.current, w.form, options)

      if (isEmpty(inner)) {
        const neww = { ...w, errors: cleanErrors }

        newUUID && executeCb(newUUID, successCallback)

        return neww
      }

      const errors = inner.reduce(
        (acc, { path: errorPath = '', message }) => set(acc, errorPath, message),
        cleanErrors
      )

      const liveValidation: LiveValidation = inner.reduce(
        (acc, { path: errorPath = '' }) => ({ ...acc, [errorPath]: true }),
        w.liveValidation
      )

      const neww = { ...w, errors, liveValidation }

      newUUID && executeCb(newUUID, errorCallback)

      return neww
    })
  }, [executeCb])

  const validateAll: ValidateAll<T> = useCallback((
    paths,
    { successCallback, errorCallback, options } = {}
  ) => {
    const newUUID = (function getUUID() {
      if (successCallback || errorCallback) {
        return uuidv4()
      }

      return undefined
    })()

    setWriter((w) => {
      // Teardown errors
      const cleanErrors = paths.reduce(
        (acc, path) => set(acc, path, undefined),
        cloneDeep(w.errors)
      )

      // VALIDATE ALL
      const inner = validateSyncAll(paths, schemaRef.current, w.form, options)

      if (isEmpty(inner)) {
        const neww = { ...w, errors: cleanErrors }

        newUUID && executeCb(newUUID, successCallback)

        return neww
      }

      const errors = inner.reduce(
        (acc, { path = '', message }) => set(acc, path, message),
        cleanErrors
      )

      const liveValidation: LiveValidation = inner.reduce(
        (acc, { path = '' }) => ({ ...acc, [path]: true }),
        w.liveValidation
      )

      const neww = { ...w, errors, liveValidation }

      newUUID && executeCb(newUUID, errorCallback)

      return neww
    })
  }, [executeCb])

  const check: Check<Partial<T>> = useCallback((
    json,
    {
      successCallback,
      errorCallback,
      options
    } = {}
  ) => {
    try {
      schemaRef.current.validateSync(json, { abortEarly: false, ...options })
      successCallback?.(json, writer, setError)

      return undefined
    } catch (e) {
      if (isValidationError(e)) {
        const { inner } = e

        errorCallback?.(json, inner, writer, setError)

        return inner
      }

      return undefined
    }
  }, [setError, writer])

  const privateValidateForm: PrivateValidateForm<Partial<T>> = useCallback((
    successCallback,
    errorCallback,
    { options } = {}
  ) => {
    const newUUID = (function getUUID() {
      if (successCallback || errorCallback) {
        return uuidv4()
      }

      return undefined
    })()

    setWriter((w) => {
      try {
        // abortEarly: false as default is to be retrocompatible
        schemaRef.current.validateSync(w.form, { abortEarly: false, ...options })

        newUUID && executeCb(newUUID, successCallback)

        return { ...w, errors: {} }
      } catch (e) {
        if (!isValidationError(e)) {
          // Checking if error is not formbit-related (e.g. a bug inside the successCallback)
          console.error(e)
          return w
        }

        const { inner } = e

        const errors = inner.reduce(
          (acc, { message, path = '' }) => set(acc, path, message),
          {}
        )

        const liveValidation: LiveValidation = inner.reduce(
          (acc, { path = '' }) => ({ ...acc, [path]: true }),
          w.liveValidation
        )

        const newWriter = { ...w, errors, liveValidation }

        newUUID && executeCb(newUUID, errorCallback)

        return newWriter
      }
    })
  }, [executeCb])

  const validateForm: ValidateForm<Partial<T>> = useCallback((successCallback, errorCallback, options = {}) =>
    privateValidateForm(
      successCallback,
      errorCallback,
      { options }
    ), [privateValidateForm])

  const submitForm: SubmitForm<T> =
    useCallback((successCallback, errorCallback, options = {}) => {
      const fn = () => setWriter((w) => ({ ...w, isDirty: false }))

      const successCallbackAndClearIsDirty: SuccessCallback<Partial<T>> = (a, b) => {
        // Success callback is called only if the form is valid so we can safely cast a as FormState<T>
        const writer = a as FormState<T>

        // __metadata is a field used to store metadata about the form and should not be submitted
        const { __metadata: _, ...form } = writer.form

        return successCallback({ ...writer, form }, b, fn)
      }

      return privateValidateForm(
        successCallbackAndClearIsDirty,
        errorCallback,
        { options }
      )
    }, [privateValidateForm])

  const resetForm = useCallback(() => {
    setWriter((w) => ({
      ...w,
      form: w.initialValues,
      errors: {},
      isDirty: false,
      liveValidation: {}
    }))
  }, [])

  const isFormValid = useCallback(() => {
    const { silent: _, ...e } = writer.errors
    return objLeaves(e).every((leaf) => !get(e, leaf))
  }, [writer.errors])

  const isFormInvalid = useCallback(() => {
    const { silent: _, ...e } = writer.errors
    return objLeaves(e).some((leaf) => get(e, leaf))
  }, [writer.errors])

  const error = useCallback((path: string): string | undefined => get(writer.errors, path, undefined), [writer.errors])

  const liveValidation = useCallback(
    (path: string): true | undefined => get(writer.liveValidation, path, undefined),
    [writer.liveValidation]
  )

  return {
    // State
    form: writer.form,
    errors: writer.errors,
    isDirty: writer.isDirty,

    // Queries
    error,
    isFormValid,
    isFormInvalid,
    liveValidation,

    // Mutations
    write,
    writeAll,
    remove,
    removeAll,
    initialize,
    resetForm,
    setError,
    setSchema,
    validate,
    validateAll,
    validateForm,
    submitForm,
    check
  }
}
