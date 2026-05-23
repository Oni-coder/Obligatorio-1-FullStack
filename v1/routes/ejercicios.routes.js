import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { authorizeRolesMiddleware } from "../middlewares/role.middleware.js";
import {
  agregarEjercicioSchema,
  actualizarEjercicioSchema,
} from "../validators/ejercicios.validators.js";
import {
  obtenerEjercicios,
  obtenerEjercicio,
  crearEjercicio,
  actualizarEjercicio,
  eliminarEjercicio,
} from "../controllers/ejercicios.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", obtenerEjercicios);
router.get("/:id", obtenerEjercicio);
router.post("/", authorizeRolesMiddleware("admin"), validateBodyMiddleware(agregarEjercicioSchema), crearEjercicio);
router.patch("/:id", authorizeRolesMiddleware("admin"), validateBodyMiddleware(actualizarEjercicioSchema), actualizarEjercicio);
router.delete("/:id", authorizeRolesMiddleware("admin"), eliminarEjercicio);

export default router;
