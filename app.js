import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import v1Router from "./v1/index.js";
import { notFoundMiddleware } from "./v1/middlewares/notFound.middleware.js";
import connectDB from "./v1/config/db.config.js";
import { errorMiddleware } from "./v1/middlewares/error.middleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors(/* {
    origin: "http://localhost:5500",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
} */));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const limiter = rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minuto
//     max: 4, // máximo 4 requests por IP
//     message: 'Demasiadas solicitudes desde esta IP, intenta más tarde',
// });
// app.use(limiter);

app.get("/", (req, res) => {
    res.send("¡Respuesta desde el servidor a la raiz!");
})

app.use("/v1", v1Router);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;