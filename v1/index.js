import express from 'express';
import usuariosRouter from "./routes/usuarios.routes.js";
import authRouter from "./routes/auth.routes.js";
import rutinasRouter from "./routes/rutinas.routes.js";
import { authenticateToken } from './middlewares/authenticate.middleware.js';

const router = express.Router({ mergeParams: true });

//Peticiones a /v1
router.get('/', (req, res) => {
    res.json({ mensaje: "GET en /v1" })
})

//rutas de login y registro de usuarios (auth)
router.use("/auth", authRouter);

//middleware de verificación de token
router.use(authenticateToken);

//Peticiones que lleguen a /v1/paises
router.use("/usuarios", usuariosRouter);
router.use("/rutinas", rutinasRouter);



export default router;