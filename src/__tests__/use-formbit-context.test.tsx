import { act, renderHook } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import FormbitContextProvider, { useFormbitContext } from 'src/formbit-context'
import { InitialValues, ValidationSchema } from 'src/types'
import * as Yup from 'yup'
import { TEST_ERROR_MESSAGES } from 'src/helpers/constants'

const renderWithContext = (initialValues: InitialValues, schema: ValidationSchema<{}>) => {
  const wrapper = ({ children }: PropsWithChildren) =>
    <FormbitContextProvider initialValues={initialValues} schema={schema}>
        {children}
    </FormbitContextProvider>
  return renderHook(() => useFormbitContext(), { wrapper })
}

const initialValues = {
  name: 'Harry'
}

const schema = Yup.object({
  age: Yup.number().min(18)
})

describe('useFormbitContext', () => {
  it('Should access the initialValues given to the context provider', () => {
    const { result, unmount } = renderWithContext(initialValues, schema)

    expect(result.current.form).toStrictEqual(initialValues)

    unmount()
  })

  it('Should access to initial schema given to the context provider', () => {
    const { result, unmount } = renderWithContext(initialValues, schema)

    act(() => result.current.write('age', 2))

    act(() => result.current.validateForm())

    expect(result.current.error('age')).toMatch(TEST_ERROR_MESSAGES.MIN)

    unmount()
  })

  it('Can be re-initialized with different values', () => {
    const newInitialValues = { name: 'Hermione' }

    const { result, unmount } = renderWithContext(initialValues, schema)

    act(() => result.current.initialize(newInitialValues))

    expect(result.current.form).toStrictEqual(newInitialValues)

    act(() => result.current.resetForm()) // resetting to check if also initialValues was overwritten

    expect(result.current.form).toStrictEqual(newInitialValues)

    unmount()
  })
})
