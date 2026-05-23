import { Dumbbell, ListChecks, Tag } from "lucide-react";
import { useSelector } from "react-redux";

const WelcomeSection = () => {
  const { user } = useSelector((s) => s.auth);
  const { data: rutinas, total: totalRutinas } = useSelector((s) => s.rutinas);
  const { data: ejercicios } = useSelector((s) => s.ejercicios);
  const { data: categorias } = useSelector((s) => s.categorias);

  const total = rutinas.length || 1;
  const principiante = rutinas.filter((r) => r.nivelDificultad === "Principiante").length;
  const intermedio   = rutinas.filter((r) => r.nivelDificultad === "Intermedio").length;
  const avanzado     = rutinas.filter((r) => r.nivelDificultad === "Avanzado").length;

  const nombre = user?.email?.split("@")[0] || "Atleta";

  return (
    <div className="welcome-section">
      <div className="welcome-left">
        <h1 className="welcome-title">Bienvenido, {nombre}</h1>
        <div className="stats-bars">
          <div className="stat-bar-item">
            <span className="stat-bar-label">Principiante</span>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill yellow"
                style={{ width: `${(principiante / total) * 100}%` }}
              />
            </div>
            <span className="stat-bar-pct">{Math.round((principiante / total) * 100)}%</span>
          </div>
          <div className="stat-bar-item">
            <span className="stat-bar-label">Intermedio</span>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill dark"
                style={{ width: `${(intermedio / total) * 100}%` }}
              />
            </div>
            <span className="stat-bar-pct">{Math.round((intermedio / total) * 100)}%</span>
          </div>
          <div className="stat-bar-item">
            <span className="stat-bar-label">Avanzado</span>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill gray"
                style={{ width: `${(avanzado / total) * 100}%` }}
              />
            </div>
            <span className="stat-bar-pct">{Math.round((avanzado / total) * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="welcome-stats">
        <div className="welcome-stat">
          <Dumbbell size={14} strokeWidth={1.5} className="welcome-stat-icon" />
          <span className="welcome-stat-number">{ejercicios.length}</span>
          <span className="welcome-stat-label">Ejercicios</span>
        </div>
        <div className="welcome-stat">
          <ListChecks size={14} strokeWidth={1.5} className="welcome-stat-icon" />
          <span className="welcome-stat-number">{totalRutinas}</span>
          <span className="welcome-stat-label">Rutinas</span>
        </div>
        <div className="welcome-stat">
          <Tag size={14} strokeWidth={1.5} className="welcome-stat-icon" />
          <span className="welcome-stat-number">{categorias.length}</span>
          <span className="welcome-stat-label">Categorias</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
