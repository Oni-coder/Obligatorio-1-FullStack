import express from 'express';
import v1Router from "./v1/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send("GET en /");
})

app.use("/v1", v1Router);
/* 
app.route("/celulares")
    .get((req, res) => {
        res.json({mensaje:"GET en /celulares"});
    })
    .delete((req, res) => {
        res.json({mensaje:"DELETE en /celulares"});
    })

app.get("/libros/:desde-:hasta", (req, res) => {
    res.json(req.params);
})

app.get("/peliculas", (req, res) => {
    res.json({mensaje:"GET en /peliculas"})
})

app.get("/peliculas/:idPelicula", (req, res) => {
    res.json({mensaje:"GET en /peliculas", idPeli:req.params.idPelicula})
})

app.get("/peliculas/:idPelicula/comentarios/:idComentario", (req, res) => {
    console.log(req.params);
    res.json(req.params);
})


app.all("/usuarios", (req, res, next) => {
    console.log("ALL en /usuarios");
    next();
})

app.get("/usuarios", (req, res) => {
    res.send("GET en /usuarios con nodemon")
})

app.post("/usuarios", (req, res) => {
    res.json({mensaje:"POST en /usuarios"})
});

app.put("/usuarios", (req, res) => {
    res.json({mensaje:"PUT en /usuarios"})
});

app.patch("/usuarios", (req, res) => {
    res.json({mensaje:"PATCH en /usuarios"})
});

app.delete("/usuarios", (req, res) => {
    res.json({mensaje:"DELETE en /usuarios"})
});
 */
app.use((req, res, next) => {
    res.status(404).json({ mensaje: "No se pudo encontrar!" })
})



export default app;