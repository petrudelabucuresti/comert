import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-10">Se încarcă...</p>;

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "admin") return <Navigate to="/" />;

  return children;
}