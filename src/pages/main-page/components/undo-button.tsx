import React from "react";

import { Button } from "../../../components/button";
import { useUndoActions, useUndoList } from "../../../hooks/useUndo";

export default function UndoButton() {
  const undoList = useUndoList();
  const { undo } = useUndoActions();
  if (undoList.length === 0) return null;
  return <Button onClick={() => undo()}>Undo ({undoList.length})</Button>;
}
