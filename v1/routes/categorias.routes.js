import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { authorizeRolesMiddleware } from "../middlewares/role.middleware.js";
import {
  agregarCategoriaSchema,
  actualizarCategoriaSchema,
} from "../validators/categorias.validators.js";
import {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categorias.controller.js";
////
const router = express.Router({ mergeParams: true });

router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoria);
router.post("/", authorizeRolesMiddleware("admin"), validateBodyMiddleware(agregarCategoriaSchema), crearCategoria);
router.patch("/:id", authorizeRolesMiddleware("admin"), validateBodyMiddleware(actualizarCategoriaSchema), actualizarCategoria);
router.delete("/:id", authorizeRolesMiddleware("admin"), eliminarCategoria);

export default router;
