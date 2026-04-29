import Joi from "joi";

export const agregarCategoriaSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "El nombre de la categoría debe ser una cadena de texto",
    "string.empty": "El nombre de la categoría no puede estar vacío",
    "string.min":
      "El nombre de la categoría debe tener al menos {#limit} caracteres",
    "string.max":
      "El nombre de la categoría no puede tener más de {#limit} caracteres",
    "any.required": "El nombre de la categoría es obligatorio",
  }),
  descripcion: Joi.string().trim().max(200).messages({
    "string.base": "La descripción debe ser una cadena de texto",
    "string.max": "La descripción no puede tener más de {#limit} caracteres",
  }),
});

export const actualizarCategoriaSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(50).messages({
    "string.base": "El nombre de la categoría debe ser una cadena de texto",
    "string.empty": "El nombre de la categoría no puede estar vacío",
    "string.min":
      "El nombre de la categoría debe tener al menos {#limit} caracteres",
    "string.max":
      "El nombre de la categoría no puede tener más de {#limit} caracteres",
  }),
  descripcion: Joi.string().trim().max(200).messages({
    "string.base": "La descripción debe ser una cadena de texto",
    "string.max": "La descripción no puede tener más de {#limit} caracteres",
  }),
});
