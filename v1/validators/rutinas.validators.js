import Joi from "joi";

export const agregarRutinaSchema = Joi.object({
    nombre: Joi.string().trim().min(3).max(50).required().messages({
        "string.base": "El nombre de la rutina debe ser una cadena de texto",
        "string.empty": "El nombre de la rutina no puede estar vacío",
        "string.min": "El nombre de la rutina debe tener al menos {#limit} caracteres",
        "string.max": "El nombre de la rutina no puede tener más de {#limit} caracteres",
        "any.required": "El nombre de la rutina es obligatorio"
    }),
    duracion: Joi.number().integer().positive().min(1).max(180).required().messages({
        "number.base": "La duración debe ser un número",
        "number.empty": "La duración no puede estar vacía",
        "number.integer": "La duración debe ser un número entero",
        "number.positive": "La duración debe ser un número positivo",
        "number.min": "La duración debe ser al menos {#limit} minutos",
        "number.max": "La duración no puede ser mayor que {#limit} minutos",
        "any.required": "La duración es obligatoria"
    }),
    nivelDificultad: Joi.string().valid("Principiante", "Intermedio", "Avanzado").required().messages({
        "string.base": "El nivel de dificultad debe ser una cadena de texto",
        "string.empty": "El nivel de dificultad no puede estar vacío",
        "any.required": "El nivel de dificultad es obligatorio"
    })
});

export const obtenerRutinasSchema = Joi.object({

    nombre: Joi.string(),

    nivelDificultad: Joi.string().valid(
        "Principiante",
        "Intermedio",
        "Avanzado"
    ),

    duracionMin: Joi.number().min(1),

    duracionMax: Joi.number().min(1),

    page: Joi.number().min(1).default(1),

    limit: Joi.number().min(1).max(50).default(10)

});