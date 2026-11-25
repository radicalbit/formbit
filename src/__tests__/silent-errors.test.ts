import { act, renderHook } from '@testing-library/react'
import useFormbit from 'src/use-formbit'
import * as Yup from 'yup'

const schema = Yup.object({
  name: Yup.string().min(3).required()
})

const validValues = { name: 'Harry' }
const invalidValues = { name: 'Al' }

const SILENT = 'This email is already registered'

describe('silent errors', () => {
  it('Should ignore a silent error in isFormValid/isFormInvalid', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues: validValues, yup: schema }))

    act(() => result.current.setError('silent', SILENT))

    expect(result.current.error('silent')).toBe(SILENT)
    expect(result.current.isFormValid()).toBe(true)
    expect(result.current.isFormInvalid()).toBe(false)

    unmount()
  })

  it('Should keep a silent error across writes under live validation', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues: invalidValues, yup: schema }))

    // Fails once, so `name` becomes live-validated.
    act(() => result.current.validate('name'))
    expect(result.current.liveValidation('name')).toBe(true)

    act(() => result.current.setError('silent', SILENT))
    act(() => result.current.write('name', 'Harry'))

    expect(result.current.error('name')).toBeUndefined()
    expect(result.current.error('silent')).toBe(SILENT)

    unmount()
  })

  it('Should clear silent errors on submitForm with a valid form', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues: validValues, yup: schema }))

    act(() => result.current.setError('silent', SILENT))
    act(() => result.current.submitForm(() => {}))

    expect(result.current.error('silent')).toBeUndefined()

    unmount()
  })

  it('Should clear silent errors on submitForm with an invalid form', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues: invalidValues, yup: schema }))

    act(() => result.current.setError('silent', SILENT))
    act(() => result.current.submitForm(() => {}))

    expect(result.current.error('silent')).toBeUndefined()
    expect(result.current.error('name')).toBeTruthy()

    unmount()
  })

  it('Should clear silent errors on validateForm', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues: validValues, yup: schema }))

    act(() => result.current.setError('silent', SILENT))
    act(() => result.current.validateForm())

    expect(result.current.error('silent')).toBeUndefined()

    unmount()
  })

  it('Should clear silent errors on resetForm', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues: validValues, yup: schema }))

    act(() => result.current.setError('silent', SILENT))
    act(() => result.current.resetForm())

    expect(result.current.error('silent')).toBeUndefined()

    unmount()
  })

  it('Should clear silent errors on initialize', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues: validValues, yup: schema }))

    act(() => result.current.setError('silent', SILENT))
    act(() => result.current.initialize({ name: 'Ron' }))

    expect(result.current.error('silent')).toBeUndefined()

    unmount()
  })

  it('Should support nested silent errors', () => {
    const { result, unmount } = renderHook(() => useFormbit({ initialValues: validValues, yup: schema }))

    act(() => result.current.setError('silent.email', 'taken'))

    expect(result.current.error('silent.email')).toBe('taken')
    expect(result.current.isFormValid()).toBe(true)
    expect(result.current.isFormInvalid()).toBe(false)

    unmount()
  })
})
