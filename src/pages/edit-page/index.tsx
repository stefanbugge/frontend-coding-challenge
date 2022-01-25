import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../../components/button";
import { PageSpinner } from "../../components/spinner";
import { PageHeading } from "../../components/typography/headings";
import {
  Data,
  useDataQuery,
  useRemoveDataMutation,
  useUpdateDataMutation,
} from "../../fakeApollo";
import { useUndoActions } from "../../hooks/useUndo";
import DataForm from "../create-page/components/form";
import {
  FormProvider,
  FormState,
} from "../create-page/components/form-provider";

/**
 * Resolve data by id before rendering the page
 */
export default function EditPageWrapper() {
  const [data, setData] = React.useState<Data>();
  let { id } = useParams();
  const { data: dataList } = useDataQuery();

  React.useEffect(() => {
    if (data !== undefined) {
      // data already resolved
      return;
    }
    if (!id) {
      return;
    }
    const result = (dataList ?? []).find((x) => x.id === id);
    if (result) {
      setData(result);
    }
  }, [id, data, dataList]);

  if (!data) return <PageSpinner />;
  return <EditPage data={data} />;
}

type EditPageProps = {
  data: Data;
};

function EditPage({ data }: EditPageProps) {
  const { id } = data;

  const navigate = useNavigate();
  const [updateData, { loading: isUpdating }] = useUpdateDataMutation();
  const [deleteData, { loading: isDeleting }] = useRemoveDataMutation();
  const { addUndoItem } = useUndoActions();

  const handleSubmit = async (state: FormState) => {
    if (id == null) return;
    try {
      await updateData({ id, data: { id, ...state } });
      navigate("/");
    } catch {
      // Handle error
    }
  };

  const handleDelete = async () => {
    if (id == null) return;
    try {
      await deleteData({ id });
      addUndoItem(data);
      navigate("/", { replace: true });
    } catch {
      // Handle error
    }
  };

  return (
    <main>
      <div className="flex spacing-x-4">
        <PageHeading>Edit Data Point</PageHeading>
        <div className="ml-auto">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
          >
            Back
          </Button>
        </div>
      </div>
      <FormProvider initialData={data} onSubmit={handleSubmit}>
        <DataForm />
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="danger"
            onClick={() => handleDelete()}
            isLoading={isDeleting}
          >
            Delete
          </Button>
          <Button type="submit" variant="primary" isLoading={isUpdating}>
            Save
          </Button>
        </div>
      </FormProvider>
    </main>
  );
}
