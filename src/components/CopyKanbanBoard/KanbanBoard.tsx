import KanbanColumn from "../KanbanColumn/KanbanColumn"
import { KanbanBoardType } from "../types/KanbanBoardType"
import styles from "./KanbanBoard.module.css"
// import { closestCenter, DndContext, DragEndEvent, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
// import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import AddCircleIcon from '@mui/icons-material/AddCircle';

type KanbanBoardProps = {
  board: KanbanBoardType
  setBoard: React.Dispatch<React.SetStateAction<KanbanBoardType>>
}

export default function KanbanBoard({ board, setBoard }: KanbanBoardProps) {
  /*
  const kanbanColumnsIds = board.columns.map((column) => column.id)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    
    if (!active || !over) { return }

    if (active.id !== over.id) {
      const activeColumnId = board.columns.findIndex((column) => column.id === active.id);
      const overColumnId = board.columns.findIndex((column) => column.id === over.id);

      setBoard((board) => ({
          ... board,
          columns: arrayMove(board.columns, activeColumnId, overColumnId)
      }));
    }
  }
  */

  return (
    <div className={styles.container}>
      <div className={styles.title}>{board.title}</div>
      <div className={styles.columns}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={kanbanColumnsIds}
            strategy={horizontalListSortingStrategy}
          >
            {board.columns.map((column) =>
              <KanbanColumn key={column.id} column={column} />
            )}
          </SortableContext>
          <DragOverlay>
            <div className={styles.overlay} />
          </DragOverlay>
        </DndContext>
        <button className={styles.addButton}>
          <AddCircleIcon />
          <span>Adicionar coluna</span>
        </button>
      </div>
    </div>
  )
}
