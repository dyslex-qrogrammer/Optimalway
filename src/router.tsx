import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Sorting from "./pages/Sorting";
import Searching from "./pages/Searching";
import RoadRouting from "./pages/RoadRouting";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/sorting", element: <Sorting /> },
  { path: "/searching", element: <Searching /> },
  { path: "/road-routing", element: <RoadRouting /> },
]);
