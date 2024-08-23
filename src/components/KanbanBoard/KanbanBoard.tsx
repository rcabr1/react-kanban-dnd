import styles from "./KanbanBoard.module.css"
import KanbanColumn from "../KanbanColumn/KanbanColumn"
import KanbanColumnSkeleton from "../KanbanColumn/KanbanColumnSkeleton";
import { KanbanBoardType } from "../types/KanbanBoardType"
import { KanbanColumnType } from "../types/KanbanColumnType";
import { KanbanCardType } from "../types/KanbanCardType";
import { KanbanDraggableEnum } from "../types/KanbanDraggableEnum";
import { Add, Check, Close, Edit } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { v4 as uniqueId } from "uuid";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

type KanbanBoardProps = {
  board: KanbanBoardType
  onUpdateTitle: (newTitle: string) => void
  onAddColumn: () => void
  onDeleteColumn: (columnId: UniqueIdentifier) => void
  onUpdateColumn: (newColumn: KanbanColumnType) => void
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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const [overlayCard, setOverlayCard] = useState<KanbanCardType | null>(null)
  const [overlayColumn, setOverlayColumn] = useState<KanbanColumnType | null>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  function findColumnByColumnId(columnId: UniqueIdentifier): KanbanColumnType | null {
    return board.columns.find(column => column.id === columnId) ?? null
  }

  function findColumnByCardId(cardId: UniqueIdentifier): KanbanColumnType | null {
    return board.columns.find(column => column.cards.some(card => card.id === cardId)) ?? null
  }

  function findCardByCardId(cardId: UniqueIdentifier): KanbanCardType | null {
    return board.columns.flatMap(column => column.cards).find(card => card.id === cardId) ?? null
  }

  function handleUpdateTitle(): void {
    setIsEditing(false)

    if (!inputRef.current) return

    const newTitle = inputRef.current.value
    onUpdateTitle(newTitle)
  }

  function handleUpdateColumnTitle(columnId: UniqueIdentifier, newTitle: string): void {
    const oldColumn = findColumnByColumnId(columnId)

    if (!oldColumn) return

    const newColumn = { ...oldColumn, title: newTitle }
    onUpdateColumn(newColumn)
  }

  function handleAddColumn() {
    onAddColumn()
  }

  function handleDeleteColumn(columnId: UniqueIdentifier) {
    onDeleteColumn(columnId)
  }

  function handleAddCard(columnId: UniqueIdentifier): void {
    const oldColumn = findColumnByColumnId(columnId)

    if (!oldColumn) return

    const newColumn = {
      ...oldColumn,
      cards: [ ...oldColumn.cards, { id: uniqueId(), title: 'New card' }]
    }
    onUpdateColumn(newColumn)
  }

  function handleDeleteCard(columnId: UniqueIdentifier, cardId: UniqueIdentifier): void {
    const oldColumn = board.columns.find(column => column.id === columnId)

    if (!oldColumn) return

    const newColumn = {
      ...oldColumn,
      cards: oldColumn.cards.filter((card) => card.id !== cardId)
    }
    onUpdateColumn(newColumn)
  }

  function handleUpdateCard(columnId: UniqueIdentifier, cardId: UniqueIdentifier, newCard: KanbanCardType): void {
    const oldColumn = board.columns.find(column => column.id === columnId)

    if (!oldColumn) return

    const newColumn = {
      ...oldColumn,
      cards: oldColumn.cards.map((card) => card.id === cardId ? newCard : card)
    }
    onUpdateColumn(newColumn)
  }

  function handleDragStart({active}: DragStartEvent): void {
    if (!active) return

    const activeData = active.data.current

    if (activeData?.type === KanbanDraggableEnum.CARD) {
      setOverlayColumn(null)

      const newActiveCard = findCardByCardId(active.id)
      setOverlayCard(newActiveCard)
    }
    else if (activeData?.type === KanbanDraggableEnum.COLUMN) {
      setOverlayCard(null)
  
      const newActiveColumn = findColumnByColumnId(active.id)
      setOverlayColumn(newActiveColumn)
    }
  }
  
  function handleDragOver({active, over}: DragOverEvent): void {
    if(!active || !over) return

    const activeData = active.data.current
    const overData = over.data.current

    if (!activeData || !overData || activeData.type !== KanbanDraggableEnum.CARD) return

    const activeColumn = findColumnByCardId(active.id)
    const activeCard = findCardByCardId(active.id)

    if (!activeColumn || !activeCard) return

    const overColumn = overData.type === KanbanDraggableEnum.CARD ?
      findColumnByCardId(over.id) : overData.type === KanbanDraggableEnum.COLUMN ?
      findColumnByColumnId(over.id) : null

    if (!overColumn || activeColumn.id === overColumn.id) return

    const newActiveColumn = {
      ...activeColumn,
      cards: activeColumn.cards.filter(card => card.id !== active.id)
    }

    const newOverColumn = {
      ...overColumn,
      cards: [...overColumn.cards, activeCard]
    };

    onUpdateColumn(newActiveColumn)
    onUpdateColumn(newOverColumn)  
  }

  function handleDragEnd({active, over}: DragEndEvent): void {
    setOverlayCard(null)
    setOverlayColumn(null)

    if(!active || !over) return

    const activeData = active.data.current
    const overData = over.data.current

    if (!activeData || !overData) return

    if (activeData.type === KanbanDraggableEnum.COLUMN || overData.type === KanbanDraggableEnum.COLUMN) {
      // DO STUFFS
    }

    console.log('dragend', active.id, over?.id)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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
          <SortableContext
            items={board.columns.map(column => column.id)}
            strategy={horizontalListSortingStrategy}
          >
            {board.columns.map((column) =>
              <KanbanColumn
                key={column.id}
                column={column}
                onUpdateTitle={handleUpdateColumnTitle}
                onDelete={handleDeleteColumn}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
                onUpdateCard={handleUpdateCard}
                overlayCard={overlayCard}
              />
            )}
          </SortableContext>
          {overlayColumn && (
            <DragOverlay>
              <KanbanColumnSkeleton column={overlayColumn} />
            </DragOverlay>
          )}
        </div>
      </div>
    </DndContext>
  )
}
