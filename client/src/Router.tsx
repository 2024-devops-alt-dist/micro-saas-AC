import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import GenerateQuizView from "./pages/GenerateQuizView";
import Profil from "./pages/Profil";
import Stats from "./pages/Stats";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/quiz",
    element: <Quiz />,
  },
  {
    path: "/generate-quiz",
    element: <GenerateQuizView />,
  },
  {
    path: "/profil",
    element: <Profil />,
  },
  {
    path: "/stats",
    element: <Stats />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
