import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@aws-amplify/ui-react/styles.css";
import App from "./App.tsx";
import "./index.css";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import ScoresPage from "./scores-page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/high-scores",
        element: <ScoresPage />,
      },
    ],
  },
]);

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
