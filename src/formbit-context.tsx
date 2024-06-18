import React, { useContext, createContext, PropsWithChildren } from 'react'
import useFormbit from './use-formbit'
import * as yup from 'yup'
import { FormbitObject, InitialValues, ValidationSchema } from './types'
import { MISSING_CONTEXT_ERROR } from './helpers/constants'
import { once } from 'lodash'

type Props<Values extends InitialValues> = {
  initialValues?: Partial<Values> | {}
  schema: ValidationSchema<Values>
} & PropsWithChildren

const createFormbitContext =
  once(<Values extends InitialValues>() => createContext<FormbitObject<Values> | undefined>(undefined))

export default function FormbitContextProvider<Values extends InitialValues>({
  initialValues = {},
  schema,
  children
}: Props<Values>) {
  const FormbitContext = createFormbitContext<Values>()

  const value = useFormbit({ initialValues, yup: schema || yup.object() })

  return (
    <FormbitContext.Provider value={value}>{children}</FormbitContext.Provider>
  )
}

export const useFormbitContext = <Values extends InitialValues>() => {
  const context = useContext(createFormbitContext<Values>())

  if (!context) {
    // This error can only be thrown if this hook is called outside the context,
    // and it should only happen during develop.
    throw new Error(MISSING_CONTEXT_ERROR)
  }

  return context
}
