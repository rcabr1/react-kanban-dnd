import styles from "./KanbanCard.module.css"
import { KanbanCardType } from "../types/KanbanCardType"

type KanbanCardSkeletonProps = {
  card: KanbanCardType
}

export default function KanbanCardSkeleton({ card }: KanbanCardSkeletonProps) {
  return (
    <div className={styles.container}>
      <span className={styles.titleText}>{card.title}</span>
    </div>
  )
}
