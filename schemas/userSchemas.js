import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.required(),
  password: Joi.required(),
  avatarURL: Joi.optional(),
  verificationToken: Joi.optional(),
});

export const resendVerificationEmailUserSchema = Joi.object({
  email: Joi.string().required(),
});
