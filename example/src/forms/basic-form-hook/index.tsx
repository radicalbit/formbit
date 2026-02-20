import useFormbit from 'formbit';
import {
  Button,
  FormField, Input,
  SectionTitle,
} from "@radicalbit/radicalbit-design-system";
import { InputRef } from 'rc-input';
import { ChangeEvent } from 'react';
import { usePost } from '../context/api-context';
import { useAutoFocus } from '../../helpers/use-autofocus';
import { success } from '../../helpers/message';
import { FormData, schema } from './schema';

type FieldProps = {
  value?: string,
  error?: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  onSubmit: () => void
}

type ActionsProps = {
  isLoading?: boolean,
  isDisabled?: boolean,
  onSubmit: () => void
  onReset: () => void
}

export function BasicFormHook() {
  const [triggerMutation, isLoading] = usePost()

  const { form, error, write, resetForm, submitForm, isFormInvalid, isDirty } = useFormbit<FormData>({ initialValues: {}, yup: schema });

  const handleOnChangeName = (e: ChangeEvent<HTMLInputElement>) => write('name', e.target.value);
  const handleOnChangeSurname = (e: ChangeEvent<HTMLInputElement>) => write('surname', e.target.value);

  const isSubmitDisabled = isFormInvalid() || !isDirty

  const handleOnSubmit = () => {
    if (isSubmitDisabled || isLoading) return;

    submitForm(async ({ form }) => {
      await triggerMutation(form)
      success(form)
      resetForm()
    });
  };

  return (
    <div className='flex flex-col gap-4 max-w-96 justify-center p-8 m-auto'>
      <SectionTitle title='Basic Form Hook' />

      <Name value={form.name} error={error('name')} onChange={handleOnChangeName} onSubmit={handleOnSubmit} />

      <Surname value={form.surname} error={error('surname')} onChange={handleOnChangeSurname} onSubmit={handleOnSubmit} />

      <Actions onReset={resetForm} onSubmit={handleOnSubmit} isLoading={isLoading} isDisabled={isSubmitDisabled} />

    </div >
  );
}


function Name({ value, error, onChange, onSubmit }: FieldProps) {
  const ref = useAutoFocus<InputRef>()

  return (
    <FormField label="Name" message={error}>
      <Input
        placeholder="Name"
        onChange={onChange}
        onPressEnter={onSubmit}
        value={value}
        ref={ref}
        required
      />
    </FormField>
  );
}

function Surname({ value, error, onChange, onSubmit }: FieldProps) {
  return (
    <FormField label="Surname" message={error}>
      <Input
        placeholder="Surname"
        onChange={onChange}
        onPressEnter={onSubmit}
        value={value}
        required
      />
    </FormField>
  )

}

function Actions({ onSubmit, onReset, isLoading, isDisabled }: ActionsProps) {
  return (
    <div className='pt-4 gap-4 flex flex-col'>
      <Button disabled={isDisabled} onClick={onSubmit} loading={isLoading} type='primary'>
        Submit
      </Button>

      <Button onClick={onReset} disabled={isDisabled}>
        Reset
      </Button>
    </div>
  )
}
