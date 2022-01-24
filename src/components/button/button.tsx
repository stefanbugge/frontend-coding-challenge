import React from "react";

import mergeClassNames from "../../utils";
import { Spinner } from "../spinner";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export function Button(props: ButtonProps): React.ReactElement {
  const { variant, isLoading = false, children, ...restProps } = props;
  const styleProps = useStyle(props);
  return (
    <button className={styleProps.className} {...restProps}>
      {isLoading && <Spinner className="w-4 h-4 mr-3 -ml-1 text-blue-200" />}
      {children}
    </button>
  );
}

function useStyle(props: ButtonProps) {
  let variantClassNames = [
    "bg-gray-200",
    "hover:bg-gray-300",
    "focus:border-gray-400",
    "active:bg-gray-500",
    "text-gray-800",
  ];
  if (props.variant === "primary") {
    variantClassNames = [
      "bg-blue-600",
      "hover:bg-blue-500",
      "focus:border-blue-700",
      "active:bg-blue-700",
      "text-white",
    ];
  }

  if (props.variant === "danger") {
    variantClassNames = [
      "bg-red-600",
      "hover:bg-red-500",
      "focus:border-red-700",
      "active:bg-red-700",
      "text-white",
    ];
  }

  const className = mergeClassNames(
    "inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md transition ease-in-out duration-150",
    variantClassNames,
    props.className,
  );
  return {
    className,
  };
}
