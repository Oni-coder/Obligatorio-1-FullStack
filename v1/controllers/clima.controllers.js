import { obtenerClimaActualService } from "../services/clima.services.js"

export const obtenerClimaActual = async (req, res) => {
    const clima = await obtenerClimaActualService();
    res.status(200).json(clima);
}