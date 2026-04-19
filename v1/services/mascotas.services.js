import { isValidObjectId } from "mongoose";
import Mascota from "../models/mascota.model.js";

/* export const crearMascotaService = async (mascota) => {
    const nuevaMascota = new Mascota(mascota);
    await nuevaMascota.save();
    return nuevaMascota;
} */

export const crearMascotaService = async (mascota) => {
    try {
        const nuevaMascota = new Mascota(mascota);
        await nuevaMascota.save();
        return nuevaMascota;
    } catch (error) {
        const errorCreacion = new Error("Error al crear la mascota");
        errorCreacion.status = 400;
        errorCreacion.details = { error };
        throw errorCreacion;
    }
}

export const listarMascotasService = async () => {
    const mascotas = await Mascota.find();
    return mascotas;
}

export const listarMascotasVacunadasService = async () => {
    const mascotasVacunadas = await Mascota.find({ vacunado: true });
    return mascotasVacunadas;
}

export const buscarMascotaPorIdService = async (id) => {

    if(!isValidObjectId(id)) {
        const errorId = new Error("Id no válido");
        errorId.status = 400;
        errorId.details = { id };
        throw errorId;
    }

    const mascota = await Mascota.findById(id);

    if (!mascota) {
        const errorId = new Error("Mascota no encontrada");
        errorId.status = 404;
        errorId.details = { id };
        throw errorId;
    }
    return mascota;

}

export const modificarMascotaService = async (id, datos) => {
    const mascotaModificada = await Mascota.findByIdAndUpdate(id, datos, { returnDocument: "after" });
    return mascotaModificada;
}

export const eliminarMascotaService = async (id) => {
    const mascotaEliminada = await Mascota.findByIdAndDelete(id);
    return mascotaEliminada;
}
