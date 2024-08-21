import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import KanbanCard from "../KanbanCard/KanbanCard"
import { KanbanColumnType } from "../types/KanbanColumnType"
import styles from "./KanbanColumn.module.css"
import { CSS } from '@dnd-kit/utilities';
import { DragHandle } from "@mui/icons-material";

type KanbanColumnProps = {
  column: KanbanColumnType
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  })

  const dragStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const kanbanCardsIds = column.cards.map((card) => card.id)

  return (
    <div
      className={styles.container}
      ref={setNodeRef}
      style={dragStyles}
      { ...attributes }
    >
      <div className={styles.title}>
        <span>{column.title}</span>
        <button ref={setActivatorNodeRef} {...listeners}>
          <DragHandle />
        </button>
      </div>
      <div className={styles.cards}>
        <SortableContext
          items={kanbanCardsIds}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card, index) =>
            <KanbanCard key={index} card={card} />
          )}
        </SortableContext>
      </div>
    </div>
  )
}
