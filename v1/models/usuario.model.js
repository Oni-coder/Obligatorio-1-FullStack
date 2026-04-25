import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

usuarioSchema.pre("save", function(){
        if (!this.isModified("password")) return;
        const passwordHash = bcrypt.hashSync(this.password, Number(process.env.SALT_ROUNDS));
        this.password = passwordHash;
});

export default mongoose.model("Usuario", usuarioSchema);