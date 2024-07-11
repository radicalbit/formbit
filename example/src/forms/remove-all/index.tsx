import { FormbitContextProvider, useFormbitContext } from 'formbit'
import {
  Button,
  FormField, Input, InputNumber,
  SectionTitle
} from '@radicalbit/radicalbit-design-system'
import { InputRef } from 'rc-input'
import { ChangeEvent } from 'react'
import * as yup from 'yup'
import { useAutoFocus } from '../../helpers/use-autofocus'
import { useHandleOnSubmit } from '../context/use-handle-on-submit'
import { schema } from './schema'

type FormData = yup.InferType<typeof schema>

const useBasicFormContext = () => useFormbitContext<FormData>()

export function WriteRemoveAllForm() {
  return (
    <FormbitContextProvider schema={schema}>
      <WriteRemoveAllInner />
    </FormbitContextProvider>
  )
}

function WriteRemoveAllInner() {
  return (
    <div className='flex flex-col gap-4 max-w-96 justify-center p-8 m-auto'>
      <SectionTitle title='Write/Remove All' />

      <Name />

      <Surname />

      <Age />

      <Actions />
    </div>
  )
}

function Name() {
  const { form, error, write } = useBasicFormContext()

  const [handleOnSubmit] = useHandleOnSubmit()

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
  const { form, error, write } = useBasicFormContext()

  const [handleOnSubmit] = useHandleOnSubmit()

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
  const { form, error, write } = useBasicFormContext()

  const [handleOnSubmit] = useHandleOnSubmit()

  const handleOnChangeAge = (value?: number | null) => write('age', value)

  return (
    <FormField label="Age" message={error('age')}>
      <InputNumber
        type="number"
        placeholder="Age"
        min={0}
        max={200}
        onChange={handleOnChangeAge}
        onPressEnter={handleOnSubmit}
        value={form.age}
        required
      />
    </FormField>)
}

function Actions() {
  const { resetForm, removeAll, writeAll } = useBasicFormContext()

  const [handleOnSubmit, isSubmitDisabled, isLoading] = useHandleOnSubmit()

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

      <Button onClick={resetForm} type="ghost">
        Reset
      </Button>

      <Button onClick={handleRemoveAll} type="ghost">
        Remove Name, Surname
      </Button>

      <Button onClick={handlWriteAll} type="ghost">
        Write Name, Surname
      </Button>

    </>
  )
}
