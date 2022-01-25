import React from "react";

import { noop } from "../../../utils";

export type FormState = {
  title: string;
  description?: string;
};

export enum FormActionKind {
  SetTitle = "SET_TITLE",
  SetDescription = "SET_DESCRIPTION",
}

export type FormAction = {
  type: FormActionKind;
  payload: string;
};

function formStateReducer(state: FormState, action: FormAction) {
  switch (action.type) {
    case FormActionKind.SetTitle: {
      return {
        ...state,
        title: action.payload,
      };
    }
    case FormActionKind.SetDescription: {
      return {
        ...state,
        description: action.payload,
      };
    }
    default:
      return state;
  }
}

const defaultState: FormState = {
  title: "",
  description: "",
};

const FormStateContext = React.createContext<FormState>(defaultState);
const FormDispatchContext =
  React.createContext<React.Dispatch<FormAction>>(noop);

export const useFormStateContext = () => React.useContext(FormStateContext);
export const useFormDispatchContext = () =>
  React.useContext(FormDispatchContext);

export type DataFormProps = {
  initialData?: Partial<FormState>;
  onSubmit: (data: FormState) => Promise<void>;
};

export function FormProvider({
  onSubmit,
  initialData,
  children,
}: React.PropsWithChildren<DataFormProps>) {
  const [state, dispatch] = React.useReducer(formStateReducer, {
    ...defaultState,
    ...initialData,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // validation
    onSubmit(state);
  };

  return (
    <FormStateContext.Provider value={state}>
      <FormDispatchContext.Provider value={dispatch}>
        <form onSubmit={handleSubmit}>{children}</form>
      </FormDispatchContext.Provider>
    </FormStateContext.Provider>
  );
}
