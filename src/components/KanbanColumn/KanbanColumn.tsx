import styles from "./KanbanColumn.module.css"
import KanbanCard from "../KanbanCard/KanbanCard"
import { KanbanColumnType } from "../types/KanbanColumnType"
import { KanbanCardType } from "../types/KanbanCardType"
import { Add, Check, Close, Delete, Edit } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react"
import { UniqueIdentifier } from "@dnd-kit/core"

type KanbanColumnProps = {
  column: KanbanColumnType
  onUpdateTitle: (columnId: UniqueIdentifier, newTitle: string) => void
  onDelete: (columnId: UniqueIdentifier) => void
  onAddCard: (columnId: UniqueIdentifier) => void
  onDeleteCard: (columnId: UniqueIdentifier, cardId: UniqueIdentifier) => void
  onUpdateCard: (columnId: UniqueIdentifier, cardId: UniqueIdentifier, newCard: KanbanCardType) => void
}

export default function KanbanColumn({
  column,
  onUpdateTitle,
  onDelete,
  onAddCard,
  onDeleteCard,
  onUpdateCard
}: KanbanColumnProps) {
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
      onUpdateTitle(column.id, newTitle)
    }

    setIsEditing(false)
  }

  function handleDelete() {
    onDelete(column.id)
  }

  function handleUpdateCardTitle(cardId: UniqueIdentifier, newTitle: string) {
    const oldCard = column.cards.find(card => card.id === cardId)
    if (oldCard) {
      const newCard = { ...oldCard, title: newTitle }
      onUpdateCard(column.id, cardId, newCard)
    }
  }

  function handleAddCard() {
    onAddCard(column.id)
  }

  function handleDeleteCard(cardId: UniqueIdentifier) {
    onDeleteCard(column.id, cardId)
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        {isEditing ? (<>
            <input ref={inputRef} defaultValue={column.title} />
            <button onClick={handleUpdateTitle}><Check fontSize="inherit" /></button>
            <button onClick={() => setIsEditing(false)}><Close fontSize="inherit" /></button>
          </>) : (<>
            <label className={styles.titleText}>{column.title}</label>
            <button onClick={() => setIsEditing(true)}><Edit fontSize="inherit" /></button>
            <button onClick={handleDelete}>< Delete fontSize="inherit" /></button> 
          </>)    
        }
      </div>
      <div className={styles.cardsContainer}>
          {column.cards.map((card) =>
            <KanbanCard
              key={card.id}
              card={card}
              onUpdateTitle={handleUpdateCardTitle}
              onDelete={handleDeleteCard}
            />
          )}
        <button className={styles.addCardButton} onClick={handleAddCard}><Add /></button>
      </div>
    </div>
  )
}
