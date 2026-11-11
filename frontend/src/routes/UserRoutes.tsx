import { Navigate, useRoutes } from "react-router-dom";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import UserLayout from "../layouts/user";

export default function UserRouter() {
    const routes = useRoutes([
        {
            path: "/",
            element: <UserLayout />,
            children: [
                {
                    index: true,
                    element: <Navigate to="/login" replace />
                },
                {
                    path: "login",
                    element: <LoginPage />
                },
                {
                    path: "register",
                    element: <RegisterPage />
                },
            ]
        }
    ]);
    return routes;
}