import React from "react";

/**
 * Inspired by Dan Abramov's `useInterval` hook from this article:
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export default function useTimeout(callback: () => void, delay: number | null) {
  const timeoutRef = React.useRef<number | undefined>();
  // Store a callback reference
  const savedCallback = React.useRef(callback);

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout.
  React.useEffect(() => {
    const tick = () => savedCallback.current();
    if (delay !== null) {
      timeoutRef.current = window.setTimeout(tick, delay);
      return () => {
        window.clearTimeout(timeoutRef.current);
      };
    }
  }, [delay]);
}
