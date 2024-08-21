import styles from "./KanbanCard.module.css"
import { KanbanCardType } from "../types/KanbanCardType"
import { Check, Close, Delete, Edit } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react"
import { UniqueIdentifier } from "@dnd-kit/core"

type KanbanCardProps = {
  card: KanbanCardType
  onUpdateTitle: (cardId: UniqueIdentifier, newTitle: string) => void
  onDelete: (cardId: UniqueIdentifier) => void

}

export default function KanbanCard({
  card,
  onUpdateTitle,
  onDelete
}: KanbanCardProps) {
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
      onUpdateTitle(card.id, newTitle)
    }

    setIsEditing(false)
  }

  function handleDelete() {
    onDelete(card.id)
  }

  return (
    <div className={styles.container}>
      {isEditing ? (<>
          <input ref={inputRef} defaultValue={card.title} />
          <button onClick={handleUpdateTitle}><Check fontSize="inherit" /></button>
          <button onClick={() => setIsEditing(false)}><Close fontSize="inherit" /></button>
        </>) : (<>
          <label className={styles.titleText}>{card.title}</label>
          <button onClick={() => setIsEditing(true)}><Edit fontSize="inherit" /></button>
          <button onClick={handleDelete}>< Delete fontSize="inherit" /></button> 
        </>)    
      }
    </div>
  )
}
