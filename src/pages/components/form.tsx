import React from "react";

import { ClearableInput } from "../../components/input";
import {
  FormActionKind,
  useFormDispatchContext,
  useFormStateContext,
} from "./form-provider";

export default function DataForm() {
  const state = useFormStateContext();
  const dispatch = useFormDispatchContext();

  const handleUpdateTitle = (value: string) => {
    dispatch({
      type: FormActionKind.SetTitle,
      payload: value,
    });
  };

  const handleUpdateDescription = (value: string) => {
    dispatch({
      type: FormActionKind.SetDescription,
      payload: value,
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <ClearableInput
          id="title"
          value={state.title}
          onChange={(e) => handleUpdateTitle(e.target.value)}
          onClearInput={() => handleUpdateTitle("")}
          required
          minLength={3}
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <ClearableInput
          type="text"
          id="description"
          value={state.description}
          onChange={(e) => handleUpdateDescription(e.target.value)}
          onClearInput={() => handleUpdateDescription("")}
        />
      </div>
    </div>
  );
}
