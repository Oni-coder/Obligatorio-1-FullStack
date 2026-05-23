import { Check, Circle } from "lucide-react";
import { useSelector } from "react-redux";

const EjerciciosWidget = () => {
  const { data: ejercicios } = useSelector((s) => s.ejercicios);
  const displayed = ejercicios.slice(0, 5);

  return (
    <div className="card card-dark">
      <div className="card-header-dark">
        <h3 className="card-title-dark">Ejercicios</h3>
        <span className="badge-yellow">{ejercicios.length}</span>
      </div>
      <p className="card-subtitle-dark">total registrados</p>

      <div className="ejercicios-list">
        {displayed.length === 0 ? (
          <p className="empty-dark">Sin ejercicios cargados</p>
        ) : (
          displayed.map((ej, i) => (
            <div key={ej._id} className="ejercicio-item">
              <div className="ejercicio-icon">
                {i < 2
                  ? <Check size={11} strokeWidth={2.5} color="#ffd85f" />
                  : <Circle size={9} strokeWidth={1.5} color="#898989" />
                }
              </div>
              <div className="ejercicio-info">
                <span className="ejercicio-nombre">{ej.nombre}</span>
                {ej.descripcion && (
                  <span className="ejercicio-desc">
                    {ej.descripcion.length > 32
                      ? ej.descripcion.slice(0, 32) + "..."
                      : ej.descripcion}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EjerciciosWidget;
