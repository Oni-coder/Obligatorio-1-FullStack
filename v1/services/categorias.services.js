import Categoria from "../models/categoria.model.js";
import { isValidObjectId } from "mongoose";

export const obtenerCategoriasService = async () => {
  const categorias = await Categoria.find();
  return categorias;
};

export const buscarCategoriaPorIdService = async (id) => {
  if (!isValidObjectId(id)) {
    const error = new Error("Id no válido");
    error.status = 400;
    error.details = { id };
    throw error;
  }

  const categoria = await Categoria.findById(id);

  if (!categoria) {
    const error = new Error("Categoría no encontrada");
    error.status = 404;
    error.details = { id };
    throw error;
  }

  return categoria;
};

export const crearCategoriaService = async (data) => {
  const categoriaExistente = await Categoria.findOne({ nombre: data.nombre });

  if (categoriaExistente) {
    const error = new Error("Ya existe una categoría con ese nombre");
    error.status = 409;
    error.details = { nombre: data.nombre };
    throw error;
  }

  try {
    const nuevaCategoria = new Categoria(data);
    await nuevaCategoria.save();
    return nuevaCategoria;
  } catch (error) {
    if (error.status) throw error;
    const errorCreacion = new Error("Error al crear la categoría");
    errorCreacion.status = 400;
    throw errorCreacion;
  }
};

export const actualizarCategoriaService = async (id, data) => {
  if (!isValidObjectId(id)) {
    const error = new Error("Id no válido");
    error.status = 400;
    error.details = { id };
    throw error;
  }

  const categoria = await Categoria.findById(id);

  if (!categoria) {
    const error = new Error("Categoría no encontrada");
    error.status = 404;
    error.details = { id };
    throw error;
  }

  if (data.nombre && data.nombre !== categoria.nombre) {
    const categoriaExistente = await Categoria.findOne({ nombre: data.nombre });
    if (categoriaExistente) {
      const error = new Error("Ya existe una categoría con ese nombre");
      error.status = 409;
      error.details = { nombre: data.nombre };
      throw error;
    }
  }

  categoria.nombre = data.nombre ?? categoria.nombre;
  categoria.descripcion = data.descripcion ?? categoria.descripcion;

  await categoria.save();
  return categoria;
};

export const eliminarCategoriaService = async (id) => {
  if (!isValidObjectId(id)) {
    const error = new Error("Id no válido");
    error.status = 400;
    error.details = { id };
    throw error;
  }

  const categoria = await Categoria.findById(id);

  if (!categoria) {
    const error = new Error("Categoría no encontrada");
    error.status = 404;
    error.details = { id };
    throw error;
  }

  await categoria.deleteOne();
  return categoria;
};
