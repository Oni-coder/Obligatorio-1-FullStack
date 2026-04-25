import mongoose from "mongoose";

const rutinaSchema = new mongoose.Schema({
    nombre: String,
    duracion: Number,
    nivelDificultad: {
        type: String,
        enum: ["Principiante", "Intermedio", "Avanzado"]
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }
});

export default mongoose.model("Rutina", rutinaSchema);