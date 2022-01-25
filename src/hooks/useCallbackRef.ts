import React from "react";

export default function useCallbackRef<T extends (...args: any[]) => any>(
  fn: T,
): React.MutableRefObject<T> {
  const ref = React.useRef(fn);
  React.useEffect(() => {
    ref.current = fn;
  });
  return ref;
}
