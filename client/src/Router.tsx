import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import GenerateQuizView from "./pages/GenerateQuizView";
import Profil from "./pages/Profil";
import Stats from "./pages/Stats";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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


