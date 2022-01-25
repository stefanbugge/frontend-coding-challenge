import React from "react";

export type UsePaginationReturn<T> = {
  page: number;
  totalPages: number;
  slicedData: T[];
  setPage: (page: number) => void;
};

export default function usePagination<T>(
  data: T[] | null,
  itemsPerPage: number = 3,
): UsePaginationReturn<T> {
  const [page, setPage] = React.useState(1);
  const totalPages = data != null ? Math.ceil(data.length / itemsPerPage) : 0;

  const slicedData = React.useMemo(() => {
    if (!data) return [];
    const startIndex = itemsPerPage * (page - 1);
    const endIndex = startIndex + itemsPerPage;
    return data?.slice(startIndex, endIndex);
  }, [data, page, itemsPerPage]);

  return {
    page,
    totalPages,
    slicedData,
    setPage: React.useCallback(
      (page: number) => {
        const safePage = Math.max(1, Math.min(totalPages, page));
        setPage(safePage);
      },
      [setPage, totalPages],
    ),
  };
}
