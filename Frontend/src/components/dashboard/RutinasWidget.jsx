import { ArrowUpRight } from "lucide-react";
import { useSelector } from "react-redux";

const BARS = [
  { key: "Principiante", label: "Pri", style: "" },
  { key: "Intermedio",   label: "Int", style: "bar-fill-yellow" },
  { key: "Avanzado",     label: "Ava", style: "bar-fill-dark" },
];

const RutinasWidget = () => {
  const { data: rutinas } = useSelector((s) => s.rutinas);

  const counts = BARS.map((b) => rutinas.filter((r) => r.nivelDificultad === b.key).length);
  const maxCount = Math.max(...counts, 1);

  const avgDuracion = rutinas.length
    ? Math.round(rutinas.reduce((acc, r) => acc + (r.duracion || 0), 0) / rutinas.length)
    : 0;

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Rutinas</h3>
          <p className="card-subtitle">
            <span className="highlight-text">{avgDuracion} min</span> duración media
          </p>
        </div>
        <button className="card-arrow-btn">
          <ArrowUpRight size={15} strokeWidth={1.5} />
        </button>
      </div>

      <div className="bar-chart">
        {BARS.map((bar, i) => (
          <div key={bar.key} className="bar-item">
            <div className="bar-track">
              <div
                className={`bar-fill ${bar.style}`}
                style={{ height: `${(counts[i] / maxCount) * 100}%` }}
              >
                {counts[i] > 0 && (
                  <span className="bar-label-top">{counts[i]}</span>
                )}
              </div>
            </div>
            <span className="bar-day">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RutinasWidget;
