import React from "react";
import { Outlet } from "react-router-dom";

export function MainLayout(): React.ReactElement {
  return (
    <div className="max-w-lg mx-auto mt-28 text-body-text relative">
      <Outlet />
    </div>
  );
}
