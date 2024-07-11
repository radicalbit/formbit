import * as yup from 'yup'

export const schema = yup.object().shape({
  name: yup.string().min(2).required(),
  surname: yup.string().min(2).required(),
  age: yup.number().min(18).required(),
  email: yup.string().email().required()

})

export type FormData = yup.InferType<typeof schema> & {
  __metadata: {
    step?: number,
    nextStep?: () => void,
    prevStep?: () => void,
    resetSteps?: () => void
  }
}
