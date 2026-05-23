import { useState } from "react";
import { Tag, ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";

const CategoriasPanel = () => {
  const { data: categorias } = useSelector((s) => s.categorias);
  const { data: rutinas } = useSelector((s) => s.rutinas);
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  const rutinaCount = (catId) =>
    rutinas.filter(
      (r) => r.categoria?._id === catId || r.categoria === catId
    ).length;

  return (
    <div className="card">
      <h3 className="card-title" style={{ marginBottom: 14 }}>Categorias</h3>

      <div className="categorias-list">
        {categorias.length === 0 ? (
          <p className="empty-text">Sin categorias registradas</p>
        ) : (
          categorias.map((cat) => {
            const count = rutinaCount(cat._id);
            const open = expanded === cat._id;
            return (
              <div key={cat._id} className="categoria-item">
                <button className="categoria-header" onClick={() => toggle(cat._id)}>
                  <div className="categoria-title">
                    <Tag size={13} strokeWidth={1.5} color="#898989" />
                    <span>{cat.nombre}</span>
                  </div>
                  <div className="categoria-meta">
                    <span className="categoria-count">{count}</span>
                    {open
                      ? <ChevronUp size={13} strokeWidth={1.5} color="#898989" />
                      : <ChevronDown size={13} strokeWidth={1.5} color="#898989" />
                    }
                  </div>
                </button>
                {open && (
                  <div className="categoria-detail">
                    <p className="categoria-desc">
                      {cat.descripcion || "Sin descripción"}
                    </p>
                    <span className="categoria-rutinas-tag">
                      {count} rutina{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoriasPanel;
