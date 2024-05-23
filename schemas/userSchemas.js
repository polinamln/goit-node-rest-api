import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.required(),
  password: Joi.required(),
  avatarURL: Joi.optional(),
});
