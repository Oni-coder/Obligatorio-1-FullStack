import express from 'express';
import paisesRouter from "./routes/paises.routes.js";
import peliculasRouter from "./routes/peliculas.routes.js";

const router = express.Router({ mergeParams: true });

//Peticiones a /v1
router.get('/', (req, res) => {
    res.json({ mensaje: "GET en /v1" })
})

//Peticiones que lleguen a /v1/paises
router.use("/paises", paisesRouter);
router.use("/peliculas", peliculasRouter);



export default router;