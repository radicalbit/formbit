import { act, renderHook } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import FormbitContextProvider, { useFormbitContext } from 'src/formbit-context'
import { FormbitValues, ValidationSchema } from 'src/types'
import * as Yup from 'yup'
import { TEST_ERROR_MESSAGES } from 'src/helpers/constants'

const renderWithContext = (initialValues: FormbitValues, schema: ValidationSchema<{}>) => {
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

    expect(result.current.form).toMatchObject(newInitialValues)

    act(() => result.current.resetForm()) // resetting to check if also initialValues was overwritten

    expect(result.current.form).toMatchObject(newInitialValues)

    unmount()
  })

  it('Should reject initialValues that are not an object', () => {
    const wrapper = ({ children }: PropsWithChildren) =>
      // @ts-expect-error initialValues must be a partial of the form values
      <FormbitContextProvider initialValues={5} schema={schema}>
        {children}
      </FormbitContextProvider>

    expect(wrapper).toBeDefined()
  })

  it('Should accept __metadata in initialValues even when the schema does not declare it', () => {
    const wrapper = ({ children }: PropsWithChildren) =>
      <FormbitContextProvider initialValues={{ __metadata: { step: 0 } }} schema={schema}>
        {children}
      </FormbitContextProvider>

    const { result, unmount } = renderHook(() => useFormbitContext(), { wrapper })

    expect(result.current.form.__metadata).toStrictEqual({ step: 0 })

    unmount()
  })
})
