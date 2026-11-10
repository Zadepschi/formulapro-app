import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { HomePage } from "../features/home/HomePage";
import { CirclePage } from "../features/circle/CirclePage";
import { TrianglePage } from "../features/triangle/TrianglePage";
import { ParallelogramPage } from "../features/parallelogram/ParallelogramPage";
import QuizPage from "../features/quiz/QuizPage";
import SpherePage from "../features/sphere/SpherePage";
import ConePage from "../features/cone/ConePage";
import PrismPage from "../features/prism/PrismPage";
import HistoryPage from "../features/history/HistoryPage";
import { AboutPage } from "../features/about/AboutPage";

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
  element: <SpherePage />,
},
     {
  path: "cone",
  element: <ConePage />,
},
     {
  path: "prism",
  element: <PrismPage />,
},
     {
  path: "parallelogram",
  element: <ParallelogramPage />,
},
     {
  path: "quiz",
  element: <QuizPage />,
},
      {
  path: "history",
  element: <HistoryPage />,
},
      {
  path: "settings",
  element: <AboutPage />,
},
    ],
  },
  {
    path: "*",
    element: <Navigate to="/ru" replace />,
  },
]);