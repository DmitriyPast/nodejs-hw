import { Joi, Segments } from 'celebrate';

export const authSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
};
//cpatb_oxota
