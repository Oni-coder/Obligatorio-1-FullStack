import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginUser, clearError } from "../../features/auth.slice";
import { loginSchema } from "../../validators/auth.validators";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: joiResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    dispatch(clearError());
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user?.role;
      navigate(role === "admin" ? "/admin" : "/dashboard");
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
            placeholder="Tu contraseña"
            autoComplete="current-password"
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

      {error && <p className="auth-error-global">{error}</p>}

      <button
        type="submit"
        className="auth-submit-btn"
        disabled={!isValid || loading}
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

      <p className="auth-switch">
        ¿No tienes cuenta?{" "}
        <Link to="/register">Regístrate aquí</Link>
      </p>
    </form>
  );
};

export default LoginForm;
