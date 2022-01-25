import { TrashIcon } from "@heroicons/react/outline";
import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { Button } from "./components/button";
import {
  ListContainer,
  ListItem,
  ListItemContent,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemSubText,
  ListItemTitle,
} from "./components/list";
import { ListSkeleton } from "./components/skeletons";
import { PageSpinner, Spinner } from "./components/spinner";
import { PageHeading } from "./components/typography/headings";
import {
  Data,
  useCreateDataMutation,
  useDataQuery,
  useRemoveDataMutation,
  withFakeAPIProvider,
} from "./fakeApollo";
import { UndoProvider, useUndoActions, useUndoList } from "./hooks/useUndo";
import { MainLayout } from "./layout";

const CreatePage = React.lazy(() => import("./pages/create-page"));
const EditPage = React.lazy(() => import("./pages/edit-page"));

export const App = withFakeAPIProvider(() => {
  const [createData] = useCreateDataMutation();

  const handleUndo = (item: Data) => {
    createData({ data: item });
  };
  return (
    <UndoProvider<Data> ttl={5_000} onUndo={handleUndo}>
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
    </UndoProvider>
  );
}, [
  { title: "Hello world", description: "Foo bar baz", id: uuid() },
  { title: "Some more data", id: uuid() },
]);

export default App;

function Main() {
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
        <UndoButton></UndoButton>
      </div>
    </div>
  );
}

function UndoButton() {
  const undoList = useUndoList();
  const { undo } = useUndoActions();
  if (undoList.length === 0) return null;
  return <Button onClick={() => undo()}>Undo ({undoList.length})</Button>;
}

function DataListItem({
  data,
  ...props
}: ListItemProps & { data: Data }): React.ReactElement {
  const [deleteData, { loading: isDeleting }] = useRemoveDataMutation();
  const { addUndoItem } = useUndoActions();

  const handleDelete = async () => {
    try {
      await deleteData({ id: data.id });
      addUndoItem(data);
    } catch {
      // deletion failed, don't add to undo list
    }
  };

  const className = `transition-opacity ${
    isDeleting ? "opacity-50 pointer-events-none" : ""
  }`;
  return (
    <ListItem button className={className} {...props}>
      <ListItemContent>
        <ListItemTitle>{data.title}</ListItemTitle>
        {data.description && (
          <ListItemSubText>{data.description}</ListItemSubText>
        )}
      </ListItemContent>
      <ListItemSecondaryAction>
        {isDeleting ? (
          <Spinner className="w-4 h-4 text-gray-600 m-1" />
        ) : (
          <button
            className="group p-1 rounded text-gray-600 bg-transparent hover:text-gray-600 hover:bg-red-100 active:bg-red-300"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            tabIndex={-1}
          >
            <TrashIcon className="group-hover:text-red-500 w-4 h-4" />
          </button>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
