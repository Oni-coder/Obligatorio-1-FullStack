import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },


    role: {
        type: String,
        enum: ["user", "admin"], 
        default: "user"
    },

    plan: {
        type: String,
        enum: ["plus", "premium"],
        default: "plus"
    }

}, {
    timestamps: true 
});

export default mongoose.model("Usuario", usuarioSchema);