import styles from "./KanbanCard.module.css"
import { KanbanCardType } from "../types/KanbanCardType"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities';

type KanbanCardProps = {
  card: KanbanCardType
}

export default function KanbanCard({ card }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
    },
  })

  const dragStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
  }


  return (
    <div
      className={styles.container}
      ref={setNodeRef}
      style={dragStyles}
      { ...attributes }
      { ...listeners }
    >
      <div className={styles.title}>
        {card.title}
      </div>
      <div className={styles.description}>
        {card.description}
      </div>
    </div>
  )
}
