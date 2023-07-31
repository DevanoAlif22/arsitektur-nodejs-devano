// kita gunakan joy
import Joi from "joi";

// register
const registerUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
  name: Joi.string().max(100).required(),
});

// login
const loginUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

// get user
const getUserValidation = Joi.string().max(100).required();

// update user
const updateUserValidation = Joi.object({
  username: Joi.string().max(100),
  password: Joi.string().max(100).optional(),
  name: Joi.string().max(100).optional(),
});

export {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  updateUserValidation,
};
