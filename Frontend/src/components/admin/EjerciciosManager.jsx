import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Check, X, ImagePlus, ImageOff } from "lucide-react";
import { fetchEjercicios, createEjercicio, updateEjercicio, deleteEjercicio } from "../../features/ejercicios.slice";
import api from "../../api/axios";

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("imagen", file);
  formData.append("folder", "ejercicios");
  const { data } = await api.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
};

/* ── Formulario de alta ─────────────────────────────── */
const AddForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "", imagen: "" });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, imagen: url }));
      setPreview(url);
    } catch {
      toast.error("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setSubmitting(true);
    const payload = { nombre: form.nombre, descripcion: form.descripcion };
    if (form.imagen) payload.imagen = form.imagen;
    const result = await dispatch(createEjercicio(payload));
    if (createEjercicio.fulfilled.match(result)) {
      toast.success("Ejercicio creado");
      onCancel();
    } else {
      toast.error(result.payload || "Error al crear ejercicio");
    }
    setSubmitting(false);
  };

  return (
    <form className="ej-add-form" onSubmit={handleSubmit} noValidate>
      <div className="ej-add-img-col">
        <div
          className="ej-add-img-preview"
          onClick={() => fileRef.current?.click()}
          title="Subir imagen"
        >
          {preview
            ? <img src={preview} alt="preview" />
            : <ImagePlus size={22} strokeWidth={1.3} color="#c8c9cc" />
          }
          {uploading && <div className="ej-img-uploading">Subiendo...</div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageFile} />
      </div>

      <div className="ej-add-fields">
        <input
          type="text"
          placeholder="Nombre *"
          value={form.nombre}
          onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          className="ej-field-input"
          required
        />
        <textarea
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
          className="ej-field-textarea"
          rows={2}
        />
      </div>

      <div className="rutina-form-actions">
        <button type="submit" className="btn-icon-confirm" disabled={!form.nombre.trim() || submitting} title="Guardar">
          <Check size={15} strokeWidth={2.5} />
        </button>
        <button type="button" className="btn-icon-cancel" onClick={onCancel} title="Cancelar">
          <X size={15} strokeWidth={2} />
        </button>
      </div>
    </form>
  );
};

/* ── Fila editable ───────────────────────────────────── */
const EjercicioRow = ({ ejercicio }) => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    nombre: ejercicio.nombre,
    descripcion: ejercicio.descripcion || "",
    imagen: ejercicio.imagen || "",
  });
  const [uploading, setUploading] = useState(false);

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditData((d) => ({ ...d, imagen: url }));
    } catch {
      toast.error("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const payload = { nombre: editData.nombre, descripcion: editData.descripcion };
    if (editData.imagen) payload.imagen = editData.imagen;
    const result = await dispatch(updateEjercicio({ id: ejercicio._id, data: payload }));
    if (updateEjercicio.fulfilled.match(result)) {
      toast.success("Ejercicio actualizado");
      setEditing(false);
    } else {
      toast.error(result.payload || "Error al actualizar");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteEjercicio(ejercicio._id));
    if (deleteEjercicio.fulfilled.match(result)) {
      toast.success("Ejercicio eliminado");
    } else {
      toast.error(result.payload || "Error al eliminar");
    }
  };

  if (editing) {
    return (
      <div className="ej-row ej-row--editing">
        <div className="ej-row-img-wrap" onClick={() => fileRef.current?.click()} title="Cambiar imagen">
          {editData.imagen
            ? <img src={editData.imagen} alt={editData.nombre} />
            : <ImagePlus size={16} strokeWidth={1.3} color="#c8c9cc" />
          }
          {uploading && <div className="ej-img-uploading">...</div>}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageFile} />
        </div>
        <div className="ej-row-fields">
          <input
            className="edit-input"
            value={editData.nombre}
            onChange={(e) => setEditData((d) => ({ ...d, nombre: e.target.value }))}
            placeholder="Nombre"
          />
          <input
            className="edit-input ej-row-desc-input"
            value={editData.descripcion}
            onChange={(e) => setEditData((d) => ({ ...d, descripcion: e.target.value }))}
            placeholder="Descripción"
          />
        </div>
        <div className="rutina-actions">
          <button className="btn-icon-confirm" onClick={handleSave} title="Guardar">
            <Check size={13} strokeWidth={2.5} />
          </button>
          <button className="btn-icon-cancel" onClick={() => setEditing(false)} title="Cancelar">
            <X size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ej-row">
      <div className="ej-row-img-wrap">
        {ejercicio.imagen
          ? <img src={ejercicio.imagen} alt={ejercicio.nombre} />
          : <ImageOff size={16} strokeWidth={1.2} color="#c8c9cc" />
        }
      </div>
      <div className="ej-row-info">
        <span className="ej-row-nombre">{ejercicio.nombre}</span>
        {ejercicio.descripcion && (
          <span className="ej-row-desc">{ejercicio.descripcion}</span>
        )}
      </div>
      <div className="rutina-actions">
        <button className="btn-icon-edit" onClick={() => setEditing(true)} title="Editar">
          <Pencil size={13} strokeWidth={1.5} />
        </button>
        <button className="btn-icon-delete" onClick={handleDelete} title="Eliminar">
          <Trash2 size={13} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

/* ── Manager principal ───────────────────────────────── */
const EjerciciosManager = () => {
  const { data: ejercicios, loading } = useSelector((s) => s.ejercicios);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="card admin-panel">
      <div className="rm-header">
        <div>
          <h3 className="card-title">Ejercicios</h3>
          <p className="card-subtitle">{ejercicios.length} ejercicio{ejercicios.length !== 1 ? "s" : ""} registrado{ejercicios.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="rm-add-btn" onClick={() => setShowAdd((v) => !v)}>
          <Plus size={15} strokeWidth={2.5} />
          Nuevo
        </button>
      </div>

      {showAdd && <AddForm onCancel={() => setShowAdd(false)} />}

      <div className="ej-manager-list">
        {loading ? (
          <div className="loading-state">Cargando ejercicios...</div>
        ) : ejercicios.length === 0 ? (
          <div className="empty-state"><strong>Sin ejercicios</strong>Agregá el primero con el botón de arriba</div>
        ) : (
          ejercicios.map((ej) => <EjercicioRow key={ej._id} ejercicio={ej} />)
        )}
      </div>
    </div>
  );
};

export default EjerciciosManager;
