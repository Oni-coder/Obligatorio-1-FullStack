import Ejercicio from "../models/ejercicio.model.js";
import Rutina from "../models/rutina.model.js";
import { isValidObjectId } from "mongoose";

export const obtenerEjerciciosService = async () => {
  const ejercicios = await Ejercicio.find();
  return ejercicios;
};

export const buscarEjercicioPorIdService = async (id) => {
  if (!isValidObjectId(id)) {
    const error = new Error("Id no válido");
    error.status = 400;
    error.details = { id };
    throw error;
  }

  const ejercicio = await Ejercicio.findById(id);

  if (!ejercicio) {
    const error = new Error("Ejercicio no encontrado");
    error.status = 404;
    error.details = { id };
    throw error;
  }

  return ejercicio;
};

export const crearEjercicioService = async (data) => {
  try {
    const nuevoEjercicio = new Ejercicio(data);
    await nuevoEjercicio.save();
    return nuevoEjercicio;
  } catch (error) {
    if (error.status) throw error;
    const errorCreacion = new Error("Error al crear el ejercicio");
    errorCreacion.status = 400;
    throw errorCreacion;
  }
};

export const actualizarEjercicioService = async (id, data) => {
  if (!isValidObjectId(id)) {
    const error = new Error("Id no válido");
    error.status = 400;
    error.details = { id };
    throw error;
  }

  const ejercicio = await Ejercicio.findById(id);

  if (!ejercicio) {
    const error = new Error("Ejercicio no encontrado");
    error.status = 404;
    error.details = { id };
    throw error;
  }

  const updateFields = {};
  if (data.nombre !== undefined) updateFields.nombre = data.nombre;
  if (data.descripcion !== undefined) updateFields.descripcion = data.descripcion;

  const ejercicioActualizado = await Ejercicio.findByIdAndUpdate(id, updateFields, { new: true });

  return ejercicioActualizado;
};

export const eliminarEjercicioService = async (id) => {
  if (!isValidObjectId(id)) {
    const error = new Error("Id no válido");
    error.status = 400;
    error.details = { id };
    throw error;
  }

  const ejercicio = await Ejercicio.findById(id);

  if (!ejercicio) {
    const error = new Error("Ejercicio no encontrado");
    error.status = 404;
    error.details = { id };
    throw error;
  }

  const rutinasConEjercicio = await Rutina.countDocuments({ ejercicios: id });
  if (rutinasConEjercicio > 0) {
    const error = new Error(`No se puede eliminar el ejercicio porque está siendo usado en ${rutinasConEjercicio} rutina(s)`);
    error.status = 409;
    throw error;
  }

  await ejercicio.deleteOne();
  return ejercicio;
};
