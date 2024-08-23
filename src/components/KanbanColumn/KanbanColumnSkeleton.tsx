import styles from "./KanbanColumn.module.css"
import KanbanCardSkeleton from "../KanbanCard/KanbanCardSkeleton"
import { KanbanColumnType } from "../types/KanbanColumnType"
import { Add } from "@mui/icons-material"

type KanbanColumnProps = {
  column: KanbanColumnType
}

export default function KanbanColumnSkeleton({ column }: KanbanColumnProps) {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
          <span className={styles.titleText}>{column.title}</span>
      </div>
      <div className={styles.cardsContainer}>
        {column.cards.map((card) =>
          <KanbanCardSkeleton key={card.id} card={card} />
        )}
      </div>
      <button className={styles.addCardButton}><Add /></button>
    </div>
  )
}
