import {
  Button,
  FormField,
  Input,
  SectionTitle,
  Void
} from '@radicalbit/radicalbit-design-system'
import { FormbitContextProvider, useFormbitContext } from 'formbit'
import { InputRef } from 'rc-input'
import { ChangeEvent } from 'react'
import { useAutoFocus } from '../../helpers/use-autofocus'
import { useFakeApiContext } from '../fake-api-context'
import { FormData, schema } from './schema'
import { useHandleOnSubmit } from './use-handle-on-submit'
import { useInitializeForm } from './use-initialize-form'

export function EditLikeForm() {
  return (
      <FormbitContextProvider initialValues={{}} schema={schema}>
        <EditLikeInner />
      </FormbitContextProvider>
  )
}

function EditLikeInner() {
  const { fakeUser } = useFakeApiContext()
  const { isLoading, isSuccess, isError } = fakeUser

  if (isLoading) {
    return <IsLoading />
  }

  if (isError) {
    return <IsError />
  }

  if (isSuccess) {
    return <IsSuccess />
  }

  return null
}

function IsLoading() {
  return (
    <div className='flex flex-col gap-4 max-w-96 justify-center p-8 m-auto'>
      <SectionTitle title="Edit user" subtitle="API may randomly trigger errors to demo error UI" />

      <FormField label="Name">
        <Input placeholder="Name" skeleton required />
      </FormField>

      <FormField label="Surname">
        <Input placeholder="Surname" skeleton required />
      </FormField>

      <FormField label="Email">
        <Input placeholder="Email" skeleton required />
      </FormField>
    </div>
  )
}

function IsError() {
  const { fakeUser } = useFakeApiContext()
  const { refetch, isLoading } = fakeUser

  return (
    <div className='flex flex-col gap-4 max-w-96 justify-center p-8 m-auto'>
      <Void
        title=":( Error"
        description={<>
          Something went wrong. Failed
          <br />
          to load user data
        </>}
        actions={
          <Button onClick={refetch} loading={isLoading}>
            Retry
          </Button>
        }
      />
    </div>
  )
}

function IsSuccess() {
  useInitializeForm()

  return (
    <div className='flex flex-col gap-4 max-w-96 justify-center p-8 m-auto'>
      <SectionTitle title="Edit user" subtitle="API may randomly trigger errors to demo error UI" />

      <Name />

      <Surname />

      <Email />

      <Actions />
    </div>
  )
}

function Name() {
  const ref = useAutoFocus<InputRef>()
  const { form, error, write } = useFormbitContext<FormData>()

  const { handleOnSubmit } = useHandleOnSubmit()

  const handleOnChangeName = (e: ChangeEvent<HTMLInputElement>) => write('name', e.target.value)

  return (
    <FormField label="Name" message={error('name')}>
      <Input
        placeholder="Name"
        onChange={handleOnChangeName}
        onPressEnter={handleOnSubmit}
        value={form.name}
        required
        ref={ref}
      />
    </FormField>
  )
}

function Surname() {
  const { form, error, write } = useFormbitContext<FormData>()

  const { handleOnSubmit } = useHandleOnSubmit()

  const handleOnChangeSurname = (e: ChangeEvent<HTMLInputElement>) => write('surname', e.target.value)

  return (
    <FormField label="Surname" message={error('surname')}>
      <Input
        placeholder="Surname"
        onChange={handleOnChangeSurname}
        onPressEnter={handleOnSubmit}
        value={form.surname}
        required
      />
    </FormField>
  )
}

function Email() {
  const { form, error, write } = useFormbitContext<FormData>()

  const { handleOnSubmit } = useHandleOnSubmit()

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => write('email', e.target.value)

  return (
    <FormField label="Email" message={error('email')}>
      <Input
        placeholder="Email"
        onChange={handleChangeEmail}
        onPressEnter={handleOnSubmit}
        value={form.email}
        required
      />
    </FormField>
  )
}

function Actions() {
  const { handleOnSubmit, isSubmitDisabled, args: { isLoading } } = useHandleOnSubmit()

  return (
    <Button
      disabled={isSubmitDisabled}
      onClick={handleOnSubmit}
      loading={isLoading}
      type='primary'
    >
      Submit
    </Button>
  )
}
