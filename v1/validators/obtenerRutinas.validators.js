import Joi from "joi";

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