export const agregarUsuario = (req, res) => {
    res.json({ message: "Usuario agregado correctamente", usuario: req.body });
}