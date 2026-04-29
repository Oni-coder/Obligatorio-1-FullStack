import {
  crearUsuarioService,
  cambiarPlanAPremiumService,
} from "../services/usuarios.services.js";

export const agregarUsuario = async (req, res, next) => {
  try {
    const usuario = await crearUsuarioService(req.body);

    res.status(201).json({
      message: "Usuario creado",
      usuario,
    });
  } catch (error) {
    next(error);
  }
};

export const cambiarPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const usuario = await cambiarPlanAPremiumService(userId);

    res.json({
      message: "Plan actualizado a premium",
      usuario,
    });
  } catch (error) {
    next(error);
  }
};
