import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/layout/Navbar";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import ProfileCard from "../components/dashboard/ProfileCard";
import RutinasWidget from "../components/dashboard/RutinasWidget";
import ProgresoWidget from "../components/dashboard/ProgresoWidget";
import EjerciciosWidget from "../components/dashboard/EjerciciosWidget";
import CategoriasPanel from "../components/dashboard/CategoriasPanel";
import RutinasRecientes from "../components/dashboard/RutinasRecientes";
import { fetchRutinas } from "../features/rutinas.slice";
import { fetchEjercicios } from "../features/ejercicios.slice";
import { fetchCategorias } from "../features/categorias.slice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchEjercicios());
      dispatch(fetchCategorias());
      dispatch(fetchRutinas());
    }
  }, [dispatch, token]);

  return (
    <>
      <Navbar activeTab="dashboard" />
      <div className="dashboard-content">
        <WelcomeSection />
        <div className="dashboard-grid">
          <ProfileCard />
          <RutinasWidget />
          <ProgresoWidget />
          <EjerciciosWidget />
          <CategoriasPanel />
          <RutinasRecientes />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
