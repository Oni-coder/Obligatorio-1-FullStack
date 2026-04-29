import Rutina from "../models/rutina.model.js";
import Usuario from "../models/usuario.model.js";
import { isValidObjectId } from "mongoose";
import axios from "axios";
import { traducirYResumirEjerciciosService } from "./ai.services.js";

export const obtenerEjerciciosParaMusculoService = async (musculo) => {

  try {

    const API_KEY =
      process.env.API_NINJAS_KEY;

    const ENDPOINT =
      `https://api.api-ninjas.com/v1/exercises?muscle=${musculo}`;

    const headers = {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY
    };

    // API externa

    const response =
      await axios.get(
        ENDPOINT,
        { headers }
      );

    const ejercicios =
      response.data;

    // FALLBACK IA

    let ejerciciosTraducidos;

    try {

      ejerciciosTraducidos =
        await traducirYResumirEjerciciosService(
          ejercicios
        );

    } catch (errorIA) {

      console.error(
        "Error IA:",
        errorIA.message
      );

      // fallback
      ejerciciosTraducidos =
        ejercicios;
    }

    return ejerciciosTraducidos;

  } catch (error) {

    console.error(error);

    const errorApi = new Error(
      "Error al obtener ejercicios"
    );

    errorApi.status = 500;

    throw errorApi;
  }
};

export const obtenerRutinasService = async ({
  nombre,
  nivelDificultad,
  duracionMin,
  duracionMax,
  page,
  limit,
  userId
}) => {

  // VALIDAR USER ID

  if (!isValidObjectId(userId)) {

    const error = new Error(
      "Usuario inválido"
    );

    error.status = 400;

    throw error;
  }

  // convertir valores

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // FILTROS

  const filtros = {
    user: userId
  };

  // filtro nombre

  if (nombre) {

    filtros.nombre = {
      $regex: nombre,
      $options: "i"
    };
  }

  // filtro dificultad

  if (nivelDificultad) {

    filtros.nivelDificultad =
      nivelDificultad;
  }

  // filtro duración

  if (duracionMin || duracionMax) {

    filtros.duracion = {};

    if (duracionMin) {

      filtros.duracion.$gte =
        Number(duracionMin);
    }

    if (duracionMax) {

      filtros.duracion.$lte =
        Number(duracionMax);
    }
  }

  // paginación

  const skip =
    (pageNumber - 1) * limitNumber;

  const rutinas =
    await Rutina.find(filtros)
      .skip(skip)
      .limit(limitNumber)
      .populate("user", "email plan");

  const total =
    await Rutina.countDocuments(
      filtros
    );

  return {

    total,

    page: pageNumber,

    limit: limitNumber,

    totalPages:
      Math.ceil(total / limitNumber),

    data: rutinas
  };
};

export const buscarRutinaPorIdService = async (
    id,
    userId
) => {

    // validar ObjectId

    if (!isValidObjectId(id)) {

        const error = new Error(
            "Id no válido"
        );

        error.status = 400;

        error.details = { id };

        throw error;
    }

    // buscar rutina

    const rutina =
        await Rutina.findById(id)
            .populate("user", "email plan");

    // verificar existencia

    if (!rutina) {

        const error = new Error(
            "Rutina no encontrada"
        );

        error.status = 404;

        error.details = { id };

        throw error;
    }

    // OWASP BOLA / IDOR

    if (
        rutina.user._id.toString() !==
        userId
    ) {

        const error = new Error(
            "No autorizado"
        );

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
        const errorLimite = new Error(
          "Límite de 4 rutinas alcanzado para plan plus",
        );
        errorLimite.status = 403;
        throw errorLimite;
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

export const actualizarRutinaService = async (
    id,
    data,
    userId
) => {

    if (!isValidObjectId(id)) {

        const errorId = new Error("Id no válido");

        errorId.status = 400;

        throw errorId;
    }

    const rutina =
        await Rutina.findById(id);

    if (!rutina) {

        const error = new Error(
            "Rutina no encontrada"
        );

        error.status = 404;

        throw error;
    }

    // OWASP BOLA CHECK

    if (
        rutina.user.toString() !==
        userId
    ) {

        const error = new Error(
            "No autorizado"
        );

        error.status = 403;

        throw error;
    }

    // whitelist fields

    rutina.nombre =
        data.nombre ?? rutina.nombre;

    rutina.duracion =
        data.duracion ?? rutina.duracion;

    rutina.nivelDificultad =
        data.nivelDificultad ??
        rutina.nivelDificultad;

    await rutina.save();

    return rutina;
};

export const eliminarRutinaService = async ( id, userId) => {

    if (!isValidObjectId(id)) {

        const errorId = new Error(
            "Id no válido"
        );

        errorId.status = 400;

        throw errorId;
    }

    const rutina =
        await Rutina.findById(id);

    if (!rutina) {

        const error = new Error(
            "Rutina no encontrada"
        );

        error.status = 404;

        throw error;
    }

    // OWASP ownership

    if (
        rutina.user.toString() !==
        userId
    ) {

        const error = new Error(
            "No autorizado"
        );

        error.status = 403;

        throw error;
    }

    await rutina.deleteOne();

    return rutina;
};
