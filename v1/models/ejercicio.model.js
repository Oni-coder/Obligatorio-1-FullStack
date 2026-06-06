import mongoose from "mongoose";

const ejercicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    imagen: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ejercicio", ejercicioSchema);
