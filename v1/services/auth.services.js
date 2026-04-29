import Usuario from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registrarUsuarioService = async (usuarioData) => {
    try {
        const usuarioExistente = await Usuario.findOne({ email: usuarioData.email });

        if (usuarioExistente) {
            const error = new Error("El email ya está registrado");
            error.status = 409;
            throw error;
        }

        const nuevoUsuario = new Usuario(usuarioData);

        await nuevoUsuario.save();

        const token = jwt.sign({ id: nuevoUsuario._id, role: nuevoUsuario.role, plan: nuevoUsuario.plan },
            process.env.SECRET_KEY, { expiresIn: "1d" }
        );

        return { token };
        
    } catch (error) {

        if (error.status) {
            throw error;
        }

        const errorRegistro = new Error("Error al registrar usuario");
        errorRegistro.status = 400;
        throw errorRegistro;
    }
};

export const loginUsuarioService = async (email, password) => {
    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            const error = new Error("Usuario o Contraseña incorrecta");
            error.status = 404;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, usuario.password);

        if (!isMatch) {
            const error = new Error("Usuario o Contraseña incorrecta");
            error.status = 401;
            throw error;
        }

        const token = jwt.sign({ id: usuario._id, role: usuario.role, plan: usuario.plan },
            process.env.SECRET_KEY, { expiresIn: "1d"}
        );

        return { token };

    } catch (error) {

        if (error.status) {
            throw error;
        }

        const errorLogin = new Error("Error al iniciar sesión");
        errorLogin.status = 500;
        throw errorLogin;
    }
};
