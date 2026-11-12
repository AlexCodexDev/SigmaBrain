import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserRouter() {
    const { user, loading } = useAuth();

    if(loading) return <div>Memeriksa sesi login...</div>;

    if(user) return <Navigate to="/lobby" replace />

    return <Outlet />;
}