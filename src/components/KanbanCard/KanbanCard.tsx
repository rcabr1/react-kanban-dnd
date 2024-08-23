import styles from "./KanbanCard.module.css"
import { KanbanCardType } from "../types/KanbanCardType"
import { Check, Close, Delete, Edit } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react"
import { UniqueIdentifier } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";
import { KanbanDraggableEnum } from "../types/KanbanDraggableEnum"

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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card.id,
    data: { type: KanbanDraggableEnum.CARD }
  })

  const dragStyle = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Translate.toString(transform),
    transition
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  function handleUpdateTitle(): void {
    if (inputRef.current) {
      const newTitle = inputRef.current.value
      onUpdateTitle(card.id, newTitle)
    }

    setIsEditing(false)
  }

  function handleDelete(): void {
    onDelete(card.id)
  }

  return (
    <div ref={setNodeRef} style={dragStyle} {...attributes} {...listeners} className={styles.container}>
      {isEditing ? (<>
          <input ref={inputRef} defaultValue={card.title} />
          <button onClick={handleUpdateTitle}><Check fontSize="inherit" /></button>
          <button onClick={() => setIsEditing(false)}><Close fontSize="inherit" /></button>
        </>) : (<>
          <span className={styles.titleText}>{card.title}</span>
          <button onClick={() => setIsEditing(true)}><Edit fontSize="inherit" /></button>
          <button onClick={handleDelete}>< Delete fontSize="inherit" /></button> 
        </>)    
      }
    </div>
  )
}
