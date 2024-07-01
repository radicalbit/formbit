import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FormbitContextProvider, useFormbitContext } from 'formbit'
import {
  Button,
  FontAwesomeIcon,
  FormField, FormMultiple, Input,
  SectionTitle
} from '@radicalbit/radicalbit-design-system'
import { InputRef } from 'rc-input'
import { ChangeEvent, ChangeEventHandler, useRef, useState } from 'react'
import * as yup from 'yup'
import { useAutoFocus } from '../../helpers/use-autofocus'
import { useHandleOnSubmit } from '../context/use-handle-on-submit'
import { schema } from './schema'

type FormData = yup.InferType<typeof schema>

const useAddableFieldsForm = () => useFormbitContext<FormData>()

export function AddableFieldsForm() {
  return (
    <FormbitContextProvider initialValues={{}} schema={schema}>
      <BasicFormInner />
    </FormbitContextProvider>
  )
}

function BasicFormInner() {
  const { form } = useAddableFieldsForm()

  const friends = form?.friends

  return (
    <div className='flex flex-col gap-6 w-96 justify-center p-8 m-auto'>
      <SectionTitle title='Addable Fields Form' />

      <Name />

      <Surname />

      <div className='flex flex-col gap-2 m-auto'>
        <FriendInput />
        {friends?.map((_, i) => <Friend index={i} />)}
      </div>

      <Actions />
    </div>
  )
}

function Name() {
  const { form, error, write } = useAddableFieldsForm()

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
        required
        ref={ref}
      />
    </FormField>
  )
}

function Surname() {
  const { form, error, write } = useAddableFieldsForm()
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

function FriendInput() {
  const inputNameRef = useRef<InputRef>(null)

  const { write, form, error } = useAddableFieldsForm()
  const friends = form?.friends ?? []

  const [name, setName] = useState<string>()
  const [surname, setSurname] = useState<string>()

  const handleChangeName: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => setName(value)
  const handleChangeSurname: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => setSurname(value)

  const handleAddFriend = () => {
    write('friends', [...friends, { name, surname }])
    setName('')
    setSurname('')
    inputNameRef.current?.focus()
  }

  return (
    <FormMultiple
      add={<FontAwesomeIcon icon={faPlus} onClick={handleAddFriend} />}
      align="flex-end"
    >
      <FormField label="Friend Name" message={error('friends')}>
        <Input
          bordersStyle="dashed"
          onChange={handleChangeName}
          onPressEnter={handleAddFriend}
          placeholder="+ Add Name"
          value={name}
          ref={inputNameRef}
        />
      </FormField>

      <FormField label="Friend Surname">
        <Input
          bordersStyle="dashed"
          onChange={handleChangeSurname}
          onPressEnter={handleAddFriend}
          placeholder="+ Add Surname"
          value={surname}
        />
      </FormField>
    </FormMultiple>
  )
}

function Friend({ index }: { index: number }) {
  const { error, write, validate, form } = useAddableFieldsForm()

  const name = form.friends?.[index].name
  const surname = form.friends?.[index].surname

  const handleOnBlurFriendName = () => validate(`headers[${index}].name`)
  const handleOnBlurFriendSurname = () => validate(`headers[${index}].surname`)

  const handleOnChangeFriendName: ChangeEventHandler<HTMLInputElement> =
    ({ target }) => write(`friends[${index}].key`, target.value)
  const handleOnChangeFriendSurname: ChangeEventHandler<HTMLInputElement> =
    ({ target }) => write(`friends[${index}].key`, target.value)

  const handleOnRemoveFriend = () => write('friends', form.friends?.filter((_, i) => index !== i))

  const errorMessage = error(`headers[${index}].name`) || error(`headers[${index}].surname`)

  return (
    <FormField key={index} message={errorMessage}>
      <FormMultiple
        remove={<FontAwesomeIcon icon={faXmark} onClick={handleOnRemoveFriend} />}
      >
        <Input
          onBlur={handleOnBlurFriendName}
          onChange={handleOnChangeFriendName}
          value={name}
        />

        <Input
          onBlur={handleOnBlurFriendSurname}
          onChange={handleOnChangeFriendSurname}
          value={surname}
        />

      </FormMultiple>
    </FormField>
  )
}

function Actions() {
  const { resetForm } = useAddableFieldsForm()

  const [handleOnSubmit, isSubmitDisabled, isLoading] = useHandleOnSubmit()

  return <>
    <Button disabled={isSubmitDisabled} onClick={handleOnSubmit} loading={isLoading} type='primary'>
      Submit
    </Button>

    <Button onClick={resetForm} type="ghost">
      Reset
    </Button>
  </>
}
