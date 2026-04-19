import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { usuarios } from "../data/usuarios.data.js";
const ROUNDS = 12;


export const registrarUsuario = (req, res) => {
    const { username, password } = req.body;
    const usuarioExistente = usuarios.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (usuarioExistente) {
        return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
    }

    let hashedPassword = bcrypt.hashSync(password, ROUNDS);
    usuarios.push({ username, password: hashedPassword });

    const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: "1d" });

    res.json({ message: "Registro de usuario exitoso", token });
}

export const loginUsuario = (req, res) => {
    const { username, password } = req.body;
    const usuario = usuarios.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!usuario) {
        return res.status(401).json({ message: "Credenciales inválidas" });
    }
    let valid = bcrypt.compareSync(password, usuario.password);
    if (!valid) {
        return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: "1d" });

    res.json({ message: "Inicio de sesión exitoso", token });
}