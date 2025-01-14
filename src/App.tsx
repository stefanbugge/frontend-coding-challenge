import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { PageSpinner } from "./components/spinner";
import { useFocusItemContext } from "./contexts/focus-item-context";
import { Data, useCreateDataMutation, withFakeAPIProvider } from "./fakeApollo";
import { UndoProvider } from "./hooks/useUndo";
import { MainLayout } from "./layout";
import ListPage from "./pages/list-page";

const CreatePage = React.lazy(() => import("./pages/create-page"));
const EditPage = React.lazy(() => import("./pages/edit-page"));

const initialData = [
  { title: "Hello world", description: "Foo bar baz", id: uuid() },
  { title: "Some more data", id: uuid() },
  { title: "Funky Doodle", description: "Not so much", id: uuid() },
  { title: "Foobar ", id: uuid() },
  { title: "All the things", description: "Floop doop loop", id: uuid() },
  { title: "Guten heute leute", description: "Alles gut!", id: uuid() },
  { title: "Hola Mundo", description: "cómo estás", id: uuid() },
];

export const App = withFakeAPIProvider(() => {
  const [createData] = useCreateDataMutation();
  const { setFocusItemId: setFocusItem } = useFocusItemContext();
  const handleUndo = async (item: Data) => {
    try {
      const result = await createData({ data: item });
      setFocusItem(result.id);
    } catch {
      // nevermind
    }
  };
  return (
    <UndoProvider<Data> onUndo={handleUndo}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<ListPage />} />
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
}, initialData);

export default App;
