import Usuario from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registrarUsuarioService = async (usuario) => {
    const passwordHash = bcrypt.hashSync(usuario.password, Number(process.env.SALT_ROUNDS));
    const nuevoUsuario = new Usuario({ ...usuario, password: passwordHash });
    await nuevoUsuario.save();
    const token = jwt.sign({ id: nuevoUsuario._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
    //evitar enviar el usuario, solo prueba
    return { usuario: nuevoUsuario, token };
}

export const loginUsuarioService = async (email, password) => {
    const usuario = await Usuario.findOne({ email });
    
    if (!usuario) return { message: "Usuario no encontrado" };
    const isMatch = bcrypt.compareSync(password, usuario.password);
    if (!isMatch) return { message: "Contraseña incorrecta" };
    const token = jwt.sign({ id: usuario._id }, process.env.SECRET_KEY, { expiresIn: "1d" });3
    //evitar enviar el usuario, solo prueba
    return { usuario, token };
}