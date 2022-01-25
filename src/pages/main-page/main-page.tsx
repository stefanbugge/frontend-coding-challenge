import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/button";
import { ListContainer } from "../../components/list";
import { Pagination } from "../../components/pagination";
import { ListSkeleton } from "../../components/skeletons";
import { PageHeading } from "../../components/typography/headings";
import { useFocusItemContext } from "../../contexts/focus-item-context";
import { useDataQuery } from "../../fakeApollo";
import usePagination from "../../hooks/usePagination";
import DataListItem from "./components/data-list-item";
import UndoButton from "./components/undo-button";

export default function MainPage() {
  const { focusItemId, setFocusItemId } = useFocusItemContext();
  const navigate = useNavigate();
  const { data, loading } = useDataQuery();
  const { slicedData, totalPages, page, setPage, setPageByIndex } =
    usePagination(data, 3);

  const focusItemIndex = React.useMemo(() => {
    if (!data || !focusItemId) return undefined;
    const itemIndex = data.findIndex((x) => x.id === focusItemId);
    return itemIndex >= 0 ? itemIndex : undefined;
  }, [data, focusItemId]);

  React.useEffect(() => {
    if (focusItemIndex !== undefined) {
      setPageByIndex(focusItemIndex);
    }
  }, [focusItemIndex, setPageByIndex]);

  const hasData = data && data.length > 0;

  return (
    <div>
      <PageHeading>Data points</PageHeading>
      <ListSkeleton isLoaded={!loading}>
        <ListContainer>
          {!hasData && (
            <div className="text-xl text-gray-300 text-center p-4">
              List is empty
            </div>
          )}
          {slicedData.map((x) => (
            <DataListItem
              key={x.id}
              data={x}
              onClick={() => {
                setFocusItemId(x.id);
                navigate(`/edit/${x.id}`);
              }}
            />
          ))}
        </ListContainer>
      </ListSkeleton>
      {hasData && (
        <div className="flex justify-center mt-2">
          <Pagination totalPages={totalPages} page={page} onChange={setPage} />
        </div>
      )}
      <div className="mt-8 flex justify-between">
        <Button variant="primary" onClick={() => navigate("/new")}>
          New data point
        </Button>
        <UndoButton />
      </div>
    </div>
  );
}
