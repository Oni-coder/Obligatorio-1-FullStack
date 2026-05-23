import { User, Crown, Star } from "lucide-react";
import { useSelector } from "react-redux";

const ProfileCard = () => {
  const { user, token } = useSelector((s) => s.auth);
  const { total: totalRutinas } = useSelector((s) => s.rutinas);

  const nombre = user?.email?.split("@")[0] || "Sin sesión";
  const plan = user?.plan || "plus";
  const planLimit = plan === "premium" ? "Ilimitado" : "4";

  return (
    <div className="card profile-card">
      <div className="profile-avatar">
        <User size={36} strokeWidth={1.5} color="#898989" />
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

      {token ? (
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{totalRutinas}</span>
            <span className="profile-stat-label">Rutinas</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-value">{planLimit}</span>
            <span className="profile-stat-label">Límite</span>
          </div>
        </div>
      ) : (
        <p className="no-session">
          Conecta tu token JWT<br />para ver tus datos
        </p>
      )}
    </div>
  );
};

export default ProfileCard;
