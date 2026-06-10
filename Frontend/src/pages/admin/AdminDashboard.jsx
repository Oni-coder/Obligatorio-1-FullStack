import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminNavbar from "../../components/admin/AdminNavbar";
import EjerciciosManager from "../../components/admin/EjerciciosManager";
import UsuariosList from "../../components/admin/UsuariosList";
import { fetchEjercicios } from "../../features/ejercicios.slice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState("ejercicios");

  useEffect(() => {
    if (token) dispatch(fetchEjercicios());
  }, [dispatch, token]);

  return (
    <>
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="dashboard-content">
        <div className="admin-welcome">
          <h2 className="admin-welcome-title">Panel de administración</h2>
          <p className="admin-welcome-sub">Gestioná los ejercicios y usuarios de la plataforma</p>
        </div>
        {activeTab === "ejercicios" && <EjerciciosManager />}
        {activeTab === "usuarios"   && <UsuariosList />}
      </div>
    </>
  );
};

export default AdminDashboard;
