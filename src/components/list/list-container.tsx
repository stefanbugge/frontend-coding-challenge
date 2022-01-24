import React from "react";

import mergeClassNames from "../../utils";

export function ListContainer(props: React.HTMLAttributes<HTMLUListElement>) {
  const className = mergeClassNames(
    "grid grid-cols-1 divide-y divide-gray-100",
    "border border-gray-100 rounded-lg shadow",
    props.className,
  );
  return <ul {...props} className={className} />;
}

export interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  button?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export function ListItem({
  button = false,
  ...props
}: ListItemProps): React.ReactElement {
  let componentProps: React.HTMLAttributes<HTMLElement> = {};
  let classList = ["bg-transparent"];
  if (button) {
    componentProps.role = "button";
    componentProps.tabIndex = 0;
    classList = classList.concat([
      "hover:bg-blue-50",
      "active:bg-blue-100",
      "focus:bg-blue-100",
      "cursor-pointer",
    ]);
  }
  const className = mergeClassNames(
    "py-2 px-4 flex",
    classList,
    props.className,
  );
  return <li {...componentProps} {...props} className={className} />;
}

export function ListItemContent(props: React.HTMLAttributes<HTMLDivElement>) {
  const className = mergeClassNames("flex-grow", props.className);
  return <div {...props} className={className} />;
}

export function ListItemTitle(props: React.HTMLAttributes<HTMLDivElement>) {
  const className = mergeClassNames("text-base font-bold", props.className);
  return <div {...props} className={className} />;
}

export function ListItemSubText(props: React.HTMLAttributes<HTMLDivElement>) {
  const className = mergeClassNames(
    "text-sm font-normal text-gray-600",
    props.className,
  );
  return <div {...props} className={className} />;
}

export function ListItemSecondaryAction(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const className = mergeClassNames(
    "ml-auto pl-2 flex items-center justify-center",
    props.className,
  );
  return <div {...props} className={className} />;
}
