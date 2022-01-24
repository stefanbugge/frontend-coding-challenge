import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import { Spinner } from "./components/spinner";
import { MainLayout } from "./layout";

const CreatePage = React.lazy(() => import("./pages/create-page"));

const PageSpinner = () => <Spinner className="h-8 w-8 text-blue-400" />;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<App />} />
          <Route
            path="new"
            element={
              <React.Suspense fallback={<PageSpinner />}>
                <CreatePage />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);
