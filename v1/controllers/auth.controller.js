import jwt from "jsonwebtoken";

export const registrarUsuario = (req, res) => {
    res.json({ message: "Registro de usuario exitoso", usuario: req.body });
}

export const loginUsuario = (req, res) => {
    const { username } = req.body;
    const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: "1d" });

    res.json({ message: "Inicio de sesión exitoso", usuario: req.body, token });
}