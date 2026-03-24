import express from "express";
import { obtenerPaises, agregarPais } from "../controllers/paises.controller.js";

const router = express.Router({ mergeParams: true });

//GET en /v1/paises
router.get("/", obtenerPaises);

router.post("/", agregarPais);

router.patch("/", (req, res) => {
    res.json({ mensaje: "PATCH en /paises" })
})

router.delete("/:id", (req, res) => {
    res.json({ mensaje: "DELETE en /paises" })
})

//GET en /v1/paises/ciudades
router.get("/ciudades", (req, res) => {
    res.json({ mensaje: "GET en /v1/paises/ciudades" })
})



export default router;

/* router.route("/")
    .get((req, res) => {
        res.json({ mensaje: "GET en /v1/paises" })
    })
    .post((req, res) => {
        res.json({ mensaje: "POST en /v1/paises" })
    })
    .patch((req, res) => {
        res.json({ mensaje: "PATCH en /v1/paises" })
    })
    .delete((req, res) => {
        res.json({ mensaje: "DELETE en /v1/paises" })
    }) */