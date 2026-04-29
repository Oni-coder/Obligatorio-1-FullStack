import {
  obtenerCategoriasService,
  buscarCategoriaPorIdService,
  crearCategoriaService,
  actualizarCategoriaService,
  eliminarCategoriaService,
} from "../services/categorias.services.js";

export const obtenerCategorias = async (req, res, next) => {
  try {
    const categorias = await obtenerCategoriasService();

    res.json({
      message: "Categorías obtenidas",
      categorias,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoria = await buscarCategoriaPorIdService(id);

    res.json({
      message: `Obtener categoría con ID ${id}`,
      categoria,
    });
  } catch (error) {
    next(error);
  }
};

export const crearCategoria = async (req, res, next) => {
  try {
    const categoriaCreada = await crearCategoriaService(req.body);

    res.status(201).json({
      message: "Categoría creada",
      categoria: categoriaCreada,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoriaModificada = await actualizarCategoriaService(id, req.body);

    res.json({
      message: "Categoría actualizada",
      categoria: categoriaModificada,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoriaEliminada = await eliminarCategoriaService(id);

    res.json({
      message: "Categoría eliminada",
      categoria: categoriaEliminada,
    });
  } catch (error) {
    next(error);
  }
};
