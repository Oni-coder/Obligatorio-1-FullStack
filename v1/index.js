import express from 'express';
import usuariosRouter from "./routes/usuarios.routes.js";
import authRouter from "./routes/auth.routes.js";
import rutinasRouter from "./routes/rutinas.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import ejerciciosRouter from "./routes/ejercicios.routes.js";
import { authenticateMiddleware } from './middlewares/authenticate.middleware.js';
import uploadsRouter from "./routes/uploads.routes.js";
const router = express.Router({ mergeParams: true });

//Peticiones a /v1
router.get('/', (req, res) => {
    res.json({ mensaje: "GET en /v1" })
})

//rutas de login y registro de usuarios (auth)
router.use("/auth", authRouter);

//middleware de verificación de token
router.use(authenticateMiddleware);

//Peticiones que lleguen a /v1/
router.use("/usuarios", usuariosRouter);
router.use("/rutinas", rutinasRouter);
router.use("/categorias", categoriasRouter);
router.use("/ejercicios", ejerciciosRouter);
router.use("/uploads", uploadsRouter)
//Ruta para verificar que el token es válido

export default router;