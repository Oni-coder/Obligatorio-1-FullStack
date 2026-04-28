import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { agregarRutinaSchema } from "../validators/rutinas.validators.js";
import {
    obtenerRutinas,
    obtenerRutina,
    crearRutina,
    actualizarRutina,
    eliminarRutina,
    obtenerEjerciciosParaMusculo
} from "../controllers/rutinas.controller.js";

const router = express.Router({ mergeParams: true });
router.get("/musculos/:musculo", obtenerEjerciciosParaMusculo);
router.get("/", obtenerRutinas);
router.get("/:id", obtenerRutina);
//router.get("/:min/:max", obtenerRutinasPorRangoPrecio);
router.post("/", validateBodyMiddleware(agregarRutinaSchema), crearRutina);
router.patch("/:id", validateBodyMiddleware(agregarRutinaSchema), actualizarRutina);
router.delete("/:id", eliminarRutina);

// import axios from "axios";

// router.get("/ejercicios", async (req, res) => {
//   try {
//     const ejerciciosRes = await axios.get(
//       "https://wger.de/api/v2/exercise/?language=2"
//     );

//     const musculosRes = await axios.get(
//       "https://wger.de/api/v2/muscle/"
//     );

//     const musculosMap = {};
//     musculosRes.data.results.forEach(m => {
//       musculosMap[m.id] = m.name;
//     });

//     const ejercicios = ejerciciosRes.data.results.map(ej => ({
//       ...ej,
//       muscles_names: ej.muscles.map(id => musculosMap[id])
//     }));

//     res.json(ejercicios);
//   } catch (error) {
//     res.status(500).json({ error: "Error" });
//   }
// });
export default router;