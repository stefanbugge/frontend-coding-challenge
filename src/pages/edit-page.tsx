import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../components/button";
import { PageHeading } from "../components/typography/headings";
import { useDataQuery, useUpdateDataMutation } from "../fakeApollo";
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
  const [updateData, { loading }] = useUpdateDataMutation();
  const handleSubmit = async (state: FormState) => {
    if (id == null) return;
    try {
      await updateData({ id, data: { id, ...state } });
      navigate("/");
    } catch {
      // Handle error
    }
  };

  return (
    <main>
      <PageHeading>Edit Data Point</PageHeading>
      <FormProvider initialData={initialFormState} onSubmit={handleSubmit}>
        <DataForm />
        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
          >
            Back
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Save
          </Button>
        </div>
      </FormProvider>
    </main>
  );
}
