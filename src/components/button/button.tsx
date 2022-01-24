import React from "react";

import { Spinner } from "../spinner";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export function Button({
  variant,
  isLoading = false,
  children,
  ...props
}: ButtonProps): React.ReactElement {
  let variantClassNames = [
    "bg-gray-200",
    "hover:bg-gray-300",
    "focus:border-gray-400",
    "active:bg-gray-500",
    "text-gray-800",
  ];
  if (variant === "primary") {
    variantClassNames = [
      "bg-blue-600",
      "hover:bg-blue-500",
      "focus:border-blue-700",
      "active:bg-blue-700",
      "text-white",
    ];
  }
  return (
    <button
      className={`inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md transition ease-in-out duration-150 ${variantClassNames.join(
        " ",
      )}`}
      {...props}
    >
      {isLoading && <Spinner className="w-4 h-4 mr-3 -ml-1 text-blue-200" />}
      {children}
    </button>
  );
}
