import { XIcon } from "@heroicons/react/outline";
import React from "react";

import mergeClassNames from "../../utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className: classNameProp, ...props }, ref): React.ReactElement => {
  const className = mergeClassNames(
    "px-3 py-2 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500",
    classNameProp,
  );
  return <input ref={ref} type="text" className={className} {...props} />;
});

export interface ClearableInputProps
  extends React.ComponentProps<typeof Input> {
  onClearInput: (e: React.MouseEvent) => void;
}

export function ClearableInput({
  onClearInput,
  ...props
}: ClearableInputProps): React.ReactElement {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const showClearBtn =
    props.value !== undefined && String(props.value).length > 0;

  return (
    <div className="relative flex w-full">
      <Input ref={inputRef} {...props} />
      {showClearBtn && (
        <span className="h-full absolute bg-transparent flex items-center justify-center w-8 right-0 pr-3 py-3">
          <div
            role="button"
            className="p-1 rounded text-gray-600 bg-transparent hover:text-gray-600 hover:bg-gray-200 active:bg-gray-400"
            onClick={(e) => {
              e.preventDefault();
              onClearInput(e);
              inputRef.current?.focus();
            }}
            tabIndex={-1}
          >
            <XIcon className="w-4 h-4" />
          </div>
        </span>
      )}
    </div>
  );
}
