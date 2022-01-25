import React from "react";

import { noop } from "../utils";

const FocusItemContext = React.createContext<{
  focusItemId?: string;
  setFocusItemId: (id: string) => void;
}>({
  setFocusItemId: noop,
});

export const useFocusItemContext = () => React.useContext(FocusItemContext);

export function FocusItemContextProvider(props: React.PropsWithChildren<{}>) {
  const [focusItemId, setFocusItemId] = React.useState<string>();
  return (
    <FocusItemContext.Provider value={{ focusItemId, setFocusItemId }}>
      {props.children}
    </FocusItemContext.Provider>
  );
}
