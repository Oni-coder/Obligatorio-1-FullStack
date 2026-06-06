import Joi from "joi";

export const rutinaSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "Mínimo {#limit} caracteres",
    "string.max": "Máximo {#limit} caracteres",
    "any.required": "El nombre es obligatorio",
  }),
  duracion: Joi.number().integer().min(1).max(180).required().messages({
    "number.base": "La duración debe ser un número",
    "number.min": "Mínimo {#limit} minuto",
    "number.max": "Máximo {#limit} minutos",
    "any.required": "La duración es obligatoria",
  }),
  nivelDificultad: Joi.string()
    .valid("Principiante", "Intermedio", "Avanzado")
    .required()
    .messages({
      "any.only": "Selecciona un nivel de dificultad",
      "any.required": "La dificultad es obligatoria",
    }),
  categoria: Joi.string().hex().length(24).optional().allow("").messages({
    "string.hex": "Categoría inválida",
    "string.length": "Categoría inválida",
  }),
});
