import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import GenerateQuizView from "./pages/GenerateQuizView";

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
]);

export default function Router() {
  return <RouterProvider router={router} />;
}


