import { ArrowUpRight } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.raw} rutina${ctx.raw !== 1 ? "s" : ""}`,
      },
      bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
        color: "#898989",
      },
    },
    y: {
      display: false,
      beginAtZero: true,
    },
  },
};

const RutinasWidget = () => {
  const { data: rutinas } = useSelector((s) => s.rutinas);

  const counts = {
    Principiante: rutinas.filter((r) => r.nivelDificultad === "Principiante").length,
    Intermedio: rutinas.filter((r) => r.nivelDificultad === "Intermedio").length,
    Avanzado: rutinas.filter((r) => r.nivelDificultad === "Avanzado").length,
  };

  const avgDuracion = rutinas.length
    ? Math.round(rutinas.reduce((acc, r) => acc + (r.duracion || 0), 0) / rutinas.length)
    : 0;

  const chartData = {
    labels: ["Principiante", "Intermedio", "Avanzado"],
    datasets: [
      {
        data: [counts.Principiante, counts.Intermedio, counts.Avanzado],
        backgroundColor: ["#e3e4e8", "#ffd85f", "#303030"],
        borderRadius: 7,
        borderSkipped: false,
      },
    ],
  };

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
      <div style={{ height: 130 }}>
        <Bar data={chartData} options={OPTIONS} />
      </div>
    </div>
  );
};

export default RutinasWidget;
