import express from "express";
import { obtenerClimaActual } from "../controllers/clima.controllers.js";

const router = express.Router({ mergeParams: true});

router.get("/", obtenerClimaActual);

export default router;