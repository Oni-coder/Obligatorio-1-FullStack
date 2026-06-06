import { Dumbbell } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => (
  <div className="auth-page">
    <div className="auth-card">
      <div className="auth-logo">
        <Dumbbell size={22} strokeWidth={2.2} />
        <span>FitTrack</span>
      </div>
      <h2 className="auth-title">Bienvenido de vuelta</h2>
      <p className="auth-subtitle">Ingresa tus datos para continuar</p>
      <LoginForm />
    </div>
  </div>
);

export default LoginPage;
