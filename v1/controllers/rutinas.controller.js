import {
  crearRutinaService,
  obtenerRutinasService,
  buscarRutinaPorIdService,
  actualizarRutinaService,
  eliminarRutinaService,
  obtenerEjerciciosParaMusculoService,
} from "../services/rutinas.services.js";

export const obtenerRutinas = async (req, res, next) => {
  try {
    const { nombre, nivelDificultad, categoria, page, limit } = req.query;

    const rutinas = await obtenerRutinasService({
      nombre,
      nivelDificultad,
      categoria,
      page,
      limit,
      userId: req.user.id,
    });

    res.json({
      message: "Rutinas obtenidas",
      ...rutinas,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerRutina = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rutina = await buscarRutinaPorIdService(id, req.user.id);

    res.json({
      message: `Obtener rutina con ID ${id}`,
      rutina,
    });
  } catch (error) {
    next(error);
  }
};

export const crearRutina = async (req, res, next) => {
  try {
    const { id } = req.user;

    const rutinaCreada = await crearRutinaService(req.body, id);

    res.status(201).json({
      message: "Rutina creada",
      rutina: rutinaCreada,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarRutina = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rutinaModificada = await actualizarRutinaService(
      id,
      req.body,
      req.user.id,
    );

    res.json({
      message: "Rutina actualizada",
      rutina: rutinaModificada,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarRutina = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rutinaEliminada = await eliminarRutinaService(id, req.user.id);

    res.json({
      message: "Rutina eliminada",
      rutina: rutinaEliminada,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerEjerciciosParaMusculo = async (req, res, next) => {
  try {
    const { musculo } = req.params;

    const ejercicios = await obtenerEjerciciosParaMusculoService(musculo);

    res.json({
      message: `Ejercicios para ${musculo}`,
      data: ejercicios,
    });
  } catch (error) {
    next(error);
  }
};
