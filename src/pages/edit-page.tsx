import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../components/button";
import { PageHeading } from "../components/typography/headings";
import {
  useDataQuery,
  useRemoveDataMutation,
  useUpdateDataMutation,
} from "../fakeApollo";
import DataForm from "./components/form";
import { FormProvider, FormState } from "./components/form-provider";

export default function EditPage() {
  let { id } = useParams();
  const { data } = useDataQuery();

  const initialFormState = React.useMemo(() => {
    if (id == null) return undefined;
    return (data ?? []).find((x) => x.id === id);
  }, [id, data]);

  const navigate = useNavigate();
  const [updateData, { loading: isUpdating }] = useUpdateDataMutation();
  const [deleteData, { loading: isDeleting }] = useRemoveDataMutation();

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
      <FormProvider initialData={initialFormState} onSubmit={handleSubmit}>
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
