import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { registerUser, clearError } from "../../features/auth.slice";
import { registerSchema } from "../../validators/auth.validators";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: joiResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async ({ email, password }) => {
    dispatch(clearError());
    const result = await dispatch(registerUser({ email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="auth-field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          placeholder="correo@ejemplo.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <span className="auth-error">{errors.email.message}</span>}
      </div>

      <div className="auth-field">
        <label htmlFor="password">Contraseña</label>
        <div className="auth-input-wrap">
          <input
            id="password"
            type={showPass ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            {...register("password")}
          />
          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setShowPass((v) => !v)}
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <span className="auth-error">{errors.password.message}</span>}
      </div>

      <div className="auth-field">
        <label htmlFor="confirmPassword">Repetir contraseña</label>
        <div className="auth-input-wrap">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setShowConfirm((v) => !v)}
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="auth-error">{errors.confirmPassword.message}</span>
        )}
      </div>

      {error && <p className="auth-error-global">{error}</p>}

      <button
        type="submit"
        className="auth-submit-btn"
        disabled={!isValid || loading}
      >
        {loading ? "Registrando..." : "Crear cuenta"}
      </button>

      <p className="auth-switch">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login">Ingresa aquí</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
