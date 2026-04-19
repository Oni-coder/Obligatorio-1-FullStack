import mongoose from "mongoose"

const mascotaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ["perro", "gato"]
    },
    edad: {
        type: Number,
        required: false
    },
    vacunado: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model("Mascota", mascotaSchema);
