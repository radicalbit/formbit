import { useFormbitContext } from 'formbit'
import { success } from '../../helpers/message'
import { useFakeApiContext } from '../fake-api-context'
import type { UseHandleOnSubmitResult } from './use-handle-on-submit-types'
import type { FormData } from './schema'

export const useHandleOnSubmit = (): UseHandleOnSubmitResult => {
  const { submitForm, isFormInvalid, resetForm, isDirty } = useFormbitContext<FormData>()

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
    })
  }

  return { handleOnSubmit, isSubmitDisabled, args }
}
