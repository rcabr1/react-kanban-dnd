import { UniqueIdentifier } from "@dnd-kit/core"
import { KanbanCardType } from "./KanbanCardType"

export type KanbanColumnType = {
  id: UniqueIdentifier
  title: string
  cards: KanbanCardType[]
}
