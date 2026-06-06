import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { token } = useSelector((s) => s.auth);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
