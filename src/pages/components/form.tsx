import {
  FormActionKind,
  useFormDispatchContext,
  useFormStateContext,
} from "./form-provider";

export default function DataForm() {
  const state = useFormStateContext();
  const dispatch = useFormDispatchContext();
  return (
    <>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={state.title}
          onChange={(e) => {
            dispatch({
              type: FormActionKind.SetTitle,
              payload: e.target.value,
            });
          }}
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          value={state.description}
          onChange={(e) => {
            dispatch({
              type: FormActionKind.SetDescription,
              payload: e.target.value,
            });
          }}
        />
      </div>
    </>
  );
}
