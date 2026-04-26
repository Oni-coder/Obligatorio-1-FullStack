import express from "express";
import { registrarUsuario, loginUsuario } from "../controllers/auth.controller.js";
import {validateBodyMiddleware} from "../middlewares/validateBody.middleware.js";
import { registrarUsuarioSChema } from "../validators/auth.validators.js";     

const router = express.Router({ mergeParams: true });

//Peticiones a /v1/auth
router.post('/register', validateBodyMiddleware(registrarUsuarioSChema ), registrarUsuario);

router.post('/login', loginUsuario);

export default router;