import * as yup from 'yup'

export const schema = yup.object().shape({
  name: yup.string().min(2).required(),
  surname: yup.string().min(2).required(),
  email: yup.string().email().required()
});