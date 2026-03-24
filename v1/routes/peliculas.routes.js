import express from "express";
import { obtenerPeliculas, 
    obtenerPelicula, 
    agregarPelicula, 
    eliminarPelicula } from "../controllers/peliculas.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", obtenerPeliculas);
router.get("/:id", obtenerPelicula);
router.post("/", agregarPelicula);
router.delete("/:id", eliminarPelicula);

export default router;