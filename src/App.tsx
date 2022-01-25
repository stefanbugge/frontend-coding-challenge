import { TrashIcon } from "@heroicons/react/outline";
import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { Button } from "./components/button";
import {
  ListContainer,
  ListItem,
  ListItemContent,
  ListItemSecondaryAction,
  ListItemSubText,
  ListItemTitle,
} from "./components/list";
import { ListSkeleton } from "./components/skeletons";
import { PageSpinner } from "./components/spinner";
import { PageHeading } from "./components/typography/headings";
import {
  Data,
  FakeAPIProvider,
  useCreateDataMutation,
  useDataQuery,
  useRemoveDataMutation,
} from "./fakeApollo";
import { useUndoDeleteDecorator } from "./hooks/useUndoDeleteDecorator";
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
  const navigate = useNavigate();
  const { data, loading } = useDataQuery();

  const [removeData] = useRemoveDataMutation();
  const [createData] = useCreateDataMutation();

  const {
    deleteItem,
    undoDeleteItem,
    size: undoListSize,
  } = useUndoDeleteDecorator<Data>({
    ttl: 10_000,
    onDelete: (item) => removeData({ id: item.id }),
    onUndo: (item) => createData({ data: item }),
  });

  return (
    <div>
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
              <ListItem
                key={x.id}
                button
                onClick={() => navigate(`/edit/${x.id}`)}
              >
                <ListItemContent>
                  <ListItemTitle>{x.title}</ListItemTitle>
                  {x.description && (
                    <ListItemSubText>{x.description}</ListItemSubText>
                  )}
                </ListItemContent>
                <ListItemSecondaryAction>
                  <button
                    className="group p-1 rounded text-gray-600 bg-transparent hover:text-gray-600 hover:bg-red-100 active:bg-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(x);
                    }}
                    tabIndex={-1}
                  >
                    <TrashIcon className="group-hover:text-red-500 w-4 h-4" />
                  </button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </ListContainer>
        </ListSkeleton>
        <div className="mt-8 flex justify-between">
          <Button variant="primary" onClick={() => navigate("/new")}>
            New data point
          </Button>
          {undoListSize > 0 && (
            <Button onClick={() => undoDeleteItem()}>
              Undo ({undoListSize})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
