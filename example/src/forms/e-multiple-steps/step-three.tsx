import { useFormbitContext } from 'formbit'
import { Button, FormField, Input, SectionTitle } from '@radicalbit/radicalbit-design-system'
import { InputRef } from 'rc-input'
import { ChangeEvent } from 'react'
import { useAutoFocus } from '../../helpers/use-autofocus'
import { useHandleOnSubmit } from './use-handle-on-submit'
import { FormData } from './schema'

export function StepThree() {
  return (
        <div className='flex flex-col gap-4 w-96 justify-center p-8 m-auto'>
            <SectionTitle title='Step 3' />

            <Email />

            <Actions />
        </div>)
}

function Email() {
  const { form, error, write } = useFormbitContext<FormData>()

  const { handleOnSubmit } = useHandleOnSubmit()

  const handleOnChangeEmail = (e: ChangeEvent<HTMLInputElement>) => write('email', e.target.value)

  const ref = useAutoFocus<InputRef>()

  return (
        <FormField label="Email" message={error('email')}>
            <Input
                placeholder="Email"
                onChange={handleOnChangeEmail}
                onPressEnter={handleOnSubmit}
                value={form.email}
                required
                ref={ref}
            />
        </FormField>
  )
}

function Actions() {
  const { form: { __metadata } } = useFormbitContext<FormData>()

  const handleReset = __metadata?.resetSteps

  const { handleOnSubmit, isSubmitDisabled, args: { isLoading } } = useHandleOnSubmit()

  return <>
        <Button disabled={isSubmitDisabled} onClick={handleOnSubmit} loading={isLoading} type='primary'>
            Submit
        </Button>

        <Button onClick={handleReset}>
            Reset
        </Button>
    </>
}
