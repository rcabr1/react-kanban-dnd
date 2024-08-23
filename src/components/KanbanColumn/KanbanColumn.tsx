import styles from "./KanbanColumn.module.css"
import KanbanCard from "../KanbanCard/KanbanCard"
import KanbanCardSkeleton from "../KanbanCard/KanbanCardSkeleton"
import { KanbanColumnType } from "../types/KanbanColumnType"
import { KanbanCardType } from "../types/KanbanCardType"
import { KanbanDraggableEnum } from "../types/KanbanDraggableEnum"
import { Add, Check, Close, Delete, Edit } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react"
import { DragOverlay, UniqueIdentifier } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";

type KanbanColumnProps = {
  column: KanbanColumnType
  onUpdateTitle: (columnId: UniqueIdentifier, newTitle: string) => void
  onDelete: (columnId: UniqueIdentifier) => void
  onAddCard: (columnId: UniqueIdentifier) => void
  onDeleteCard: (columnId: UniqueIdentifier, cardId: UniqueIdentifier) => void
  onUpdateCard: (columnId: UniqueIdentifier, cardId: UniqueIdentifier, newCard: KanbanCardType) => void
  overlayCard: KanbanCardType | null
}

export default function KanbanColumn({
  column,
  onUpdateTitle,
  onDelete,
  onAddCard,
  onDeleteCard,
  onUpdateCard,
  overlayCard,
}: KanbanColumnProps) {
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
    id: column.id,
    data: { type: KanbanDraggableEnum.COLUMN }
  })

  const dragStyle = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Translate.toString(transform),
    transition
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  function handleUpdateTitle(): void {
    if (inputRef.current) {
      const newTitle = inputRef.current.value
      onUpdateTitle(column.id, newTitle)
    }

    setIsEditing(false)
  }

  function handleDelete(): void {
    onDelete(column.id)
  }

  function handleUpdateCardTitle(cardId: UniqueIdentifier, newTitle: string): void {
    const oldCard = column.cards.find(card => card.id === cardId)

    if (!oldCard) return

    const newCard = { ...oldCard, title: newTitle }
    onUpdateCard(column.id, cardId, newCard)
  }

  function handleAddCard(): void {
    onAddCard(column.id)
  }

  function handleDeleteCard(cardId: UniqueIdentifier): void {
    onDeleteCard(column.id, cardId)
  }

  return (
    <div ref={setNodeRef} style={dragStyle} {...attributes} {...listeners} className={styles.container}>
      <div className={styles.titleContainer}>
        {isEditing ? (<>
            <input ref={inputRef} defaultValue={column.title} />
            <button onClick={handleUpdateTitle}><Check fontSize="inherit" /></button>
            <button onClick={() => setIsEditing(false)}><Close fontSize="inherit" /></button>
          </>) : (<>
            <span className={styles.titleText}>{column.title}</span>
            <button onClick={() => setIsEditing(true)}><Edit fontSize="inherit" /></button>
            <button onClick={handleDelete}>< Delete fontSize="inherit" /></button> 
          </>)    
        }
      </div>
      <div className={styles.cardsContainer}>
        <SortableContext
          items={column.cards.map(card => card.id)}
          strategy={verticalListSortingStrategy}
          >
          {column.cards.map((card) =>
            <KanbanCard
              key={card.id}
              card={card}
              onUpdateTitle={handleUpdateCardTitle}
              onDelete={handleDeleteCard}
            />
          )}
        </SortableContext>
        {overlayCard && (
          <DragOverlay>
              <KanbanCardSkeleton card={overlayCard} />
          </DragOverlay>
        )}
      </div>
      <button className={styles.addCardButton} onClick={handleAddCard}><Add /></button>
    </div>
  )
}
