import { useFormbitContext } from 'formbit'
import { success } from '../../helpers/message'
import { useFakeApiContext } from '../fake-api-context'
import type { UseHandleOnSubmitResult } from './use-handle-on-submit-types'
import type { FormValues } from './schema'

// The fake backend rejects this address, as a real one would for an already registered user.
const TAKEN_EMAIL = 'taken@radicalbit.ai'

export const useHandleOnSubmit = (): UseHandleOnSubmitResult => {
  const { submitForm, isFormInvalid, resetForm, isDirty } = useFormbitContext<FormValues>()

  const { fakePost } = useFakeApiContext()
  const { mutate, ...args } = fakePost

  // A silent error does not make the form invalid, so the user can fix the value and submit again.
  const isSubmitDisabled = isFormInvalid() || !isDirty

  const handleOnSubmit = () => {
    if (isSubmitDisabled) {
      return
    }

    submitForm(async ({ form }, setError, clearIsDirty) => {
      await mutate(form)

      if (form.email === TAKEN_EMAIL) {
        // Backend errors go under `silent`: shown to the user, never validated by yup.
        setError('silent', 'This email is already registered')
        return
      }

      success(form)
      resetForm()
      clearIsDirty()
    })
  }

  return { handleOnSubmit, isSubmitDisabled, args }
}
