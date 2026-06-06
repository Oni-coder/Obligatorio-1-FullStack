import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "El email es obligatorio",
    "string.email": "Ingresa un email válido",
    "any.required": "El email es obligatorio",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria",
    "any.required": "La contraseña es obligatoria",
  }),
});

export const registerSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "El email es obligatorio",
    "string.email": "Ingresa un email válido",
    "any.required": "El email es obligatorio",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos {#limit} caracteres",
    "any.required": "La contraseña es obligatoria",
  }),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Las contraseñas no coinciden",
      "any.required": "Confirma tu contraseña",
    }),
});
