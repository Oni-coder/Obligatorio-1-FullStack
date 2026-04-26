
import { crearUsuarioService } from "../services/usuarios.services.js";
import { cambiarPlanAPremiumService} from "../services/usuarios.services.js";

export const agregarUsuario = async (req, res) => {
    const usuario = await crearUsuarioService(req.body);
    res.json({ message: "Usuario creado", usuario });
};

export const cambiarPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const usuario = await cambiarPlanAPremiumService(userId);

        res.json({ message: "Plan actualizado a premium", usuario });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};