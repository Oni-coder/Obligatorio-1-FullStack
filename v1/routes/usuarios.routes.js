import express from "express";
import { validateBody } from "../middlewares/validateBody.middleware.js";
import { agregarUsuarioSchema } from "../validators/usuarios.validators.js";
import { agregarUsuario } from "../controllers/usuarios.controller.js";

const router = express.Router({ mergeParams: true });

//Peticiones a /v1/usuarios
router.post('/', validateBody(agregarUsuarioSchema), agregarUsuario);

export default router;