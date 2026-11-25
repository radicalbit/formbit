import useFormbit from './use-formbit'
import FormbitContextProvider, { useFormbitContext } from './formbit-context'

export default useFormbit
// Named twin of the default export: plain-Node ESM consumers of the CJS build
// get the whole exports object from a default import, so they need this one.
export { useFormbit, FormbitContextProvider, useFormbitContext }

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
