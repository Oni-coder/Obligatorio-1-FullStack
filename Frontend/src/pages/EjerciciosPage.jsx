import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dumbbell, ImageOff } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { fetchEjercicios } from "../features/ejercicios.slice";

const EjercicioCard = ({ ejercicio }) => (
  <div className="ejercicio-card">
    <div className="ejercicio-card-img">
      {ejercicio.imagen ? (
        <img src={ejercicio.imagen} alt={ejercicio.nombre} />
      ) : (
        <div className="ejercicio-card-placeholder">
          <ImageOff size={28} strokeWidth={1.2} color="#c8c9cc" />
        </div>
      )}
    </div>
    <div className="ejercicio-card-body">
      <h4 className="ejercicio-card-nombre">{ejercicio.nombre}</h4>
      {ejercicio.descripcion && (
        <p className="ejercicio-card-desc">{ejercicio.descripcion}</p>
      )}
    </div>
  </div>
);

const EjerciciosPage = () => {
  const dispatch = useDispatch();
  const { data: ejercicios, loading } = useSelector((s) => s.ejercicios);

  useEffect(() => {
    dispatch(fetchEjercicios());
  }, [dispatch]);

  return (
    <>
      <Navbar activeTab="ejercicios" />
      <div className="dashboard-content">
        <div className="ejercicios-page-header">
          <div className="ejercicios-page-icon">
            <Dumbbell size={20} strokeWidth={1.8} color="#ffd85f" />
          </div>
          <div>
            <h2 className="ejercicios-page-title">Ejercicios</h2>
            <p className="ejercicios-page-sub">
              {loading ? "Cargando..." : `${ejercicios.length} ejercicio${ejercicios.length !== 1 ? "s" : ""} disponible${ejercicios.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Cargando ejercicios...</div>
        ) : ejercicios.length === 0 ? (
          <div className="empty-state">
            <strong>Sin ejercicios todavía</strong>
            Pronto habrá ejercicios disponibles
          </div>
        ) : (
          <div className="ejercicios-grid">
            {ejercicios.map((ej) => (
              <EjercicioCard key={ej._id} ejercicio={ej} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EjerciciosPage;
