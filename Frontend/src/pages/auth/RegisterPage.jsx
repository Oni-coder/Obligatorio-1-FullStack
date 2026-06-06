import { Dumbbell } from "lucide-react";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => (
  <div className="auth-page">
    <div className="auth-card">
      <div className="auth-logo">
        <Dumbbell size={22} strokeWidth={2.2} />
        <span>FitTrack</span>
      </div>
      <h2 className="auth-title">Crear cuenta</h2>
      <p className="auth-subtitle">Comienza a gestionar tus rutinas</p>
      <RegisterForm />
    </div>
  </div>
);

export default RegisterPage;
