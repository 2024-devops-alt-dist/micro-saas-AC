import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
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
]);

export default function Router() {
  return <RouterProvider router={router} />;
}


