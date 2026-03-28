import express from 'express';
import v1Router from "./v1/index.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send("GET en /");
})

app.use("/v1", v1Router);

app.use((req, res, next) => {
    res.status(404).json({ mensaje: "No se pudo encontrar!" })
})



export default app;