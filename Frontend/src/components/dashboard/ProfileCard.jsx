import { User, Crown, Star, ArrowUpRight, Upload } from "lucide-react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { changePlan } from "../../features/auth.slice";
import api from "../../api/axios";

const ProfileCard = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  const { total: totalRutinas } = useSelector((s) => s.rutinas);
  const fileRef = useRef(null);

  const plan = user?.plan || "plus";
  const planLimit = plan === "premium" ? Infinity : 4;
  const usagePct = planLimit === Infinity ? 100 : Math.min((totalRutinas / planLimit) * 100, 100);
  const nombre = user?.email?.split("@")[0] || "Usuario";

  const handleChangePlan = async () => {
    const result = await dispatch(changePlan());
    if (changePlan.fulfilled.match(result)) {
      toast.success("Plan actualizado a Premium");
    } else {
      toast.error(result.payload || "Error al cambiar plan");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("imagen", file);
    try {
      await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Imagen subida correctamente");
    } catch {
      toast.error("Error al subir imagen");
    }
  };

  return (
    <div className="card profile-card">
      <div className="profile-avatar" onClick={() => fileRef.current?.click()} title="Subir foto">
        <User size={36} strokeWidth={1.5} color="#898989" />
        <div className="profile-avatar-overlay">
          <Upload size={14} strokeWidth={2} color="white" />
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
      </div>

      <div className="profile-info">
        <h3 className="profile-name">{nombre}</h3>
        <p className="profile-email">{user?.email || "—"}</p>
      </div>

      <div className={`plan-badge ${plan === "premium" ? "plan-premium" : "plan-plus"}`}>
        {plan === "premium"
          ? <Crown size={11} strokeWidth={2} />
          : <Star size={11} strokeWidth={2} />
        }
        <span>{plan}</span>
      </div>

      {/* Usage report */}
      <div className="usage-report">
        <div className="usage-header">
          <span className="usage-label">
            {plan === "premium"
              ? `${totalRutinas} rutinas`
              : `${totalRutinas} / ${planLimit} rutinas`
            }
          </span>
          <span className="usage-pct">
            {plan === "premium" ? "ilimitado" : `${Math.round(usagePct)}%`}
          </span>
        </div>
        <div className="usage-bar-track">
          <div
            className={`usage-bar-fill ${usagePct >= 100 ? "usage-full" : ""}`}
            style={{ width: `${plan === "premium" ? 60 : usagePct}%` }}
          />
        </div>
      </div>

      {plan === "plus" && (
        <button
          className="plan-upgrade-btn"
          onClick={handleChangePlan}
          disabled={loading}
        >
          <Crown size={13} strokeWidth={2} />
          {loading ? "Actualizando..." : "Cambiar a Premium"}
        </button>
      )}

      {plan === "premium" && (
        <div className="premium-badge-row">
          <Crown size={13} strokeWidth={2} color="#9a7200" />
          <span>Plan Premium activo</span>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
