import React from "react";

export type ListSkeletonProps = {
  isLoaded: boolean;
  rows?: number;
};

export function ListSkeleton({
  isLoaded,
  rows = 5,
  ...restProps
}: React.PropsWithChildren<ListSkeletonProps>): React.ReactElement {
  if (isLoaded) {
    return <div {...restProps} />;
  }
  return (
    <div className="animate-pulse flex flex-col space-y-2">
      {Array.from(Array(rows).keys()).map((_, i) => (
        <div key={i} className="flex space-x-2">
          <div className="h-4 w-10 bg-gray-300 rounded" />
          <div className="h-4 flex-grow bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}
