import {
  Button,
  FormField, Input, InputNumber,
  SectionTitle,
  Void
} from '@radicalbit/radicalbit-design-system'
import { FormbitContextProvider, useFormbitContext } from 'formbit'
import { InputRef } from 'rc-input'
import { ChangeEvent } from 'react'
import { useAutoFocus } from '../../helpers/use-autofocus'
import { FormData, schema } from './schema'
import { useHandleOnSubmit } from './use-handle-on-submit'
import { useInitializeForm } from './use-initialize-form'
import { useFakeApiContext } from '../fake-api-context'

export function WriteRemoveAllForm() {
  return (
    <FormbitContextProvider schema={schema}>
      <WriteRemoveAllInner />
    </FormbitContextProvider>
  )
}

function WriteRemoveAllInner() {
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
      <SectionTitle title='Write/Remove All' subtitle="API may randomly trigger errors to demo error UI" />

      <FormField label="Name">
        <Input placeholder="Name" skeleton required />
      </FormField>

      <FormField label="Surname">
        <Input placeholder="Surname" skeleton required />
      </FormField>

      <FormField label="Email">
        <Input placeholder="Age" skeleton required />
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
          <br/>
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
      <SectionTitle title='Write/Remove All' subtitle="API may randomly trigger errors to demo error UI" />

      <Name />

      <Surname />

      <Age />

      <Actions />
    </div>
  )
}

function Name() {
  const { form, error, write } = useFormbitContext<FormData>()

  const { handleOnSubmit } = useHandleOnSubmit()

  const handleOnChangeName = (e: ChangeEvent<HTMLInputElement>) => write('name', e.target.value)

  const ref = useAutoFocus<InputRef>()

  return (
    <FormField label="Name" message={error('name')}>
      <Input
        placeholder="Name"
        onChange={handleOnChangeName}
        onPressEnter={handleOnSubmit}
        value={form.name}
        ref={ref}
        required
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

function Age() {
  const { form, error, write } = useFormbitContext<FormData>()

  const { handleOnSubmit } = useHandleOnSubmit()

  const handleOnChangeAge = (value?: number | null) => write('age', value)

  return (
    <FormField label="Age" message={error('age')}>
      <InputNumber
        type="number"
        placeholder="Age"
        onChange={handleOnChangeAge}
        onPressEnter={handleOnSubmit}
        value={form.age}
        required
      />
    </FormField>)
}

function Actions() {
  const { resetForm, removeAll, writeAll } = useFormbitContext<FormData>()

  const { handleOnSubmit, isSubmitDisabled, args: { isLoading } } = useHandleOnSubmit()

  const handleRemoveAll = () => removeAll(['name', 'surname'])

  const handlWriteAll = () => writeAll([['name', 'Johnny'], ['surname', 'Doey']])

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

      <Button onClick={handleRemoveAll}>
        Remove Name, Surname
      </Button>

      <Button onClick={handlWriteAll}>
        Write Name, Surname
      </Button>
    </>
  )
}
