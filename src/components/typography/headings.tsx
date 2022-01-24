import React from "react";

export function PageHeading({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return (
    <h1 className="text-2xl font-bold mb-8" {...props}>
      {children}
    </h1>
  );
}
