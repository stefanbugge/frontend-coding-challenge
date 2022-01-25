import { act, render } from "@testing-library/react";

import {
  ActionsContext,
  UndoProvider,
  useUndoActions,
  useUndoList,
} from "./useUndo";

function UndoActionsContextHelper({ spy }: { spy: jest.Mock }) {
  const contextData = useUndoActions();
  spy(contextData);
  return null;
}

function UndoListContextHelper({ spy }: { spy: jest.Mock }) {
  const contextData = useUndoList();
  spy(contextData);
  return null;
}

describe("UndoProvider", () => {
  it("should not call `onUndo` when undo list is empty", () => {
    const onUndo = jest.fn();
    const actionsContextCallback = jest.fn();
    const listContextCallback = jest.fn();
    render(
      <UndoProvider onUndo={onUndo}>
        <UndoActionsContextHelper spy={actionsContextCallback} />
        <UndoListContextHelper spy={listContextCallback} />
      </UndoProvider>,
    );

    // Assert undo list state
    expect(listContextCallback.mock.calls[0][0]).toEqual([]);

    act(() => {
      const actions = actionsContextCallback.mock.calls[0][0];
      actions.undo();
    });
    expect(onUndo).not.toHaveBeenCalled();
  });

  it("should call `onUndo` prop when an undo is triggered", () => {
    const systemTime = new Date("2022-01-01").getTime();
    jest.useFakeTimers("modern").setSystemTime(systemTime);

    const onUndo = jest.fn();
    const actionsContextCallback = jest.fn();
    const listContextCallback = jest.fn();

    render(
      <UndoProvider onUndo={onUndo}>
        <UndoActionsContextHelper spy={actionsContextCallback} />
        <UndoListContextHelper spy={listContextCallback} />
      </UndoProvider>,
    );

    const item = { title: "test" };

    // Add an item to the undo provider
    act(() => {
      const actions = actionsContextCallback.mock.calls[0][0] as ActionsContext;
      actions.addUndoItem(item);
    });

    // Assert undo list state
    expect(listContextCallback.mock.calls[1][0]).toEqual([
      { data: item, timestamp: systemTime },
    ]);

    // Call undo
    act(() => {
      const actions = actionsContextCallback.mock.calls[1][0] as ActionsContext;
      actions.undo();
    });

    // Assert `unUndo` to have been
    expect(onUndo).toHaveBeenCalledWith(item);
  });

  it("should purge expired undo items", () => {
    const systemTime = new Date("2022-01-01").getTime();
    jest.useFakeTimers("modern").setSystemTime(systemTime);

    const onUndo = jest.fn();
    const actionsContextCallback = jest.fn();
    const listContextCallback = jest.fn();

    render(
      <UndoProvider onUndo={onUndo} ttl={1000}>
        <UndoActionsContextHelper spy={actionsContextCallback} />
        <UndoListContextHelper spy={listContextCallback} />
      </UndoProvider>,
    );

    // Add an item to the undo provider
    act(() => {
      const actions = actionsContextCallback.mock.calls[0][0] as ActionsContext;
      actions.addUndoItem({ title: "test" });
    });

    // Assert undo list state
    expect(listContextCallback.mock.calls[1][0].length).toEqual(1);

    // Advance timers by less than the TTL
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // assert item not to have expired yet
    expect(listContextCallback.mock.calls[1][0].length).toEqual(1);

    // Advance timers again to exceed the TTL
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // Assert item to have expired
    expect(listContextCallback.mock.calls[2][0].length).toEqual(0);
  });
});

export {};
