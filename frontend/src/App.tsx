import { Navigate, useRoutes } from "react-router-dom";
import UserRouter from "./routes/UserRoutes";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ProtectedRoute from "./routes/ProtectedRoute";
import LobbyPage from "./pages/lobby";
import BahasaMenuPage from "./pages/lobby/bahasa";
import LobbyLayout from "./layouts/LobbyLayout";
import UserLayout from "./layouts/UserLayout";
import LevelPage from "./components/Level";
import ModesPage from "./components/Modes";
import ModeLayout from "./layouts/ModeLayout";
import QuestionPage from "./components/Questions";
import LeaderBoardPage from "./components/LeaderBoard";

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
              element: <Navigate to="/masuk" replace />
            },
            {
              path: "masuk",
              element: <LoginPage />
            },
            {
              path: "daftar",
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
          path: "/beranda",
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
          element: <ModeLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="mode" replace />
            },
            {
              path: "mode",
              element: <ModesPage />
            },
            {
              path: "tingkat",
              element: <LevelPage />
            },
            {
              path: "main",
              element: <QuestionPage />
            }
          ]
        },
        {
          path: "/bahasa-inggris",
          element: <ModeLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="mode" replace />
            },
            {
              path: "mode",
              element: <ModesPage />
            },
            {
              path: "tingkat",
              element: <LevelPage />
            },
            {
              path: "main",
              element: <QuestionPage />
            }
          ]
        },
        {
          path: "/matematika",
          element: <ModeLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="mode" replace />
            },
            {
              path: "mode",
              element: <ModesPage />
            },
            {
              path: "tingkat",
              element: <LevelPage />
            },
            {
              path: "main",
              element: <QuestionPage />
            }
          ]
        },
        {
          path: "/papan-peringkat",
          element: <LeaderBoardPage />
        }
      ]
    },
    {
      path: "*",
      element: <Navigate to="/masuk" replace />
    }
  ]);

  return routes;
}