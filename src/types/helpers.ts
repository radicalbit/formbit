import { ValidationError } from 'yup'

export const isValidationError = (error: unknown): error is ValidationError => {
  if (error && typeof error === 'object' && 'message' in error && 'path' in error && 'inner' in error) {
    const { path, message, inner } = error

    return (typeof path === 'string' || path === undefined) &&
            (typeof message === 'string' || path === undefined) &&
            Array.isArray(inner)
  }

  return false
}
