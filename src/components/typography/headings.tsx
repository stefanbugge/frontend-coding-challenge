import React from "react";

export function PageHeading(
  props: React.HTMLAttributes<HTMLHeadingElement>,
): React.ReactElement {
  return <h1 className="text-2xl font-bold" {...props} />;
}
