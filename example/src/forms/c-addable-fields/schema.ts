import * as yup from 'yup'

export const schema = yup.object().shape({
  name: yup.string().min(2).required(),
  surname: yup.string().min(2).required(),
  friends: yup.array().of(
    yup.object().shape({
      name: yup.string().min(2).required(),
      surname: yup.string().min(2).required()
    })
  ).required()
})

export type FormData = yup.InferType<typeof schema>
