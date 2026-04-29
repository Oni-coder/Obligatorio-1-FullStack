import {
  registrarUsuarioService,
  loginUsuarioService,
} from "../services/auth.services.js";

export const registrarUsuario = async (req, res, next) => {
  try {
    const { usuario, token } = await registrarUsuarioService(req.body);

    res.status(201).json({
      message: "Usuario registrado",
      usuario,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginUsuarioService(email, password);

    res.json({
      message: "Usuario logueado",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
