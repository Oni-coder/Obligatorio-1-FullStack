import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dumbbell, ImageOff, Search, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { fetchEjercicios } from "../features/ejercicios.slice";

const EjercicioCard = ({ ejercicio, rutinaCount }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = ejercicio.descripcion?.length > 80;

  return (
    <div className="ejercicio-card">
      <div className="ejercicio-card-img">
        {ejercicio.imagen ? (
          <img src={ejercicio.imagen} alt={ejercicio.nombre} />
        ) : (
          <div className="ejercicio-card-placeholder">
            <ImageOff size={28} strokeWidth={1.2} color="#c8c9cc" />
          </div>
        )}
        {rutinaCount > 0 && (
          <span className="ej-card-badge">
            <Dumbbell size={9} strokeWidth={2.5} />
            {rutinaCount} {rutinaCount === 1 ? "rutina" : "rutinas"}
          </span>
        )}
      </div>
      <div className="ejercicio-card-body">
        <h4 className="ejercicio-card-nombre">{ejercicio.nombre}</h4>
        {ejercicio.descripcion && (
          <>
            <p className={`ejercicio-card-desc${expanded ? " ejercicio-card-desc--expanded" : ""}`}>
              {ejercicio.descripcion}
            </p>
            {isLong && (
              <button
                className="ej-expand-btn"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? <ChevronUp size={13} strokeWidth={2} /> : <ChevronDown size={13} strokeWidth={2} />}
                {expanded ? "Ver menos" : "Ver más"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const EjerciciosPage = () => {
  const dispatch = useDispatch();
  const { data: ejercicios, loading } = useSelector((s) => s.ejercicios);
  const { data: rutinas } = useSelector((s) => s.rutinas);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchEjercicios());
  }, [dispatch]);

  const usageMap = useMemo(() => {
    const map = {};
    rutinas.forEach((r) => {
      (r.ejercicios || []).forEach((ej) => {
        const id = ej._id ?? ej;
        map[id] = (map[id] || 0) + 1;
      });
    });
    return map;
  }, [rutinas]);

  const filtered = useMemo(() => {
    if (!search.trim()) return ejercicios;
    const q = search.toLowerCase();
    return ejercicios.filter((ej) =>
      ej.nombre.toLowerCase().includes(q) ||
      ej.descripcion?.toLowerCase().includes(q)
    );
  }, [ejercicios, search]);

  const enMisRutinas = useMemo(
    () => ejercicios.filter((ej) => usageMap[ej._id] > 0).length,
    [ejercicios, usageMap]
  );

  return (
    <>
      <Navbar activeTab="ejercicios" />
      <div className="dashboard-content">

        {/* Header */}
        <div className="ejercicios-page-header">
          <div className="ejercicios-page-icon">
            <Dumbbell size={20} strokeWidth={1.8} color="#ffd85f" />
          </div>
          <div>
            <h2 className="ejercicios-page-title">Ejercicios</h2>
            <p className="ejercicios-page-sub">
              {loading ? "Cargando..." : (
                <>
                  <span>{ejercicios.length} disponible{ejercicios.length !== 1 ? "s" : ""}</span>
                  {enMisRutinas > 0 && (
                    <span className="ej-header-rutinas-tag">
                      · {enMisRutinas} en tus rutinas
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Buscador */}
        {!loading && ejercicios.length > 0 && (
          <div className="ej-search-bar">
            <Search size={14} strokeWidth={1.5} color="#898989" />
            <input
              type="text"
              placeholder="Buscar ejercicio por nombre o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <span className="ej-search-count">
                {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="loading-state">Cargando ejercicios...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <strong>{ejercicios.length === 0 ? "Sin ejercicios todavía" : "Sin resultados"}</strong>
            {ejercicios.length === 0 ? "Pronto habrá ejercicios disponibles" : `No se encontró "${search}"`}
          </div>
        ) : (
          <div className="ejercicios-grid">
            {filtered.map((ej) => (
              <EjercicioCard key={ej._id} ejercicio={ej} rutinaCount={usageMap[ej._id] || 0} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EjerciciosPage;
