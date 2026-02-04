import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  adminOnly?: boolean;
};

export default function ProtectedRoute({ adminOnly = false }: Props) {
  const { loggedIn, user } = useAuth();

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
