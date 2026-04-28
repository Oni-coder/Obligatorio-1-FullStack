import Rutina from "../models/rutina.model.js";
import Usuario from "../models/usuario.model.js";
import { isValidObjectId } from "mongoose";
import axios from "axios";

export const obtenerEjerciciosParaMusculoService = async (musculo) => {
    const API_KEY = process.env.API_NINJAS_KEY;
    const ENDPOINT = `https://api.api-ninjas.com/v1/exercises?muscle=${musculo}`;

    const headers = {
        'Content-Type': 'application/json',
        'X-Api-Key': API_KEY
    };
    
    axios.get(ENDPOINT, { headers })
        .then(response => {
            res.json({message: 'Lista de ejercicios para el músculo ' + musculo,
                data: response.data});
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener ejercicios' });
        });
};

export const obtenerRutinasService = async () => {
  const rutinas = await Rutina.find();
  return rutinas;
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

export const obtenerRutinasPorRangoPrecioService = async (min, max) => {
  const rutinas = await Rutina.find({ precio: { $gte: min, $lte: max } });
  return rutinas;
};
