import React from "react";

export type UsePaginationReturn<T> = {
  page: number;
  totalPages: number;
  slicedData: T[];
  setPage: (page: number) => void;
  setPageByIndex: (index: number) => void;
};

function mapToPageNumber(value: number, pageSize: number) {
  return Math.ceil(value / pageSize);
}

export default function usePagination<T>(
  data: T[] | null,
  pageSize: number = 3,
): UsePaginationReturn<T> {
  const [page, setPageNumber] = React.useState(1);

  const totalPages = data != null ? mapToPageNumber(data.length, pageSize) : 0;

  const slicedData = React.useMemo(() => {
    if (!data) return [];
    const startIndex = pageSize * (page - 1);
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, page, pageSize]);

  const setPage = React.useCallback(
    (page: number) => {
      const safePage = Math.max(1, Math.min(totalPages, page));
      setPageNumber(safePage);
    },
    [setPageNumber, totalPages],
  );

  const setPageByIndex = React.useCallback(
    (index: number) => {
      const page = mapToPageNumber(index + 1, pageSize);
      setPage(page);
    },
    [pageSize, setPage],
  );

  React.useEffect(() => {
    if (totalPages !== 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages, setPage]);

  return {
    page,
    totalPages,
    slicedData,
    setPage,
    setPageByIndex,
  };
}
