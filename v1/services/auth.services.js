import Usuario from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registrarUsuarioService = async (usuario) => {
    const nuevoUsuario = new Usuario(usuario);
    await nuevoUsuario.save();
    const token = jwt.sign({ id: nuevoUsuario._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return { token };
}

export const loginUsuarioService = async (email, password) => {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) return { message: "Usuario no encontrado" };
    const isMatch = bcrypt.compareSync(password, usuario.password);
    if (!isMatch) return { message: "Contraseña incorrecta" };
    const token = jwt.sign({ id: usuario._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return { token };
}