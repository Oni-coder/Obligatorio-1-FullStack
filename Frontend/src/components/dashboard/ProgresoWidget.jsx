import { useState } from "react";
import { ArrowUpRight, Play, Pause, Timer } from "lucide-react";
import { useSelector } from "react-redux";

const R = 50;
const CIRCUMFERENCE = 2 * Math.PI * R;

const ProgresoWidget = () => {
  const { data: rutinas } = useSelector((s) => s.rutinas);
  const [playing, setPlaying] = useState(false);

  const avgDuracion = rutinas.length
    ? Math.round(rutinas.reduce((acc, r) => acc + (r.duracion || 0), 0) / rutinas.length)
    : 0;

  const percent = Math.min((avgDuracion / 180) * 100, 100);
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
  const mins = String(Math.floor(avgDuracion)).padStart(2, "0");

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Duración</h3>
          <p className="card-subtitle">promedio de rutinas</p>
        </div>
        <button className="card-arrow-btn">
          <ArrowUpRight size={15} strokeWidth={1.5} />
        </button>
      </div>

      <div className="circular-progress">
        <svg width={130} height={130} viewBox="0 0 130 130">
          <circle
            cx={65} cy={65} r={R}
            fill="none"
            stroke="#e3e4e8"
            strokeWidth={8}
          />
          <circle
            cx={65} cy={65} r={R}
            fill="none"
            stroke="#ffd85f"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 65 65)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="circular-center">
          <span className="circular-time">{mins}:00</span>
          <span className="circular-label">min promedio</span>
        </div>
      </div>

      <div className="circular-controls">
        <button className="control-btn" onClick={() => setPlaying((v) => !v)}>
          {playing
            ? <Pause size={15} strokeWidth={2} />
            : <Play size={15} strokeWidth={2} />
          }
        </button>
        <button className="control-btn-secondary">
          <Timer size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default ProgresoWidget;
