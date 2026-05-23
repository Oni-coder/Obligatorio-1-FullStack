import { ArrowUpRight, Clock, Flame } from "lucide-react";
import { useSelector } from "react-redux";

const BADGE = {
  Principiante: "badge-green",
  Intermedio:   "badge-yellow",
  Avanzado:     "badge-red",
};

const RutinasRecientes = () => {
  const { data: rutinas, loading, error } = useSelector((s) => s.rutinas);
  const { token } = useSelector((s) => s.auth);
  const recent = rutinas.slice(0, 6);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Mis Rutinas</h3>
          <p className="card-subtitle">actividad reciente</p>
        </div>
        <button className="card-arrow-btn">
          <ArrowUpRight size={15} strokeWidth={1.5} />
        </button>
      </div>

      {!token ? (
        <div className="empty-state">
          <strong>Sin sesión activa</strong>
          Conecta tu token JWT desde la barra superior para ver tus rutinas
        </div>
      ) : loading ? (
        <div className="loading-state">Cargando rutinas...</div>
      ) : error ? (
        <div className="empty-state">
          <strong>No se pudieron cargar las rutinas</strong>
          {error}
        </div>
      ) : recent.length === 0 ? (
        <div className="empty-state">
          <strong>Sin rutinas todavía</strong>
          Crea tu primera rutina desde la API
        </div>
      ) : (
        <div className="rutinas-list">
          {recent.map((rutina) => (
            <div key={rutina._id} className="rutina-item">
              <div className="rutina-item-icon">
                <Flame size={15} strokeWidth={1.5} color="#ffd85f" />
              </div>
              <div className="rutina-item-info">
                <span className="rutina-item-nombre">{rutina.nombre}</span>
                <span className="rutina-item-cat">
                  {rutina.categoria?.nombre || "Sin categoría"}
                </span>
              </div>
              <div className="rutina-item-meta">
                <div className="rutina-duration">
                  <Clock size={11} strokeWidth={1.5} />
                  <span>{rutina.duracion} min</span>
                </div>
                <span className={`difficulty-badge ${BADGE[rutina.nivelDificultad] || ""}`}>
                  {rutina.nivelDificultad}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RutinasRecientes;
