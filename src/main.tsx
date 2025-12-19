import React from "react";
import { createRoot } from "react-dom/client";

/* 1) Import the RouterProvider from the router library */
import { RouterProvider } from "react-router-dom";

/* 2) Import YOUR router object (you'll create it in the next step) */
import { router } from "./router";

import "./index.css";

/* 3) Find the <div id="root"> in index.html and mount React there */
createRoot(document.getElementById("root")!).render(
  /* 4) Tell React to use your router to decide what to show for each URL */
  <RouterProvider router={router} />
);
