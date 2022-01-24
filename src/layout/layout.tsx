import React from "react";
import { Outlet } from "react-router-dom";

export function MainLayout(): React.ReactElement {
  return (
    <div className="max-w-3xl mx-auto mt-28 text-body-text">
      <Outlet />
    </div>
  );
}
