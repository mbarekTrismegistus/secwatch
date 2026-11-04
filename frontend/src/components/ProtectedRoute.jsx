import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../services/authService";
export default function ProtectedRoute() {
  return auth.logged() ? <Outlet /> : <Navigate to="/login" replace />;
}
