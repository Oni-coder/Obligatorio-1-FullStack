import express from "express";
import { validateBody } from "../middlewares/validateBody.middleware.js";
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
router.post("/", validateBody(agregarRutinaSchema), crearRutina);
router.patch("/:id", validateBody(agregarRutinaSchema), actualizarRutina);
router.delete("/:id", eliminarRutina);

export default router;