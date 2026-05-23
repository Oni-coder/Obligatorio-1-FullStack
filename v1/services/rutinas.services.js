import Rutina from "../models/rutina.model.js";
import Usuario from "../models/usuario.model.js";
import Categoria from "../models/categoria.model.js";
import Ejercicio from "../models/ejercicio.model.js";
import { isValidObjectId } from "mongoose";
import axios from "axios";
import { traducirYResumirEjerciciosService } from "./ai.services.js";

export const obtenerEjerciciosParaMusculoService = async (musculo) => {
  try {
    const API_KEY = process.env.API_NINJAS_KEY;

    const ENDPOINT = `https://api.api-ninjas.com/v1/exercises?muscle=${musculo}`;

    const headers = {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
    };

    const response = await axios.get(ENDPOINT, { headers });

    const ejercicios = response.data;

    let ejerciciosTraducidos;

    try {
      ejerciciosTraducidos = await traducirYResumirEjerciciosService(ejercicios);
    } catch (errorIA) {
      console.error("Error IA:", errorIA.message);

      // Si falla el llamado a la API de Gemini, se devuelve los ejercicios sin resumir ni traducir
      ejerciciosTraducidos = ejercicios;
    }

    return ejerciciosTraducidos;
  } catch (error) {

    const errorApi = new Error("Error al obtener ejercicios");
    errorApi.status = 500;
    throw errorApi;
  }
};

export const obtenerRutinasService = async ({ nombre, nivelDificultad, categoria, page, limit, userId }) => {

  if (!isValidObjectId(userId)) {
    const error = new Error("Usuario inválido");
    error.status = 400;
    throw error;
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const filtros = { user: userId };

  if (nombre) filtros.nombre = { $regex: nombre, $options: "i" };
  if (nivelDificultad) filtros.nivelDificultad = nivelDificultad;
  if (categoria) filtros.categoria = categoria;

  const total = await Rutina.countDocuments(filtros);

  const rutinas = await Rutina.find(filtros)
    .skip(skip)
    .limit(limitNumber)
    .populate("user", "email plan")
    .populate("categoria", "nombre descripcion")
    .populate("ejercicios", "nombre descripcion");

  return { total, page: pageNumber, limit: limitNumber, totalPages: Math.ceil(total / limitNumber), data: rutinas };
};

export const buscarRutinaPorIdService = async (id, userId) => {

  if (!isValidObjectId(id)) {
    const error = new Error("Id no válido");
    error.status = 400;
    error.details = { id };
    throw error;
  }

  const rutina = await Rutina.findById(id)
    .populate("user", "email plan")
    .populate("categoria", "nombre descripcion")
    .populate("ejercicios", "nombre descripcion");

  if (!rutina) {
    const error = new Error("Rutina no encontrada");
    error.status = 404;
    error.details = { id };
    throw error;
  }

  // OWASP BOLA
  if (rutina.user._id.toString() !== userId) {
    const error = new Error("No autorizado");
    error.status = 403;
    throw error;
  }

  return rutina;
};

export const crearRutinaService = async (data, userId) => {
  try {
    if (!isValidObjectId(userId)) {
      const errorId = new Error("ID de usuario inválido");
      errorId.status = 400;
      throw errorId;
    }

    const usuario = await Usuario.findById(userId);

    if (!usuario) {
      const errorUsuario = new Error("Usuario no encontrado");
      errorUsuario.status = 404;
      throw errorUsuario;
    }

    if (usuario.plan === "plus") {
      const cantidad = await Rutina.countDocuments({ user: userId });

      if (cantidad >= 4) {
        const errorLimite = new Error("Límite de 4 rutinas alcanzado para plan plus");
        errorLimite.status = 403;
        throw errorLimite;
      }
    }

    if (data.categoria) {
      const categoriaExistente = await Categoria.findById(data.categoria);
      if (!categoriaExistente) {
        const errorCategoria = new Error("Categoría no encontrada");
        errorCategoria.status = 404;
        throw errorCategoria;
      }
    }

    if (data.ejercicios && data.ejercicios.length > 0) {
      const ejerciciosEncontrados = await Ejercicio.find({ _id: { $in: data.ejercicios } });
      if (ejerciciosEncontrados.length !== data.ejercicios.length) {
        const errorEjercicio = new Error("Uno o más ejercicios no encontrados");
        errorEjercicio.status = 404;
        throw errorEjercicio;
      }
    }

    const nuevaRutina = new Rutina({ ...data, user: userId });
    await nuevaRutina.save();

    return nuevaRutina;

  } catch (error) {

    if (error.status) throw error;

    const errorCreacion = new Error("Error al crear la rutina");
    errorCreacion.status = 400;
    errorCreacion.details = { error };
    throw errorCreacion;
  }
};

export const actualizarRutinaService = async (id, data, userId) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("Id no válido");
    errorId.status = 400;
    throw errorId;
  }

  const rutina = await Rutina.findById(id);

  if (!rutina) {
    const error = new Error("Rutina no encontrada");
    error.status = 404;
    throw error;
  }

  // OWASP BOLA
  if (rutina.user.toString() !== userId) {
    const error = new Error("No autorizado");
    error.status = 403;
    throw error;
  }

  if (data.categoria) {
    const categoriaExistente = await Categoria.findById(data.categoria);
    if (!categoriaExistente) {
      const errorCategoria = new Error("Categoría no encontrada");
      errorCategoria.status = 404;
      throw errorCategoria;
    }
  }

  if (data.ejercicios && data.ejercicios.length > 0) {
    const ejerciciosEncontrados = await Ejercicio.find({ _id: { $in: data.ejercicios } });
    if (ejerciciosEncontrados.length !== data.ejercicios.length) {
      const errorEjercicio = new Error("Uno o más ejercicios no encontrados");
      errorEjercicio.status = 404;
      throw errorEjercicio;
    }
  }

  const camposUpdate = {
    nombre: data.nombre,
    duracion: data.duracion,
    nivelDificultad: data.nivelDificultad,
  };
  if (data.categoria !== undefined) camposUpdate.categoria = data.categoria;
  if (data.ejercicios !== undefined) camposUpdate.ejercicios = data.ejercicios;

  const rutinaActualizada = await Rutina.findByIdAndUpdate(id, camposUpdate, { new: true });

  return rutinaActualizada;
};

export const eliminarRutinaService = async (id, userId) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("Id no válido");
    errorId.status = 400;
    throw errorId;
  }

  const rutina = await Rutina.findById(id);

  if (!rutina) {
    const error = new Error("Rutina no encontrada");
    error.status = 404;
    throw error;
  }

  // OWASP BOLA
  if (rutina.user.toString() !== userId) {
    const error = new Error("No autorizado");
    error.status = 403;
    throw error;
  }

  await rutina.deleteOne();

  return rutina;
};
