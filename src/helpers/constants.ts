export const TEST_ERROR_MESSAGES = {
  MIN: 'must be greater than or equal',
  REQUIRED: 'is a required field'
}

export enum ACTIONS {
  write = 'write',
  remove = 'remove'
}

export const MISSING_CONTEXT_ERROR =
  'No FormbitContext.Provider found, useFormbitContext can only be called inside proper context'
