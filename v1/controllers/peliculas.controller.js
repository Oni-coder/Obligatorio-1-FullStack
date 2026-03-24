let peliculas = [
    { id: 1, titulo: "Matrix" },
    { id: 2, titulo: "La sociedad de la nieve" }
];

export const obtenerPeliculas = (req, res) => {
    res.status(200).json({ peliculas });
}

export const obtenerPelicula = (req, res) => {
    const idPelicula = Number(req.params.id);
    const pelicula = peliculas.find(p => p.id === idPelicula);
    if (!pelicula) {
        return res.status(404).json({ mensaje: "Película no encontrada" });
    }
    res.status(200).json({ pelicula });

    /* if (!pelicula) {
        res.status(404).json({ mensaje: "Película no encontrada" });
    } else {
        res.status(200).json({ pelicula });
    } */
};

export const agregarPelicula = (req, res) => {
    const nuevaPelicula = req.body;
    if (!nuevaPelicula || !nuevaPelicula.titulo || nuevaPelicula.titulo.trim() === "") {
        return res.status(400).json({ mensaje: "Datos inválidos" });
    }

    const peliculaExistente = peliculas.find(p => p.titulo.toLowerCase() === nuevaPelicula.titulo.toLowerCase());
    if (peliculaExistente) {
        return res.status(409).json({ mensaje: "La película ya existe" });
    }
    nuevaPelicula.id = peliculas.length > 0 ? peliculas.at(-1).id + 1 : 1;
    peliculas.push(nuevaPelicula);
    res.status(201).json({ mensaje: "Película agregada", pelicula: nuevaPelicula });
}

export const eliminarPelicula = (req, res) => {
    const idPelicula = Number(req.params.id);

    /* const pelicula = peliculas.find(p => p.id === idPelicula);
    if (!pelicula) {
        return res.status(404).json({ mensaje: "Película no encontrada" });
    }

    peliculas = peliculas.filter(p => p.id !== idPelicula);
    res.status(200).json({ mensaje: "Película eliminada", pelicula }); */


    const index = peliculas.findIndex(p => p.id === idPelicula);
    if (index === -1) {
        return res.status(404).json({ mensaje: "Película no encontrada" });
    }
    const peliculaEliminada = peliculas.splice(index, 1);
    res.status(200).json({ mensaje: "Película eliminada", pelicula: peliculaEliminada[0] });
}

