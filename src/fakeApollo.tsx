import { useCallback, useContext } from "react";
import { useEffect } from "react";
import { Dispatch, SetStateAction, useState } from "react";
import { createContext } from "react";
import { v4 as uuid } from "uuid";

import { noop } from "./utils";

type Data = {
  title: string;
  id: string;
  description?: string;
};

const FakeAPIContext = createContext<
  [Data[], Dispatch<SetStateAction<Data[]>>]
>([[], noop]);

export const FakeAPIProvider = (
  props: React.PropsWithChildren<{
    initialState: Data[];
  }>,
) => {
  const state = useState(props.initialState);
  return (
    <FakeAPIContext.Provider value={state}>
      {props.children}
    </FakeAPIContext.Provider>
  );
};

const useFakeLoading = () => {
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));
    setLoading(false);
  }, []);
  return { load, loading };
};

export const useDataQuery = () => {
  const [data] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  useEffect(() => {
    load();
  }, [load]);
  return { data: loading ? null : data, loading };
};

export function useCreateDataMutation(): [
  (props: { data: Omit<Data, "id"> }) => any,
  { loading: boolean },
] {
  const [, setData] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  return [
    async ({ data }) => {
      return load().then(() => {
        setData((prev) => [...prev, { ...data, id: uuid() }]);
      });
    },
    { loading },
  ];
}

export function useRemoveDataMutation(): [
  (props: { id: string }) => any,
  { loading: boolean },
] {
  const [, setData] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  return [
    async ({ id }) => {
      return load().then(() => {
        setData((prev) => prev.filter((x) => x.id !== id));
      });
    },
    { loading },
  ];
}

export function useUpdateDataMutation(): [
  (props: { data: Data; id: string }) => any,
  { loading: boolean },
] {
  const [, setData] = useContext(FakeAPIContext);
  const { load, loading } = useFakeLoading();
  return [
    async ({ data, id }) => {
      return load().then(() => {
        setData((prev) =>
          prev.map((x) => (x.id === id ? { ...x, ...data } : x)),
        );
      });
    },
    { loading },
  ];
}
