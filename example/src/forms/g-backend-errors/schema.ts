import * as yup from 'yup'

export const schema = yup.object().shape({
  email: yup.string().email().required()
})

export type FormValues = yup.InferType<typeof schema>
