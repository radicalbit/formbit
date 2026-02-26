import { useFormbitContext } from 'formbit'
import { success } from '../../helpers/message'
import { useFakeApiContext } from '../fake-api-context'
import type { Context, UseHandleOnSubmitResult } from './use-handle-on-submit-types'

export const useHandleOnSubmit = (): UseHandleOnSubmitResult => {
  const { form: { __metadata }, submitForm, isFormInvalid, resetForm, isDirty } = useFormbitContext<Context>()
  const resetSteps = __metadata?.resetSteps

  const { fakePost } = useFakeApiContext()
  const { mutate, ...args } = fakePost

  const isSubmitDisabled = isFormInvalid() || !isDirty

  const handleOnSubmit = () => {
    if (isSubmitDisabled) {
      return
    }

    submitForm(async ({ form }, _setError, clearIsDirty) => {
      await mutate(form)
      success(form)
      resetForm()
      clearIsDirty()
      resetSteps?.()
    })
  }

  return { handleOnSubmit, isSubmitDisabled, args }
}
