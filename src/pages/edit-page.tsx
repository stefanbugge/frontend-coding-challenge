import { useParams } from "react-router-dom";

import { PageHeading } from "../components/typography/headings";

export default function EditPage() {
  let params = useParams();
  return (
    <main>
      <PageHeading>Edit Data Point</PageHeading>
      <div>{params.id}</div>
    </main>
  );
}
