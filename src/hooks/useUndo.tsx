import React from "react";

import { noop } from "../utils";
import useCallbackRef from "./useCallbackRef";
import useTimeout from "./useTimeout";

type UndoItem<T = unknown> = {
  timestamp: number;
  data: T;
};

const UndoListContext = React.createContext<UndoItem[]>([]);
const UndoActionsContext = React.createContext<{
  addUndoItem: (item: any) => void;
  undo: () => void;
}>({
  addUndoItem: noop,
  undo: noop,
});

export const useUndoList = () => React.useContext(UndoListContext);
export const useUndoActions = () => React.useContext(UndoActionsContext);

type UndoProviderProps<T> = {
  ttl?: number;
  onUndo: (item: T) => void;
};

export function UndoProvider<T>({
  ttl = 10_000,
  onUndo,
  children,
}: React.PropsWithChildren<UndoProviderProps<T>>) {
  const [undoList, setUndoList] = React.useState<UndoItem<T>[]>([]);
  const onUndoRef = useCallbackRef(onUndo);

  /**
   * We will only have single timeout running at all time which
   * will be targeted at the expiration time of the oldest undo item in the list.
   *
   * Calculate how many milliseconds from now do we need to purge an
   * entry from the undo list.
   */
  const delay = React.useMemo(() => {
    if (undoList.length === 0) return null;
    const now = Date.now();
    // Select the oldest item from the undo list, i.e. the first entry
    const oldestItem = undoList[0];
    // Calculate the timeout seconds from now based on the time-to-live option
    const diff = now - oldestItem.timestamp;
    return Math.max(0, ttl - diff);
  }, [undoList, ttl]);

  useTimeout(() => {
    /**
     * Clean up time:
     * Remove all items from the undo list which have "expired".
     */
    const now = Date.now();
    setUndoList((list) => {
      return list.filter((x) => now - x.timestamp < ttl);
    });
  }, delay);

  const actions = React.useMemo<React.ContextType<typeof UndoActionsContext>>(
    () => ({
      addUndoItem: (item: T) => {
        setUndoList((list) =>
          list.concat({
            timestamp: Date.now(),
            data: item,
          }),
        );
      },
      undo: () => {
        const newList = [...undoList];
        const lastItem = newList.pop();
        setUndoList(newList);
        if (lastItem === undefined) {
          return;
        }
        onUndoRef.current(lastItem.data);
      },
    }),
    [undoList, onUndoRef],
  );

  return (
    <UndoListContext.Provider value={undoList}>
      <UndoActionsContext.Provider value={actions}>
        {children}
      </UndoActionsContext.Provider>
    </UndoListContext.Provider>
  );
}
