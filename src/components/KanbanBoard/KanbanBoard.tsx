import styles from "./KanbanBoard.module.css"
import KanbanColumn from "../KanbanColumn/KanbanColumn"
import { KanbanBoardType } from "../types/KanbanBoardType"
import { KanbanColumnType } from "../types/KanbanColumnType";
import { KanbanCardType } from "../types/KanbanCardType";
import { Add, Check, Close, Edit } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { v4 as uniqueId } from "uuid";

type KanbanBoardProps = {
  board: KanbanBoardType
  onUpdateTitle: (newTitle: string) => void
  onAddColumn: () => void
  onDeleteColumn: (columnId: UniqueIdentifier) => void
  onUpdateColumn: (columnId: UniqueIdentifier, newColumn: KanbanColumnType) => void
}

export default function KanbanBoard({
  board,
  onUpdateTitle,
  onAddColumn,
  onDeleteColumn,
  onUpdateColumn
}: KanbanBoardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  function handleUpdateTitle() {
    if (inputRef.current) {
      const newTitle = inputRef.current.value
      onUpdateTitle(newTitle)
    }

    setIsEditing(false)
  }

  function handleUpdateColumnTitle(columnId: UniqueIdentifier, newTitle: string) {
    const oldColumn = board.columns.find(column => column.id === columnId)
    if (oldColumn) {
      const newColumn = { ...oldColumn, title: newTitle }
      onUpdateColumn(columnId, newColumn)
    }
  }

  function handleAddColumn() {
    onAddColumn()
  }

  function handleDeleteColumn(columnId: UniqueIdentifier) {
    onDeleteColumn(columnId)
  }

  function handleAddCard(columnId: UniqueIdentifier) {
    const oldColumn = board.columns.find(column => column.id === columnId)
    if (oldColumn) {
      const newColumn = {
        ...oldColumn,
        cards: [ ...oldColumn.cards, { id: uniqueId(), title: 'New card' }]
      }
      onUpdateColumn(columnId, newColumn)
    }
  }

  function handleDeleteCard(columnId: UniqueIdentifier, cardId: UniqueIdentifier) {
    const oldColumn = board.columns.find(column => column.id === columnId)
    if (oldColumn) {
      const newColumn = {
        ...oldColumn,
        cards: oldColumn.cards.filter((card) => card.id !== cardId)
      }
      onUpdateColumn(columnId, newColumn)
    }
  }

  function handleUpdateCard(columnId: UniqueIdentifier, cardId: UniqueIdentifier, newCard: KanbanCardType) {
    const oldColumn = board.columns.find(column => column.id === columnId)
    if (oldColumn) {
      const newColumn = {
        ...oldColumn,
        cards: oldColumn.cards.map((card) => card.id === cardId ? newCard : card)
      }
      onUpdateColumn(columnId, newColumn)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        {isEditing ? (<>
            <input ref={inputRef} defaultValue={board.title} />
            <button onClick={handleUpdateTitle}><Check fontSize="inherit" /></button>
            <button onClick={() => setIsEditing(false)}><Close fontSize="inherit" /></button>
          </>) : (<>
            <label className={styles.titleText}>{board.title}</label>
            <button onClick={() => setIsEditing(true)}><Edit fontSize="inherit" /></button>
            <button onClick={handleAddColumn}>< Add fontSize="inherit" /></button> 
          </>)    
        }
      </div>
      <div className={styles.columnsContainer}>
        {board.columns.map((column) =>
          <KanbanColumn
            key={column.id}
            column={column}
            onUpdateTitle={handleUpdateColumnTitle}
            onDelete={handleDeleteColumn}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onUpdateCard={handleUpdateCard}    
          />
        )}
      </div>
    </div>
  )
}
