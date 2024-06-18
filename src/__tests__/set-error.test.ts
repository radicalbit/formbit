import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const initialValues = {}
const yup = Yup.object()

describe('setError fn', () => {
  it('Should set error for the corresponding field', () => {
    const errorMessage = 'Age is mandatory'

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.setError('age', errorMessage))

    expect(result.current.error('age')).toStrictEqual(errorMessage)

    unmount()
  })

  it('Should set error for the corresponding nested field', () => {
    const errorMessage = 'Age is mandatory'

    const { result, unmount } = renderHook(() => useFormbit({ initialValues, yup }))

    act(() => result.current.setError('user.age', errorMessage))

    expect(result.current.error('user.age')).toStrictEqual(errorMessage)

    unmount()
  })
})
