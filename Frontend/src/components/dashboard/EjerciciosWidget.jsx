import { useSelector } from "react-redux";
import { Flame } from "lucide-react";

const EjerciciosWidget = () => {
  const { data: rutinas } = useSelector((s) => s.rutinas);

  const frecuencia = {};
  rutinas.forEach((r) => {
    (r.ejercicios || []).forEach((ej) => {
      const id = ej._id ?? ej;
      const nombre = ej.nombre ?? null;
      if (!nombre) return;
      if (!frecuencia[id]) frecuencia[id] = { nombre, count: 0 };
      frecuencia[id].count += 1;
    });
  });

  const ranking = Object.values(frecuencia)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const max = ranking[0]?.count || 1;

  return (
    <div className="card card-dark">
      <div className="card-header-dark">
        <h3 className="card-title-dark">Más frecuentes</h3>
        <span className="badge-yellow">{ranking.length}</span>
      </div>
      <p className="card-subtitle-dark">ejercicios que más repetís</p>

      <div className="freq-list">
        {ranking.length === 0 ? (
          <p className="empty-dark">Asociá ejercicios a tus rutinas para ver tus favoritos</p>
        ) : (
          ranking.map((ej, i) => (
            <div key={ej.nombre} className="freq-item">
              <div className="freq-item-top">
                <div className="freq-item-left">
                  <span className="freq-rank">#{i + 1}</span>
                  <span className="freq-nombre">{ej.nombre}</span>
                </div>
                <span className="freq-count">
                  <Flame size={10} strokeWidth={2} color="#ffd85f" />
                  {ej.count} {ej.count === 1 ? "rutina" : "rutinas"}
                </span>
              </div>
              <div className="freq-bar-track">
                <div
                  className="freq-bar-fill"
                  style={{ width: `${(ej.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EjerciciosWidget;
