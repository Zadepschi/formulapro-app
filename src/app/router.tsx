import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { HomePage } from "../features/home/HomePage";
import { CirclePage } from "../features/circle/CirclePage";
import { TrianglePage } from "../features/triangle/TrianglePage";

import { App } from "../app/App";

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <main className="page">
      <h1>{title}</h1>
      <p>Раздел находится в разработке.</p>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/ru" replace />,
  },
  {
    path: "/:lang",
    element: <App />,
    children: [
    {
  index: true,
  element: <HomePage />,
},
     { path: "circle", element: <CirclePage /> },
      {
  path: "triangle",
  element: <TrianglePage />,
},
      {
        path: "sphere",
        element: <PlaceholderPage title="Sphere" />,
      },
      {
        path: "cone",
        element: <PlaceholderPage title="Cone" />,
      },
      {
        path: "prism",
        element: <PlaceholderPage title="Rectangular Prism" />,
      },
      {
        path: "parallelogram",
        element: <PlaceholderPage title="Parallelogram" />,
      },
      {
        path: "quiz",
        element: <PlaceholderPage title="Knowledge Test" />,
      },
      {
        path: "history",
        element: <PlaceholderPage title="Calculation History" />,
      },
      {
        path: "settings",
        element: <PlaceholderPage title="Settings" />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/ru" replace />,
  },
]);