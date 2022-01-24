import React from "react";

import { ListContainer } from "../list";

export type ListSkeletonProps = {
  isLoaded: boolean;
};

const widths = ["w-1/3", "w-1/2", "w-1/4", "w-7/12", "w-1/6"];

export function ListSkeleton({
  isLoaded,
  ...restProps
}: React.PropsWithChildren<ListSkeletonProps>): React.ReactElement {
  if (isLoaded) {
    return <div {...restProps} />;
  }
  return (
    <ListContainer>
      {widths.map((w, i) => (
        <li key={i} className="animate-pulse px-4 py-2 flex items-center">
          <div className="flex-grow">
            <div className={`${w} h-3 rounded bg-gray-300`} />
            <div className="h-2 w-3/4 bg-gray-300 rounded mt-2" />
          </div>
          <div className="h-4 w-4 m-1 bg-gray-300 rounded" />
        </li>
      ))}
    </ListContainer>
  );
}
