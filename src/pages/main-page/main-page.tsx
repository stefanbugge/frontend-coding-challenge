import { useNavigate } from "react-router-dom";

import { Button } from "../../components/button";
import { ListContainer } from "../../components/list";
import { ListSkeleton } from "../../components/skeletons";
import { PageHeading } from "../../components/typography/headings";
import { useDataQuery } from "../../fakeApollo";
import DataListItem from "./components/data-list-item";
import UndoButton from "./components/undo-button";

export default function MainPage() {
  const navigate = useNavigate();
  const { data, loading } = useDataQuery();
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
          {data?.map((x) => (
            <DataListItem
              key={x.id}
              data={x}
              onClick={() => navigate(`/edit/${x.id}`)}
            />
          ))}
        </ListContainer>
      </ListSkeleton>
      <div className="mt-8 flex justify-between">
        <Button variant="primary" onClick={() => navigate("/new")}>
          New data point
        </Button>
        <UndoButton />
      </div>
    </div>
  );
}
