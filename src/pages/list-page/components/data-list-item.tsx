import { TrashIcon } from "@heroicons/react/outline";
import React from "react";

import {
  ListItem,
  ListItemContent,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemSubText,
  ListItemTitle,
} from "../../../components/list";
import { Spinner } from "../../../components/spinner";
import { Data, useRemoveDataMutation } from "../../../fakeApollo";
import { useUndoActions } from "../../../hooks/useUndo";

export default function DataListItem({
  data,
  ...props
}: ListItemProps & { data: Data }): React.ReactElement {
  const [deleteData, { loading: isDeleting }] = useRemoveDataMutation();
  const { addUndoItem } = useUndoActions();

  const handleDelete = async () => {
    try {
      await deleteData({ id: data.id });
      addUndoItem(data);
    } catch {
      // deletion failed, don't add to undo list
    }
  };

  const className = `transition-opacity ${
    isDeleting ? "opacity-50 pointer-events-none" : ""
  }`;
  return (
    <ListItem button className={className} {...props}>
      <ListItemContent>
        <ListItemTitle>{data.title}</ListItemTitle>
        {data.description && (
          <ListItemSubText>{data.description}</ListItemSubText>
        )}
      </ListItemContent>
      <ListItemSecondaryAction>
        {isDeleting ? (
          <Spinner className="w-4 h-4 text-gray-600 m-1" />
        ) : (
          <button
            className="group p-1 rounded text-gray-600 bg-transparent hover:text-gray-600 hover:bg-red-100 active:bg-red-300"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            tabIndex={-1}
          >
            <TrashIcon className="group-hover:text-red-500 w-4 h-4" />
          </button>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
