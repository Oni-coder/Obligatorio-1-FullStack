import Usuario from "../models/usuario.model.js";

export const cambiarPlanService = async (userId) => {
    const usuario = await Usuario.findById(userId);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    if (usuario.plan === "premium") {
        throw new Error("Ya sos premium");
    }

    if (usuario.plan !== "plus") {
        throw new Error("Plan inválido");
    }

    usuario.plan = "premium";
    await usuario.save();

    return usuario;
};

export const crearUsuarioService = async (data) => {
    const usuario = new Usuario(data);
    return await usuario.save();
};