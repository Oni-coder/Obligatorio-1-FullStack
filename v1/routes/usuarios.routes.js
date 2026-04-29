import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { agregarUsuarioSchema } from "../validators/usuarios.validators.js";
import { authorizeRolesMiddleware } from "../middlewares/role.middleware.js";
import { agregarUsuario, cambiarPlan } from "../controllers/usuarios.controller.js";

const router = express.Router({ mergeParams: true });

//Peticiones a /v1/usuarios
router.post('/', validateBodyMiddleware(agregarUsuarioSchema), agregarUsuario);
router.patch("/plan", authorizeRolesMiddleware("user"), cambiarPlan);

export default router;