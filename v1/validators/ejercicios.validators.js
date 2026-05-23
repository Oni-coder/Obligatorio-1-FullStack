import Joi from "joi";

export const agregarEjercicioSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "El nombre del ejercicio debe ser una cadena de texto",
    "string.empty": "El nombre del ejercicio no puede estar vacío",
    "string.min": "El nombre del ejercicio debe tener al menos {#limit} caracteres",
    "string.max": "El nombre del ejercicio no puede tener más de {#limit} caracteres",
    "any.required": "El nombre del ejercicio es obligatorio",
  }),
  descripcion: Joi.string().trim().max(300).messages({
    "string.base": "La descripción debe ser una cadena de texto",
    "string.max": "La descripción no puede tener más de {#limit} caracteres",
  }),
});

export const actualizarEjercicioSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).messages({
    "string.base": "El nombre del ejercicio debe ser una cadena de texto",
    "string.empty": "El nombre del ejercicio no puede estar vacío",
    "string.min": "El nombre del ejercicio debe tener al menos {#limit} caracteres",
    "string.max": "El nombre del ejercicio no puede tener más de {#limit} caracteres",
  }),
  descripcion: Joi.string().trim().max(300).messages({
    "string.base": "La descripción debe ser una cadena de texto",
    "string.max": "La descripción no puede tener más de {#limit} caracteres",
  }),
});
