import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../services/authService";
export default function RoleRoute({ roles }) {
  return roles.includes(auth.user()?.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}
