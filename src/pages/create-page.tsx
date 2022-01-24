import { useNavigate } from "react-router-dom";

import { Button } from "../components/button";
import { PageHeading } from "../components/typography/headings";
import { useCreateDataMutation } from "../fakeApollo";
import DataForm from "./components/form";
import { FormProvider, FormState } from "./components/form-provider";

export default function CreatePage() {
  const navigate = useNavigate();
  const [createData, { loading }] = useCreateDataMutation();
  const handleSubmit = async (state: FormState) => {
    try {
      await createData({ data: state });
      navigate("/");
    } catch {
      // Handle error
    }
  };

  return (
    <main>
      <PageHeading>Create Data Point</PageHeading>
      <FormProvider onSubmit={handleSubmit}>
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
            Create
          </Button>
        </div>
      </FormProvider>
    </main>
  );
}
