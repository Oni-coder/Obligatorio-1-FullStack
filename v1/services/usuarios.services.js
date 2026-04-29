import Usuario from "../models/usuario.model.js";
import { isValidObjectId } from "mongoose";

export const cambiarPlanAPremiumService = async (userId) => {
    if (!isValidObjectId(userId)) {
        const errorId = new Error("Id no válido");
        errorId.status = 400;
        errorId.details = { userId };
        throw errorId;
    }

    const usuario = await Usuario.findById(userId);

    if (!usuario) {
        const errorUsuario = new Error("Usuario no encontrado");
        errorUsuario.status = 404;
        errorUsuario.details = { userId };
        throw errorUsuario;
    }

    if (usuario.plan === "premium") {
        const errorPlan = new Error("Ya sos premium");
        errorPlan.status = 400;
        errorPlan.details = { userId };F
        throw errorPlan;
    }

    if (usuario.plan !== "plus") {
        const errorPlan = new Error("Plan inválido");
        errorPlan.status = 400;
        errorPlan.details = { userId };
        throw errorPlan;
    }

    usuario.plan = "premium";
    await usuario.save();

    return usuario;
};

export const crearUsuarioService = async (data) => {
    try {
        const usuario = new Usuario(data);
        await usuario.save();
        return usuario;
    } catch (error) {
        const errorCreacion = new Error("Error al crear el usuario");
        errorCreacion.status = 400;
        errorCreacion.details = { error };
        throw errorCreacion;
    }
};