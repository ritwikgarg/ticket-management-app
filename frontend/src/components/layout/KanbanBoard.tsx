import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type React from "react";
import { useState } from "react";
// import { SortableItem } from "./SortableItem";
import { Status } from "@/enums/ticket/Status";

export default function KanbanBoard({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [items, setItems] = useState(["1", "2", "3"]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-4 gap-x-2">
                {Object.entries(Status).map(([statusKey]) => (
                    <SortableContext
                        key={statusKey}
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="flex flex-col gap-y-2">
                            {/* {items.map((id) => (
                                <SortableItem
                                    className="outline"
                                    key={statusKey + id}
                                    id={statusKey + id}
                                />
                            ))} */}
                        </div>
                    </SortableContext>
                ))}
            </div>
        </DndContext>
    );

    function handleDragEnd(event: { active: any; over: any }) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }
}
