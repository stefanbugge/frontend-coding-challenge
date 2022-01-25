import { act, renderHook } from "@testing-library/react-hooks";

import usePagination from "./usePagination";

describe("usePagination", () => {
  it("should have total pages and current page", () => {
    const { result } = renderHook(() =>
      usePagination(["foo", "bar", "baz"], 2),
    );
    expect(result.current.page).toEqual(1);
    expect(result.current.totalPages).toEqual(2);
  });

  it("should slice data", () => {
    const { result } = renderHook(() =>
      usePagination(["foo", "bar", "baz"], 2),
    );
    expect(result.current.slicedData).toEqual(["foo", "bar"]);
  });

  it("should change page", () => {
    const { result } = renderHook(() =>
      usePagination(["foo", "bar", "baz"], 2),
    );
    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.slicedData).toEqual(["baz"]);
  });

  it("should not be possible to set an out of bounds page", () => {
    const { result } = renderHook(() =>
      usePagination(["foo", "bar", "baz"], 2),
    );

    act(() => {
      result.current.setPage(0);
    });
    expect(result.current.page).toEqual(1);

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toEqual(2);
  });
});

export {};
