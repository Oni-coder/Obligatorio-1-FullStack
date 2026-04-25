import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { agregarRutinaSchema } from "../validators/rutinas.validators.js";
import {
    obtenerRutinas,
    obtenerRutina,
    crearRutina,
    actualizarRutina,
    eliminarRutina
} from "../controllers/rutinas.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", obtenerRutinas);
router.get("/:id", obtenerRutina);
//router.get("/:min/:max", obtenerRutinasPorRangoPrecio);
router.post("/", validateBodyMiddleware(agregarRutinaSchema), crearRutina);
router.patch("/:id", validateBodyMiddleware(agregarRutinaSchema), actualizarRutina);
router.delete("/:id", eliminarRutina);

export default router;