import { useNavigate } from "react-router-dom";

import { Button } from "../../components/button";
import { ListContainer } from "../../components/list";
import { Pagination } from "../../components/pagination";
import { ListSkeleton } from "../../components/skeletons";
import { PageHeading } from "../../components/typography/headings";
import { useDataQuery } from "../../fakeApollo";
import usePagination from "../../hooks/usePagination";
import DataListItem from "./components/data-list-item";
import UndoButton from "./components/undo-button";

export default function MainPage() {
  const navigate = useNavigate();
  const { data, loading } = useDataQuery();
  const { slicedData, totalPages, page, setPage } = usePagination(data, 3);
  return (
    <div>
      <PageHeading>Data points</PageHeading>
      <ListSkeleton isLoaded={!loading}>
        <ListContainer>
          {(!data || data.length === 0) && (
            <div className="text-xl text-gray-300 text-center p-4">
              List is empty
            </div>
          )}
          {slicedData.map((x) => (
            <DataListItem
              key={x.id}
              data={x}
              onClick={() => navigate(`/edit/${x.id}`)}
            />
          ))}
        </ListContainer>
      </ListSkeleton>
      <div className="flex justify-center mt-2">
        <Pagination totalPages={totalPages} page={page} onChange={setPage} />
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="primary" onClick={() => navigate("/new")}>
          New data point
        </Button>
        <UndoButton />
      </div>
    </div>
  );
}
