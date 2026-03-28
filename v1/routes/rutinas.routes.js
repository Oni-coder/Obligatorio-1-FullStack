import express from "express";
import { validateBody } from "../middlewares/validateBody.middleware.js";
import { agregarRutinaSchema } from "../validators/rutinas.validators.js";
import { agregarRutina } from "../controllers/rutinas.controller.js";

const router = express.Router({ mergeParams: true });

//Peticiones a /v1/rutinas
router.post('/', validateBody(agregarRutinaSchema), agregarRutina);

export default router;