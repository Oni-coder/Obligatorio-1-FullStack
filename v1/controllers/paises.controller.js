export const obtenerPaises = (req, res) => {// /paises
    res.status(200);
    res.json({ mensaje: "GET en /paises" })
}

export const agregarPais = (req, res) => {
    console.log(req.body);
    if (!req.body) {
        return res.status(400).json({ mensaje: "No hay datos" })
    }

    res.status(200).json(req.body);

}