import express from 'express';
import usuariosRouter from "./routes/usuarios.routes.js";
import authRouter from "./routes/auth.routes.js";
import rutinasRouter from "./routes/rutinas.routes.js";
import { authenticateMiddleware } from './middlewares/authenticate.middleware.js';
import aiRouter from "./routes/ai.routes.js";
import uploadsRouter from "./routes/uploads.routes.js";
const router = express.Router({ mergeParams: true });

//Peticiones a /v1
router.get('/', (req, res) => {
    res.json({ mensaje: "GET en /v1" })
})

//rutas de login y registro de usuarios (auth)
router.use("/auth", authRouter);
router.use("/ai", aiRouter);
router.use("/uploads", uploadsRouter)


//middleware de verificación de token
router.use(authenticateMiddleware);

//Peticiones que lleguen a /v1/paises
router.use("/usuarios", usuariosRouter);
router.use("/rutinas", rutinasRouter);



export default router;