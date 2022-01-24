import { XIcon } from "@heroicons/react/outline";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { ListSkeleton } from "./components/skeletons";
import { PageHeading } from "./components/typography/headings";
import {
  FakeAPIProvider,
  useDataQuery,
  useRemoveDataMutation,
} from "./fakeApollo";

export default function App() {
  return (
    <FakeAPIProvider
      initialState={[
        { title: "Hello world", description: "Foo bar baz", id: uuid() },
        { title: "Some more data", id: uuid() },
      ]}
    >
      <Main />
    </FakeAPIProvider>
  );
}

function Main() {
  const { data, loading } = useDataQuery();

  const [remove] = useRemoveDataMutation();
  const handleRemove = useCallback(
    (id: string) => {
      remove({ id });
    },
    [remove],
  );

  const handleAdd = useCallback(() => {
    alert("not implemeted");
  }, []);

  return (
    <div>
      <div>
        <PageHeading className="text-2xl font-bold">Data points</PageHeading>
        <ListSkeleton isLoaded={!loading}>
          <ul>
            {data?.map((x) => (
              <li key={x.id} className="flex items-center space-x-2">
                <span>{x.title}</span>
                {x.description && <div>{x.description}</div>}
                <button onClick={() => handleRemove(x.id)}>
                  <XIcon className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </ListSkeleton>
        <Link to="/new">Add new</Link>
      </div>
    </div>
  );
}
