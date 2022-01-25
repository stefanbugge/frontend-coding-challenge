import React from "react";

import useTimeout from "./useTimeout";

type UseUndoDeleteOptions<T> = {
  // the time-to-live for undoable items.
  ttl: number;
  /**
   * callback when `deleteItem` is invoked
   * If the callback is successful the item will be added to the undo list
   */
  onDelete: (item: T) => Promise<void>;
  /**
   * callback when `undoDeleteItem` is invoked.
   * The latest item of the undo list, if any, will be removed from the undo list
   * and given as a parameter to this callback.
   */
  onUndo: (item: T) => Promise<void>;
};

type UseUndoDeleteReturn<T> = {
  // Delete item
  deleteItem: (item: T) => void;
  // Undo last call to the `deleteItem`
  undoDeleteItem: () => void;
  // Number of undoable items
  size: number;
};

type UndoItem<T> = {
  timestamp: number;
  data: T;
};

export function useUndoDeleteDecorator<T>(
  options: UseUndoDeleteOptions<T>,
): UseUndoDeleteReturn<T> {
  const optionsRef = React.useRef(options);
  const [undoList, setUndoList] = React.useState<UndoItem<T>[]>([]);

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
    return Math.max(0, optionsRef.current.ttl - diff);
  }, [undoList]);

  useTimeout(() => {
    /**
     * Clean up time:
     * Remove all items from the undo list which have "expired".
     */
    const now = Date.now();
    setUndoList((list) => {
      return list.filter((x) => now - x.timestamp < options.ttl);
    });
  }, delay);

  return React.useMemo(() => {
    return {
      deleteItem: async (item) => {
        try {
          await optionsRef.current.onDelete(item);
          setUndoList((list) =>
            list.concat({
              timestamp: Date.now(),
              data: item,
            }),
          );
        } catch {
          // onDelete failed, dont't add to undo-list
        }
      },
      undoDeleteItem: () => {
        const newList = [...undoList];
        const lastItem = newList.pop();
        setUndoList(newList);
        if (lastItem === undefined) {
          return;
        }
        optionsRef.current.onUndo(lastItem.data);
      },
      size: undoList.length,
    };
  }, [undoList, setUndoList]);
}
