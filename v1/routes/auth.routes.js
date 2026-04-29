import express from "express";
import { registrarUsuario, loginUsuario } from "../controllers/auth.controller.js";
import {validateBodyMiddleware} from "../middlewares/validateBody.middleware.js";
import { registrarUsuarioSchema, loginSchema } from "../validators/auth.validators.js";

const router = express.Router({ mergeParams: true });

//Peticiones a /v1/auth
router.post('/register', validateBodyMiddleware(registrarUsuarioSchema), registrarUsuario);
router.post('/login', validateBodyMiddleware(loginSchema), loginUsuario);

export default router;