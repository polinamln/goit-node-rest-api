import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.required(),
  phone: Joi.number().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.number(),
  email: Joi.string(),
});
