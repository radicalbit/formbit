import { isEmpty } from 'lodash'
import { FormbitValues, ValidateOptions, ValidationFormbitError, ValidationSchema } from './types'
import { isValidationError } from './types/helpers'

/* We implement the validateSyncAll because yup.pick won't work with
 * schema with nested values: https://github.com/jquense/yup/issues/1269 */
export const validateSyncAll = <T extends FormbitValues> (
  paths:string[],
  schema:ValidationSchema<T>,
  form: FormbitValues,
  options: ValidateOptions = {}
): ValidationFormbitError[] => {
  let errors: ValidationFormbitError[] = []

  if (isEmpty(paths)) {
    return errors
  }

  for (const pathToValidate of paths) {
    try {
      schema.validateSyncAt(pathToValidate, form, options)
    } catch (e) {
      if (isValidationError(e)) {
        const { message, path } = e

        errors = errors.concat({ message, path })
      }

      if (options?.abortEarly) {
        break
      }
    }
  }

  return errors
}
