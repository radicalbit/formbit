import { FormbitContextProvider, useFormbitContext } from 'formbit';
import {
  Button,
  FormField,
  Input,
  SectionTitle
} from "rbit-design-system-os";
import { InputRef } from 'rc-input';
import { ChangeEvent, useEffect } from 'react';
import * as yup from 'yup';
import { FakeApiProvider, useGetUser } from '../context/api-context';
import { useAutoFocus } from '../../helpers/use-autofocus';
import { useHandleOnSubmit } from '../context/use-handle-on-submit';
import { schema } from './schema';

type FormData = yup.InferType<typeof schema> & {
  __metadata?: {
    isLoading?: boolean
  }
}

const useEditLikeContext = () => useFormbitContext<FormData>();

export function EditLikeForm() {
  return (
    <FakeApiProvider>
      <FormbitContextProvider initialValues={{}} schema={schema}>
        <EditLikeInner />
      </FormbitContextProvider>
    </FakeApiProvider>
  );
}

function EditLikeInner() {
  const [user] = useGetUser()
  const { initialize } = useEditLikeContext()

  useEffect(() => {
    if (user) {
      initialize({ ...user })
    }
  }, [initialize, user])

  return (
    <div className='flex flex-col gap-4 max-w-96 justify-center p-8 m-auto'>
      <SectionTitle title='Edit user' />

      <Name />

      <Surname />

      <Email />

      <Actions />
    </div>
  );
}

function Name() {
  const [, isLoading] = useGetUser()

  const { form, error, write } = useEditLikeContext();

  const [handleOnSubmit] = useHandleOnSubmit();

  const handleOnChangeName = (e: ChangeEvent<HTMLInputElement>) => write('name', e.target.value);

  const ref = useAutoFocus<InputRef>(isLoading)

  return (
    <FormField label="Name" message={error('name')}>
      <Input
        placeholder="Name"
        onChange={handleOnChangeName}
        onPressEnter={handleOnSubmit}
        value={form.name}
        required
        skeleton={isLoading}
        ref={ref}
      />
    </FormField>
  );
}

function Surname() {
  const [, isLoading] = useGetUser()
  const { form, error, write } = useEditLikeContext();

  const [handleOnSubmit] = useHandleOnSubmit();

  const handleOnChangeSurname = (e: ChangeEvent<HTMLInputElement>) => write('surname', e.target.value);

  return (
    <FormField label="Surname" message={error('surname')}>
      <Input
        placeholder="Surname"
        onChange={handleOnChangeSurname}
        onPressEnter={handleOnSubmit}
        value={form.surname}
        skeleton={isLoading}
        required
      />
    </FormField>
  )
}

function Email() {
  const [, isLoading] = useGetUser()
  const { form, error, write } = useEditLikeContext()

  const [handleOnSubmit] = useHandleOnSubmit();

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => write('email', e.target.value);

  return (
    <FormField label="Email" message={error('email')}>
      <Input
        placeholder="Email"
        onChange={handleChangeEmail}
        onPressEnter={handleOnSubmit}
        value={form.email}
        skeleton={isLoading}
        required
      />
    </FormField>
  )
}
function Actions() {
  const [, isLoadingUser] = useGetUser()

  const [handleOnSubmit, isSubmitDisabled, isLoading] = useHandleOnSubmit()

  return (
    <Button
      disabled={isSubmitDisabled || isLoadingUser}
      onClick={handleOnSubmit}
      loading={isLoading}
      type='primary'
    >
      Submit
    </Button>
  )

}
