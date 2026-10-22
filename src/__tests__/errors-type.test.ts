import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import { Errors } from 'src/types'
import * as Yup from 'yup'

const schema = Yup.object({
  friends: Yup.array(Yup.object({ name: Yup.string().required() }))
})

describe('Errors type', () => {
  it('Should store errors as a nested object, mirroring the form', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues: {}, yup: schema }))

    act(() => result.current.write('friends', [{ name: '' }], { pathsToValidate: ['friends[0].name'] }))

    expect(result.current.errors).toStrictEqual({ friends: [{ name: expect.any(String) }] })

    unmount()
  })

  it('Should accept nested objects and arrays', () => {
    expectTypeOf({ friends: [{ name: 'x' }] }).toExtend<Errors>()
    expectTypeOf({ silent: { email: 'x' } }).toExtend<Errors>()
    expectTypeOf({ age: 'x' }).toExtend<Errors>()
  })

  it('Should keep error(path) typed as string | undefined', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues: {}, yup: schema }))

    expectTypeOf(result.current.error('friends[0].name')).toEqualTypeOf<string | undefined>()

    unmount()
  })
})
