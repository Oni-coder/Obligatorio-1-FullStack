import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { toast } from "react-toastify";
import {
  Plus, Flame, Clock, Pencil, Trash2, Check, X,
  Search, SlidersHorizontal, ChevronDown, ChevronUp, ImageOff,
} from "lucide-react";
import { fetchRutinas, createRutina, updateRutina, deleteRutina } from "../../features/rutinas.slice";
import { fetchCategorias } from "../../features/categorias.slice";
import { rutinaSchema } from "../../validators/rutinas.validators";

const BADGE = {
  Principiante: "badge-green",
  Intermedio: "badge-yellow",
  Avanzado: "badge-red",
};

/* ── Formulario de alta ─────────────────────────────── */
const AddForm = ({ categorias, ejercicios, onCancel }) => {
  const dispatch = useDispatch();
  const [selectedEjercicios, setSelectedEjercicios] = useState([]);
  const [showEjPicker, setShowEjPicker] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ resolver: joiResolver(rutinaSchema), mode: "onChange" });

  const toggleEjercicio = (id) => {
    setSelectedEjercicios((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data) => {
    const payload = { ...data, ejercicios: selectedEjercicios };
    if (!payload.categoria) delete payload.categoria;
    const result = await dispatch(createRutina(payload));
    if (createRutina.fulfilled.match(result)) {
      toast.success("Rutina creada");
      reset();
      setSelectedEjercicios([]);
      onCancel();
    } else {
      toast.error(result.payload || "Error al crear rutina");
    }
  };

  return (
    <form className="rutina-add-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="rutina-form-row">
        <div className="rutina-form-field">
          <input
            type="text"
            placeholder="Nombre *"
            className={errors.nombre ? "field-error" : ""}
            {...register("nombre")}
          />
          {errors.nombre && <span className="field-error-msg">{errors.nombre.message}</span>}
        </div>

        <div className="rutina-form-field rutina-form-field--sm">
          <input
            type="number"
            placeholder="Min *"
            min={1}
            max={180}
            className={errors.duracion ? "field-error" : ""}
            {...register("duracion", { valueAsNumber: true })}
          />
          {errors.duracion && <span className="field-error-msg">{errors.duracion.message}</span>}
        </div>

        <div className="rutina-form-field">
          <select
            defaultValue=""
            className={errors.nivelDificultad ? "field-error" : ""}
            {...register("nivelDificultad")}
          >
            <option value="" disabled>Dificultad *</option>
            <option>Principiante</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
          {errors.nivelDificultad && (
            <span className="field-error-msg">{errors.nivelDificultad.message}</span>
          )}
        </div>

        <div className="rutina-form-field">
          <select defaultValue="" {...register("categoria")}>
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c._id} value={c._id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="rutina-form-actions">
          <button type="submit" className="btn-icon-confirm" disabled={!isValid || isSubmitting} title="Guardar">
            <Check size={15} strokeWidth={2.5} />
          </button>
          <button type="button" className="btn-icon-cancel" onClick={onCancel} title="Cancelar">
            <X size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Selector de ejercicios */}
      <div className="ej-picker">
        <button
          type="button"
          className="ej-picker-toggle"
          onClick={() => setShowEjPicker((v) => !v)}
        >
          <Flame size={13} strokeWidth={1.5} />
          <span>
            {selectedEjercicios.length === 0
              ? "Agregar ejercicios"
              : `${selectedEjercicios.length} ejercicio${selectedEjercicios.length !== 1 ? "s" : ""} seleccionado${selectedEjercicios.length !== 1 ? "s" : ""}`}
          </span>
          {showEjPicker
            ? <ChevronUp size={13} strokeWidth={1.5} />
            : <ChevronDown size={13} strokeWidth={1.5} />
          }
        </button>

        {showEjPicker && (
          <div className="ej-picker-list">
            {ejercicios.length === 0 ? (
              <p className="ej-picker-empty">No hay ejercicios cargados</p>
            ) : (
              ejercicios.map((ej) => (
                <label key={ej._id} className="ej-picker-item">
                  <input
                    type="checkbox"
                    checked={selectedEjercicios.includes(ej._id)}
                    onChange={() => toggleEjercicio(ej._id)}
                  />
                  <span className="ej-picker-name">{ej.nombre}</span>
                  {ej.descripcion && (
                    <span className="ej-picker-desc">{ej.descripcion}</span>
                  )}
                </label>
              ))
            )}
          </div>
        )}
      </div>
    </form>
  );
};

/* ── Fila de rutina editable ─────────────────────────── */
const RutinaRow = ({ rutina, categorias, ejercicios }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showEjPicker, setShowEjPicker] = useState(false);
  const [editData, setEditData] = useState({
    nombre: rutina.nombre,
    duracion: rutina.duracion,
    nivelDificultad: rutina.nivelDificultad,
    categoria: rutina.categoria?._id || "",
    ejercicios: (rutina.ejercicios || []).map((e) => e._id ?? e),
  });

  const ejCount = (rutina.ejercicios || []).length;

  const toggleEjercicio = (id) => {
    setEditData((prev) => ({
      ...prev,
      ejercicios: prev.ejercicios.includes(id)
        ? prev.ejercicios.filter((e) => e !== id)
        : [...prev.ejercicios, id],
    }));
  };

  const handleSave = async () => {
    const payload = { ...editData };
    if (!payload.categoria) delete payload.categoria;
    const result = await dispatch(updateRutina({ id: rutina._id, data: payload }));
    if (updateRutina.fulfilled.match(result)) {
      toast.success("Rutina actualizada");
      setEditing(false);
      setShowEjPicker(false);
    } else {
      toast.error(result.payload || "Error al actualizar");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteRutina(rutina._id));
    if (deleteRutina.fulfilled.match(result)) {
      toast.success("Rutina eliminada");
    } else {
      toast.error(result.payload || "Error al eliminar");
    }
  };

  if (editing) {
    return (
      <div className="rutina-item rutina-item--editing">
        <div className="rutina-item-icon">
          <Flame size={15} strokeWidth={1.5} color="#ffd85f" />
        </div>

        <input
          className="edit-input edit-input--name"
          value={editData.nombre}
          onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
        />
        <input
          className="edit-input edit-input--dur"
          type="number"
          min={1}
          max={180}
          value={editData.duracion}
          onChange={(e) => setEditData({ ...editData, duracion: Number(e.target.value) })}
        />
        <select
          className="edit-select"
          value={editData.nivelDificultad}
          onChange={(e) => setEditData({ ...editData, nivelDificultad: e.target.value })}
        >
          <option>Principiante</option>
          <option>Intermedio</option>
          <option>Avanzado</option>
        </select>
        <select
          className="edit-select"
          value={editData.categoria}
          onChange={(e) => setEditData({ ...editData, categoria: e.target.value })}
        >
          <option value="">Sin categoría</option>
          {categorias.map((c) => (
            <option key={c._id} value={c._id}>{c.nombre}</option>
          ))}
        </select>

        <div className="rutina-actions">
          <button className="btn-icon-confirm" onClick={handleSave} title="Guardar">
            <Check size={13} strokeWidth={2.5} />
          </button>
          <button className="btn-icon-cancel" onClick={() => { setEditing(false); setShowEjPicker(false); }} title="Cancelar">
            <X size={13} strokeWidth={2} />
          </button>
        </div>

        {/* Picker de ejercicios inline */}
        <div className="ej-picker ej-picker--inline">
          <button
            type="button"
            className="ej-picker-toggle"
            onClick={() => setShowEjPicker((v) => !v)}
          >
            <Flame size={13} strokeWidth={1.5} />
            <span>
              {editData.ejercicios.length === 0
                ? "Ejercicios"
                : `${editData.ejercicios.length} ejercicio${editData.ejercicios.length !== 1 ? "s" : ""}`}
            </span>
            {showEjPicker
              ? <ChevronUp size={13} strokeWidth={1.5} />
              : <ChevronDown size={13} strokeWidth={1.5} />
            }
          </button>

          {showEjPicker && (
            <div className="ej-picker-list">
              {ejercicios.length === 0 ? (
                <p className="ej-picker-empty">No hay ejercicios cargados</p>
              ) : (
                ejercicios.map((ej) => (
                  <label key={ej._id} className="ej-picker-item">
                    <input
                      type="checkbox"
                      checked={editData.ejercicios.includes(ej._id)}
                      onChange={() => toggleEjercicio(ej._id)}
                    />
                    <span className="ej-picker-name">{ej.nombre}</span>
                    {ej.descripcion && (
                      <span className="ej-picker-desc">{ej.descripcion}</span>
                    )}
                  </label>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`rutina-item-wrapper${expanded ? " rutina-item-wrapper--expanded" : ""}`}>
      <div className="rutina-item">
        <div className="rutina-item-icon">
          <Flame size={15} strokeWidth={1.5} color="#ffd85f" />
        </div>
        <div className="rutina-item-info">
          <span className="rutina-item-nombre">{rutina.nombre}</span>
          <span className="rutina-item-cat">{rutina.categoria?.nombre || "Sin categoría"}</span>
        </div>
        <div className="rutina-duration">
          <Clock size={11} strokeWidth={1.5} />
          <span>{rutina.duracion} min</span>
        </div>
        <span className={`difficulty-badge ${BADGE[rutina.nivelDificultad] || ""}`}>
          {rutina.nivelDificultad}
        </span>
        <div className="rutina-actions">
          <button className="btn-icon-edit" onClick={() => setEditing(true)} title="Editar">
            <Pencil size={13} strokeWidth={1.5} />
          </button>
          <button className="btn-icon-delete" onClick={handleDelete} title="Eliminar">
            <Trash2 size={13} strokeWidth={1.5} />
          </button>
          {ejCount > 0 && (
            <button
              className="rutina-expand-btn"
              onClick={() => setExpanded((v) => !v)}
              title={expanded ? "Colapsar" : `Ver ${ejCount} ejercicio${ejCount !== 1 ? "s" : ""}`}
            >
              {expanded ? <ChevronUp size={13} strokeWidth={2} /> : <ChevronDown size={13} strokeWidth={2} />}
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="rutina-ejercicios-expand">
          {(rutina.ejercicios || []).map((ej) => (
            <div key={ej._id} className="rutina-ej-chip">
              <div className="rutina-ej-chip-img">
                {ej.imagen
                  ? <img src={ej.imagen} alt={ej.nombre} />
                  : <ImageOff size={12} strokeWidth={1.2} color="#c8c9cc" />
                }
              </div>
              <span className="rutina-ej-chip-nombre">{ej.nombre}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Manager principal ───────────────────────────────── */
const RutinasManager = () => {
  const dispatch = useDispatch();
  const { data: rutinas, total, loading } = useSelector((s) => s.rutinas);
  const { data: categorias } = useSelector((s) => s.categorias);
  const { data: ejercicios } = useSelector((s) => s.ejercicios);
  const { user } = useSelector((s) => s.auth);

  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({ nombre: "", nivelDificultad: "", categoria: "" });

  const planLimit = user?.plan === "premium" ? Infinity : 4;
  const atLimit = planLimit !== Infinity && total >= planLimit;

  useEffect(() => {
    dispatch(fetchCategorias());
  }, [dispatch]);

  const filtered = rutinas.filter((r) => {
    if (filters.nombre && !r.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) return false;
    if (filters.nivelDificultad && r.nivelDificultad !== filters.nivelDificultad) return false;
    if (filters.categoria && r.categoria?._id !== filters.categoria) return false;
    return true;
  });

  const handleFilterChange = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    if (key !== "nombre") {
      const params = {};
      if (key === "nivelDificultad" && val) params.nivelDificultad = val;
      if (key === "categoria" && val) params.categoria = val;
      if (filters.nombre) params.nombre = filters.nombre;
      dispatch(fetchRutinas(params));
    }
  };

  return (
    <div className="card rutinas-manager">
      {/* Header */}
      <div className="rm-header">
        <div>
          <h3 className="card-title">Mis Rutinas</h3>
          <p className="card-subtitle">
            {user?.plan === "premium"
              ? `${total} rutinas registradas`
              : `${total} / ${planLimit} rutinas del plan plus`
            }
          </p>
        </div>
        <button
          className={`rm-add-btn${atLimit ? " rm-add-btn--disabled" : ""}`}
          onClick={() => !atLimit && setShowAddForm((v) => !v)}
          disabled={atLimit}
          title={atLimit ? "Límite de rutinas alcanzado. Cambia a Premium." : "Nueva rutina"}
        >
          <Plus size={15} strokeWidth={2.5} />
          Nueva Rutina
        </button>
      </div>

      {/* Aviso de límite */}
      {atLimit && (
        <div className="rm-limit-notice">
          Alcanzaste el límite de {planLimit} rutinas del plan Plus. Cambia a Premium para crear más.
        </div>
      )}

      {/* Formulario de alta */}
      {showAddForm && !atLimit && (
        <AddForm
          categorias={categorias}
          ejercicios={ejercicios}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Filtros */}
      <div className="rm-filters">
        <div className="rm-filter-search">
          <Search size={13} strokeWidth={1.5} color="#898989" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filters.nombre}
            onChange={(e) => handleFilterChange("nombre", e.target.value)}
          />
        </div>
        <div className="rm-filter-select">
          <SlidersHorizontal size={13} strokeWidth={1.5} color="#898989" />
          <select
            value={filters.nivelDificultad}
            onChange={(e) => handleFilterChange("nivelDificultad", e.target.value)}
          >
            <option value="">Todas las dificultades</option>
            <option>Principiante</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>
        <div className="rm-filter-select">
          <select
            value={filters.categoria}
            onChange={(e) => handleFilterChange("categoria", e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c._id} value={c._id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista */}
      <div className="rutinas-list">
        {loading ? (
          <div className="loading-state">Cargando rutinas...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <strong>{total === 0 ? "Sin rutinas todavía" : "Sin resultados"}</strong>
            {total === 0
              ? "Crea tu primera rutina con el botón de arriba"
              : "Prueba con otros filtros"}
          </div>
        ) : (
          filtered.map((r) => (
            <RutinaRow key={r._id} rutina={r} categorias={categorias} ejercicios={ejercicios} />
          ))
        )}
      </div>
    </div>
  );
};

export default RutinasManager;
