import Joi from "joi";

export const registrarUsuarioSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "El email debe ser una cadena de texto",
        "string.empty": "El email no puede estar vacío",
        "string.email": "El email debe ser un correo electrónico válido",
        "any.required": "El email es obligatorio"
    }),
    password: Joi.string().min(6).required().messages({
        "string.base": "La contraseña debe ser una cadena de texto",
        "string.empty": "La contraseña no puede estar vacía",
        "string.min": "La contraseña debe tener al menos 6 caracteres",
        "any.required": "La contraseña es obligatoria"
    }),
    role: Joi.string().valid("user", "admin").default("user").messages({
        "string.base": "El rol debe ser una cadena de texto",
        "string.empty": "El rol no puede estar vacío",
        "any.only": "El rol debe ser 'user' o 'admin'"
    })
});