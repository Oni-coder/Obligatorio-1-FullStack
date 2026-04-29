import Rutina from "../models/rutina.model.js";
import Usuario from "../models/usuario.model.js";
import { isValidObjectId } from "mongoose";
import axios from "axios";
import { traducirYResumirEjerciciosService } from "./ai.services.js";

export const obtenerEjerciciosParaMusculoService = async (musculo) => {
    try {

        const API_KEY = process.env.API_NINJAS_KEY;

        const ENDPOINT = `https://api.api-ninjas.com/v1/exercises?muscle=${musculo}`;

        const headers = {
            "Content-Type": "application/json",
            "X-Api-Key": API_KEY
        };

        const response = await axios.get(ENDPOINT, { headers });

        const ejercicios = response.data;

        const ejerciciosTraducidos =
            await traducirYResumirEjerciciosService(ejercicios);

        return ejerciciosTraducidos;

    } catch (error) {

        console.error(error);

        const errorApi = new Error("Error al obtener ejercicios");
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
    limit
}) => {

    // VALIDACIONES

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || pageNumber < 1) {

        const error = new Error(
            "Page debe ser un número mayor a 0"
        );

        error.status = 400;

        throw error;
    }

    if (isNaN(limitNumber) || limitNumber < 1) {

        const error = new Error(
            "Limit debe ser un número mayor a 0"
        );

        error.status = 400;

        throw error;
    }

    if (
        duracionMin &&
        isNaN(Number(duracionMin))
    ) {

        const error = new Error(
            "duracionMin debe ser numérico"
        );

        error.status = 400;

        throw error;
    }

    if (
        duracionMax &&
        isNaN(Number(duracionMax))
    ) {

        const error = new Error(
            "duracionMax debe ser numérico"
        );

        error.status = 400;

        throw error;
    }

    const nivelesValidos = [
        "Principiante",
        "Intermedio",
        "Avanzado"
    ];

    if (
        nivelDificultad &&
        !nivelesValidos.includes(nivelDificultad)
    ) {

        const error = new Error(
            "Nivel de dificultad inválido"
        );

        error.status = 400;

        throw error;
    }

    // FILTROS

    const filtros = {};

    if (nombre) {

        filtros.nombre = {
            $regex: nombre,
            $options: "i"
        };
    }

    if (nivelDificultad) {

        filtros.nivelDificultad =
            nivelDificultad;
    }

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

    const skip =
        (pageNumber - 1) * limitNumber;

    const rutinas =
        await Rutina.find(filtros)
            .skip(skip)
            .limit(limitNumber)
            .populate("user", "email plan");

    const total =
        await Rutina.countDocuments(filtros);

    return {

        total,

        page: pageNumber,

        limit: limitNumber,

        totalPages:
            Math.ceil(total / limitNumber),

        data: rutinas
    };
};

export const buscarRutinaPorIdService = async (id) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("Id no válido");
    errorId.status = 400;
    errorId.details = { id };
    throw errorId;
  }

  const rutina = await Rutina.findById(id);

  if (!rutina) {
    const errorId = new Error("Rutina no encontrada");
    errorId.status = 404;
    errorId.details = { id };
    throw errorId;
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

export const actualizarRutinaService = async (id, rutina) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("Id no válido");
    errorId.status = 400;
    errorId.details = { id };
    throw errorId;
  }

  const rutinaActualizada = await Rutina.findByIdAndUpdate(id, rutina, {
    returnDocument: "after",
  });

  if (!rutinaActualizada) {
    const errorId = new Error("Rutina no encontrada");
    errorId.status = 404;
    errorId.details = { id };
    throw errorId;
  }

  return rutinaActualizada;
};

export const eliminarRutinaService = async (id) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("Id no válido");
    errorId.status = 400;
    errorId.details = { id };
    throw errorId;
  }

  const rutinaEliminada = await Rutina.findByIdAndDelete(id);

  if (!rutinaEliminada) {
    const errorId = new Error("Rutina no encontrada");
    errorId.status = 404;
    errorId.details = { id };
    throw errorId;
  }

  return rutinaEliminada;
};
