import { crearRutinaService,
    obtenerRutinasService,
    buscarRutinaPorIdService,
    actualizarRutinaService,
    eliminarRutinaService,
    obtenerRutinasPorRangoPrecioService,
    obtenerEjerciciosParaMusculoService
 } from "../services/rutinas.services.js";

export const obtenerRutinas = async (req, res) => {
    const {precioMin, precioMax} = req.query;
    if(precioMin !== undefined && precioMax !== undefined){
        const rutinas = await obtenerRutinasPorRangoPrecioService(precioMin, precioMax);
        return res.json({ message: `Obtener rutinas por rango de precio`, rutinas });
    }
    const rutinas = await obtenerRutinasService();
    res.json({ message: "Obtener todas las rutinas", rutinas });
}

export const obtenerRutina = async (req, res) => {
    const { id } = req.params;
    const rutina = await buscarRutinaPorIdService(id);
    res.json({ message: `Obtener rutina con ID ${id}`, rutina });
}

export const crearRutina = async (req, res) => {
    const { id } = req.user;
    const rutinaCreada = await crearRutinaService(req.body, id);
    res.json({ message: `Rutina creada`, rutina: rutinaCreada });
}

export const actualizarRutina = async (req, res) => {
    const { id } = req.params;
    const rutinaModificada = await actualizarRutinaService(id, req.body);
    res.json({ message: `Actualizar rutina`, rutina: rutinaModificada });
}

export const eliminarRutina = async (req, res) => {
    const { id } = req.params;
    const rutinaEliminada = await eliminarRutinaService(id);
    res.json({ message: `Eliminar rutina`, rutina: rutinaEliminada });
}


export const obtenerEjerciciosParaMusculo = async (req, res) => {

    const { musculo } = req.params;

    const ejercicios =
        await obtenerEjerciciosParaMusculoService(musculo);

    res.json({
        message: `Ejercicios para ${musculo}`,
        data: ejercicios
    });
};