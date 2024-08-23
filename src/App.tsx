import { useState } from "react"
import KanbanBoard from "./components/KanbanBoard/KanbanBoard"
import { KanbanBoardType } from "./components/types/KanbanBoardType"
import { KanbanColumnType } from "./components/types/KanbanColumnType";
import { UniqueIdentifier } from "@dnd-kit/core";
import { v4 as uniqueId } from "uuid";

export default function App() {
  const [kanbanBoard, setKanbanBoard] = useState<KanbanBoardType>({
    title: 'Drag-and-drop Kanban example',
    columns: [
      {
        id: 'column-1',
        title: 'To Do',
        cards: [
          { id: 'card-1', title: 'Prepare dinner' },
          { id: 'card-2', title: 'Buy groceries' },
          { id: 'card-3', title: 'Clean house' },
        ]
      },
      {
        id: 'column-2',
        title: 'Doing',
        cards: [
          { id: 'card-4', title: 'Exercise routine' },
          { id: 'card-5', title: 'Listen music' },
        ]
      },
      {
        id: 'column-3',
        title: 'Review',
        cards: [
          { id: 'card-6', title: 'Check dog\'s food' },
        ]
      },
      {
        id: 'column-4',
        title: 'Concluded',
        cards: [
          { id: 'card-7', title: 'Take children to school' },
          { id: 'card-8', title: 'Coffee break' },
        ]
      }
    ]
  })

  function handleUpdateTitle(newTitle: string) {
    setKanbanBoard((oldBoard) => ({
      ...oldBoard,
      title: newTitle,
    }));
  }

  function handleAddColumn() {
    setKanbanBoard((oldBoard) => ({
      ...oldBoard,
      columns: [...oldBoard.columns, { id: uniqueId(), title: 'New column', cards: [] }]
    }));
  }

  function handleDeleteColumn(columnId: UniqueIdentifier) {
    setKanbanBoard((oldBoard) => ({
      ...oldBoard,
      columns: oldBoard.columns.filter((column) => column.id !== columnId)
    }));
  }

  function handleUpdateColumn(newColumn: KanbanColumnType) {
    setKanbanBoard((oldBoard) => ({
      ...oldBoard,
      columns: oldBoard.columns.map((column) => column.id === newColumn.id ? newColumn : column)
    }));
  }

  return (
    <>
      <KanbanBoard
        board={kanbanBoard}
        onUpdateTitle={handleUpdateTitle}
        onAddColumn={handleAddColumn}
        onDeleteColumn={handleDeleteColumn}
        onUpdateColumn={handleUpdateColumn}
        />
    </>
  )
}
