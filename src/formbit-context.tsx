import React, { useContext, createContext, PropsWithChildren } from 'react'
import useFormbit from './use-formbit'
import { FormbitObject, FormbitValues, ValidationSchema } from './types'
import { MISSING_CONTEXT_ERROR } from './helpers/constants'
import { once } from 'lodash'

type Props<Values extends FormbitValues> = {
  initialValues?: Partial<Values> & Pick<FormbitValues, '__metadata'>
  schema: ValidationSchema<Values>
} & PropsWithChildren

const createFormbitContext =
  once(<Values extends FormbitValues>() => createContext<FormbitObject<Values> | undefined>(undefined))

export default function FormbitContextProvider<Values extends FormbitValues>({
  initialValues = {},
  schema,
  children
}: Props<Values>) {
  const FormbitContext = createFormbitContext<Values>()

  const value = useFormbit({ initialValues, yup: schema })

  return (
    <FormbitContext.Provider value={value}>{children}</FormbitContext.Provider>
  )
}

export const useFormbitContext = <Values extends FormbitValues>() => {
  const context = useContext(createFormbitContext<Values>())

  if (!context) {
    throw new Error(MISSING_CONTEXT_ERROR)
  }

  return context
}
