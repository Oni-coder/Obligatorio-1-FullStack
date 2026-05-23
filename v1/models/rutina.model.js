import mongoose from "mongoose";

const rutinaSchema = new mongoose.Schema({
  nombre: String,
  duracion: Number,
  nivelDificultad: {
    type: String,
    enum: ["Principiante", "Intermedio", "Avanzado"],
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
  },
  ejercicios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ejercicio",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
});

export default mongoose.model("Rutina", rutinaSchema);
