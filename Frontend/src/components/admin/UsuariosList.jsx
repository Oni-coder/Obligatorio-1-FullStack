import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Crown, Star } from "lucide-react";
import { fetchUsuarios } from "../../features/admin.slice";

const PLAN_ICON = {
  premium: <Crown size={11} strokeWidth={2} />,
  plus:    <Star  size={11} strokeWidth={2} />,
};

const UsuariosList = () => {
  const dispatch = useDispatch();
  const { usuarios, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchUsuarios());
  }, [dispatch]);

  const premiumCount = usuarios.filter((u) => u.plan === "premium").length;
  const plusCount    = usuarios.filter((u) => u.plan === "plus").length;

  return (
    <div className="card admin-panel">
      <div className="rm-header">
        <div>
          <h3 className="card-title">Usuarios</h3>
          <p className="card-subtitle">
            {usuarios.length} registrados &middot;{" "}
            <span style={{ color: "#9a7200", fontWeight: 600 }}>{premiumCount} premium</span>
            {" "}&middot; {plusCount} plus
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Cargando usuarios...</div>
      ) : usuarios.length === 0 ? (
        <div className="empty-state"><strong>Sin usuarios</strong></div>
      ) : (
        <div className="usuarios-table-wrap">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Plan</th>
                <th>Rutinas</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="usr-cell">
                      <div className="usr-avatar">
                        {u.fotoPerfil
                          ? <img src={u.fotoPerfil} alt={u.email} />
                          : <User size={13} strokeWidth={1.5} color="#898989" />
                        }
                      </div>
                      <span className="usr-email">{u.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`plan-badge ${u.plan === "premium" ? "plan-premium" : "plan-plus"}`}>
                      {PLAN_ICON[u.plan]}
                      <span>{u.plan}</span>
                    </span>
                  </td>
                  <td className="usr-count">{u.rutinas?.length ?? 0}</td>
                  <td className="usr-date">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-UY") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsuariosList;
