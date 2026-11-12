import { Navigate, useRoutes } from "react-router-dom";
import UserRouter from "./routes/UserRoutes";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ProtectedRoute from "./routes/ProtectedRoute";
import LobbyPage from "./pages/lobby";
import BahasaMenuPage from "./pages/lobby/bahasa";
import LobbyLayout from "./layouts/LobbyLayout";
import UserLayout from "./layouts/UserLayout";
import LevelLayout from "./layouts/LevelLayout";
import LevelPage from "./components/Level";

export default function App() {
  const routes = useRoutes([
    {
      element: <UserRouter />,
      children: [
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
            }
          ]
        },
      ]
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/lobi",
          element: <LobbyLayout />,
          children: [
            {
              index: true,
              element: <LobbyPage />
            },
            {
              path: "pilih-bahasa",
              element: <BahasaMenuPage />
            },
          ]
        },
        {
          path: "/bahasa-indonesia",
          element: <LevelLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="tingkat" replace />
            },
            {
              path: "tingkat",
              element: <LevelPage />
            }
          ]
        },
        {
          path: "/bahasa-inggris",
          element: <LevelLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="tingkat" replace />
            },
            {
              path: "tingkat",
              element: <LevelPage />
            }
          ]
        },
        {
          path: "/matematika",
          element: <LevelLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="tingkat" replace />
            },
            {
              path: "tingkat",
              element: <LevelPage />
            }
          ]
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