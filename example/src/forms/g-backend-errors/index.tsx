import { FormbitContextProvider, useFormbitContext } from 'formbit'
import {
  Alert,
  Button,
  FormField, Input,
  SectionTitle
} from '@radicalbit/radicalbit-design-system'
import { InputRef } from 'rc-input'
import { ChangeEvent } from 'react'
import { useAutoFocus } from '../../helpers/use-autofocus'
import { useHandleOnSubmit } from './use-handle-on-submit'
import { type FormValues, schema } from './schema'

export function BackendErrorsForm() {
  return (
    <FormbitContextProvider initialValues={{}} schema={schema}>
      <BackendErrorsFormInner />
    </FormbitContextProvider>
  )
}

function BackendErrorsFormInner() {
  return (
    <div className='flex flex-col gap-4 max-w-96 justify-center p-8 m-auto'>
      <SectionTitle title='Backend Errors' />

      <Email />

      <SilentError />

      <Actions />
    </div>
  )
}

function Email() {
  const { form, error, write } = useFormbitContext<FormValues>()

  const { handleOnSubmit } = useHandleOnSubmit()

  const handleOnChangeEmail = (e: ChangeEvent<HTMLInputElement>) => write('email', e.target.value)

  const ref = useAutoFocus<InputRef>()

  return (
    <FormField label="Email" message={error('email')}>
      <Input
        placeholder={'Try "taken@radicalbit.ai"'}
        onChange={handleOnChangeEmail}
        onPressEnter={handleOnSubmit}
        value={form.email}
        ref={ref}
        required
      />
    </FormField>
  )
}

function SilentError() {
  const { error } = useFormbitContext<FormValues>()

  const silentError = error('silent')

  if (!silentError) {
    return null
  }

  return (
    <div data-testid='silent-error'>
      <Alert type='error' message={silentError} showIcon />
    </div>
  )
}

function Actions() {
  const { resetForm } = useFormbitContext<FormValues>()

  const { handleOnSubmit, isSubmitDisabled, args: { isLoading } } = useHandleOnSubmit()

  return (
    <>
      <Button
        disabled={isSubmitDisabled}
        onClick={handleOnSubmit}
        loading={isLoading}
        type='primary'
      >
        Submit
      </Button>

      <Button onClick={resetForm}>
        Reset
      </Button>
    </>
  )
}
