import useFormbit from './use-formbit'
import FormbitContextProvider, { useFormbitContext } from './formbit-context'

export default useFormbit
export { FormbitContextProvider, useFormbitContext }

export type {
  // Core value types
  FormbitValues,
  FormState,
  Errors,
  LiveValidation,

  // The object returned by the hooks
  FormbitObject,

  // Yup re-exports
  ValidationSchema,
  ValidateOptions,
  ValidationError,

  // Callbacks
  SuccessCallback,
  ErrorCallback,
  CheckSuccessCallback,
  CheckErrorCallback,
  SubmitSuccessCallback,

  // Method signatures
  Check,
  Initialize,
  Write,
  WriteAll,
  WriteAllValue,
  Remove,
  RemoveAll,
  Validate,
  ValidateAll,
  ValidateForm,
  SubmitForm,
  SetError,
  SetSchema,

  // Options
  CheckFnOptions,
  ValidateFnOptions,
  WriteFnOptions
} from './types'
