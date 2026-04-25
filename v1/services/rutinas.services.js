import Rutina from "../models/rutina.model.js";

export const obtenerRutinasService = async () => {
    const rutinas = await Rutina.find();
    return rutinas;
}

export const obtenerRutinaService = async (id) => {
    const rutina = await Rutina.findById(id);
    return rutina;
}

export const crearRutinaService = async (data, userId) => {
    const usuario = await Usuario.findById(userId);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    
    if (usuario.plan === "plus") {
        const cantidad = await Rutina.countDocuments({ user: userId });

        if (cantidad >= 4) {
            throw new Error("Límite de 4 rutinas alcanzado para plan plus");
        }
    }

    const nuevaRutina = new Rutina({
        ...data,
        user: userId
    });

    await nuevaRutina.save();
    return nuevaRutina;
};

export const actualizarRutinaService = async (id, rutina) => {
    let rutinaActualizada = await Rutina.findByIdAndUpdate(id, rutina, { returnDocument: "after" });
    return rutinaActualizada;
}

export const eliminarRutinaService = async (id) => {
    const rutinaEliminada = await Rutina.findByIdAndDelete(id);
    return rutinaEliminada;
}

export const obtenerRutinasPorRangoPrecioService = async (min, max) => {
    const rutinas = await Rutina.find({ precio: { $gte: min, $lte: max } });
    return rutinas;
}