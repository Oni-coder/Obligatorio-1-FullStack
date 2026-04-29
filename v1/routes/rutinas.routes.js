import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { validateQueryMiddleware } from "../middlewares/validateQuery.middleware.js";
import { agregarRutinaSchema,obtenerRutinasSchema } from "../validators/rutinas.validators.js";

import {
    obtenerRutinas,
    obtenerRutina,
    crearRutina,
    actualizarRutina,
    eliminarRutina,
    obtenerEjerciciosParaMusculo
} from "../controllers/rutinas.controller.js";

const router = express.Router({ mergeParams: true });
router.get("/musculos/:musculo", obtenerEjerciciosParaMusculo);
router.get("/", validateQueryMiddleware(obtenerRutinasSchema), obtenerRutinas);
router.get("/:id", obtenerRutina);
router.post("/", validateBodyMiddleware(agregarRutinaSchema), crearRutina);
router.patch("/:id", validateBodyMiddleware(agregarRutinaSchema), actualizarRutina);
router.delete("/:id", eliminarRutina);

export default router;