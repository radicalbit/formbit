import { FormbitContextProvider, useFormbitContext } from 'formbit';
import {
  Button,
  FormField, Input, InputNumber,
  SectionTitle
} from "@radicalbit/radicalbit-design-system";
import { InputRef } from 'rc-input';
import { ChangeEvent } from 'react';
import { useAutoFocus } from '../../helpers/use-autofocus';
import { useHandleOnSubmit } from '../context/use-handle-on-submit';
import { FormData, schema } from './schema';

const useBasicFormContext = () => useFormbitContext<FormData>();

export function BasicFormContext() {
  return (
    <FormbitContextProvider schema={schema}>
      <BasicFormInner />
    </FormbitContextProvider>
  );
}

function BasicFormInner() {
  return (
    <div className='flex flex-col gap-4 max-w-96 justify-center p-8 m-auto'>
      <SectionTitle title='Basic Form Context' />

      <Name />

      <Surname />

      <Age />

      <Actions />
    </div>
  );
}

function Name() {
  const { form, error, write } = useBasicFormContext();

  const [handleOnSubmit] = useHandleOnSubmit()

  const handleOnChangeName = (e: ChangeEvent<HTMLInputElement>) => write('name', e.target.value);

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
  );
}

function Surname() {
  const { form, error, write } = useBasicFormContext();

  const [handleOnSubmit] = useHandleOnSubmit()

  const handleOnChangeSurname = (e: ChangeEvent<HTMLInputElement>) => write('surname', e.target.value);

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

  const handleOnChangeAge = (value?: number | null) => write('age', value);

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
  const { resetForm } = useBasicFormContext();

  const [handleOnSubmit, isSubmitDisabled, isLoading] = useHandleOnSubmit()

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