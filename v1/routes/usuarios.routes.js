import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { agregarUsuarioSchema } from "../validators/usuarios.validators.js";
import { authenticateMiddleware } from "../middlewares/authenticate.middleware.js";
import { authorizeRolesMiddleware } from "../middlewares/role.middleware.js";
import { agregarUsuario, cambiarPlan, obtenerUsuarios } from "../controllers/usuarios.controller.js";

const router = express.Router({ mergeParams: true });

//Peticiones a /v1/usuarios
router.get("/", authenticateMiddleware, authorizeRolesMiddleware("admin"), obtenerUsuarios);
router.post('/', validateBodyMiddleware(agregarUsuarioSchema), agregarUsuario);
router.patch("/plan", authenticateMiddleware, authorizeRolesMiddleware("user"), cambiarPlan);

export default router;