export const agregarRutina = (req, res) => {
    res.json({ message: "Rutina agregada correctamente", rutina: req.body });
}