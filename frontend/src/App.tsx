import { Navigate, useRoutes } from "react-router-dom";
import UserRouter from "./routes/UserRoutes";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ProtectedRoute from "./routes/ProtectedRoute";
import LobbyPage from "./pages/lobby";

export default function App() {
  const routes = useRoutes([
    {
      element: <UserRouter />,
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
        }
      ]
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          index: true,
          element: <Navigate to="/lobby" replace />
        },
        {
          path: "lobby",
          element: <LobbyPage />
        }
      ]
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />
    }
  ]);

  return routes;
}