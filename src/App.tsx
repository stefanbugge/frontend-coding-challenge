import { XIcon } from "@heroicons/react/outline";
import React, { useCallback } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { ListSkeleton } from "./components/skeletons";
import { PageSpinner } from "./components/spinner";
import { PageHeading } from "./components/typography/headings";
import {
  FakeAPIProvider,
  useDataQuery,
  useRemoveDataMutation,
} from "./fakeApollo";
import { MainLayout } from "./layout";

const CreatePage = React.lazy(() => import("./pages/create-page"));
const EditPage = React.lazy(() => import("./pages/edit-page"));

export default function App() {
  return (
    <FakeAPIProvider
      initialState={[
        { title: "Hello world", description: "Foo bar baz", id: uuid() },
        { title: "Some more data", id: uuid() },
      ]}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Main />} />
            <Route
              path="new"
              element={
                <React.Suspense fallback={<PageSpinner />}>
                  <CreatePage />
                </React.Suspense>
              }
            />
            <Route
              path="edit/:id"
              element={
                <React.Suspense fallback={<PageSpinner />}>
                  <EditPage />
                </React.Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
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
                <Link to={`/edit/${x.id}`}>Edit</Link>
              </li>
            ))}
          </ul>
        </ListSkeleton>
        <Link to="/new">Add new</Link>
      </div>
    </div>
  );
}
