import {
  obtenerEjerciciosService,
  buscarEjercicioPorIdService,
  crearEjercicioService,
  actualizarEjercicioService,
  eliminarEjercicioService,
} from "../services/ejercicios.services.js";

export const obtenerEjercicios = async (req, res, next) => {
  try {
    const ejercicios = await obtenerEjerciciosService();

    res.json({
      message: "Ejercicios obtenidos",
      ejercicios,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerEjercicio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ejercicio = await buscarEjercicioPorIdService(id);

    res.json({
      message: `Obtener ejercicio con ID ${id}`,
      ejercicio,
    });
  } catch (error) {
    next(error);
  }
};

export const crearEjercicio = async (req, res, next) => {
  try {
    const ejercicioCreado = await crearEjercicioService(req.body);

    res.status(201).json({
      message: "Ejercicio creado",
      ejercicio: ejercicioCreado,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarEjercicio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ejercicioModificado = await actualizarEjercicioService(id, req.body);

    res.json({
      message: "Ejercicio actualizado",
      ejercicio: ejercicioModificado,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarEjercicio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ejercicioEliminado = await eliminarEjercicioService(id);

    res.json({
      message: "Ejercicio eliminado",
      ejercicio: ejercicioEliminado,
    });
  } catch (error) {
    next(error);
  }
};
