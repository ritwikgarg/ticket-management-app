import {
    type CancelDrop,
    type CollisionDetection,
    DndContext,
    DragOverlay,
    type DropAnimation,
    type KeyboardCoordinateGetter,
    KeyboardSensor,
    MeasuringStrategy,
    type Modifiers,
    MouseSensor,
    TouchSensor,
    type UniqueIdentifier,
    closestCenter,
    defaultDropAnimationSideEffects,
    getFirstCollision,
    pointerWithin,
    rectIntersection,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    type AnimateLayoutChanges,
    SortableContext,
    type SortingStrategy,
    arrayMove,
    defaultAnimateLayoutChanges,
    horizontalListSortingStrategy,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { coordinateGetter as multipleContainersCoordinateGetter } from "./multipleContainersKeyboardCoordinates";

import { Container, type ContainerProps, Item } from "@/components/dnd";

import { Status } from "@/enums/ticket/Status";
import type { Ticket } from "@/models/Ticket";
import { formatEnumValue } from "@/utils/FormatEnum";
import { getStatusDot } from "@/utils/StatusDot";

export default {
    title: "Presets/Sortable/Multiple Containers",
};

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

function DroppableContainer({
    children,
    columns = 1,
    disabled,
    id,
    items,
    style,
    handleSize,
    loading,
    ...props
}: ContainerProps & {
    disabled?: boolean;
    id: string;
    items: Ticket[];
    style?: React.CSSProperties;
}) {
    const {
        active,
        attributes,
        isDragging,
        listeners,
        over,
        setNodeRef,
        transition,
        transform,
    } = useSortable({
        id,
        data: {
            type: "container",
            children: items,
        },
        animateLayoutChanges,
    });

    const isOverContainer = over
        ? (id === over.id && active?.data.current?.type !== "container") ||
          items.some((ticket) => ticket.ticketId === over.id)
        : false;

    return (
        <Container
            className="font-medium w-full border rounded-md flex-1"
            ref={setNodeRef}
            style={{
                ...style,
                transition,
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : undefined,
            }}
            hover={isOverContainer}
            handleProps={{
                ...attributes,
                ...listeners,
            }}
            columns={columns}
            handleSize={handleSize}
            loading={loading}
            {...props}
        >
            {children}
        </Container>
    );
}


const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.5",
            },
        },
    }),
};

type Items = Record<Status, Ticket[]>;

interface Props {
    adjustScale?: boolean;
    cancelDrop?: CancelDrop;
    columns?: number;
    containerStyle?: React.CSSProperties;
    coordinateGetter?: KeyboardCoordinateGetter;
    getItemStyles?(args: {
        value: UniqueIdentifier;
        index: number;
        overIndex: number;
        isDragging: boolean;
        containerId: UniqueIdentifier;
        isSorting: boolean;
        isDragOverlay: boolean;
    }): React.CSSProperties;
    itemCount?: number;
    items?: Items;
    handle?: boolean;
    renderItem?: any;
    strategy?: SortingStrategy;
    modifiers?: Modifiers;
    minimal?: boolean;
    trashable?: boolean;
    scrollable?: boolean;
    vertical?: boolean;
}

const columnNames: string[] = [];
Object.entries(Status).map(([, value]) => {
    columnNames.push(formatEnumValue(value));
});

function isStatus(value: unknown): value is Status {
    return Object.values(Status).includes(value as Status);
}

import { getTicketList } from "@/api/ticket/ticket-api";

export function MultipleContainers({
    adjustScale = false,
    itemCount = 3,
    cancelDrop,
    columns,
    handle = true,
    items: initialItems,
    containerStyle,
    coordinateGetter = multipleContainersCoordinateGetter,
    getItemStyles = () => ({}),
    minimal = false,
    modifiers,
    renderItem,
    strategy = verticalListSortingStrategy,
    trashable = false,
    vertical = false,
    scrollable,
}: Props) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
      const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Items>(() => {
        // Initially empty
        return Object.fromEntries(
            Object.values(Status).map((status) => [status, tickets])
        ) as Items;
    });

    useEffect(() => {
        async function getTicketListData() {
            setLoading(true)
            const fetchedTickets: Ticket[] = (await getTicketList()).data;
            setTickets(fetchedTickets);

            // Group tickets by their status
            const groupedByStatus = Object.fromEntries(
                Object.values(Status).map((status) => [
                    status,
                    fetchedTickets.filter((ticket) => ticket.status === status),
                ])
            ) as Items;

            setItems(groupedByStatus);
            setLoading(false)
        }

        getTicketListData();
    }, []);

    const [containers, setContainers] = useState(
        Object.keys(items) as Status[]
    );
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const lastOverId = useRef<UniqueIdentifier | null>(null);
    const recentlyMovedToNewContainer = useRef(false);
    const isSortingContainer =
        activeId != null && isStatus(activeId) && containers.includes(activeId);

    /**
     * Custom collision detection strategy optimized for multiple containers
     *
     * - First, find any droppable containers intersecting with the pointer.
     * - If there are none, find intersecting containers with the active draggable.
     * - If there are no intersecting containers, return the last matched intersection
     *
     */
    const collisionDetectionStrategy: CollisionDetection = useCallback(
        (args) => {
            const isDraggingTicket = Object.values(items).some((tickets) =>
                tickets.some((ticket) => ticket.ticketId === activeId)
            );

            // If dragging a ticket, match against ticket IDs
            if (isDraggingTicket) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => {
                            const isTicket = Object.values(items).some(
                                (tickets) =>
                                    tickets.some(
                                        (ticket) =>
                                            ticket.ticketId === container.id
                                    )
                            );
                            const isContainer = containers.includes(
                                container.id as Status
                            );
                            return isTicket || isContainer;
                        }
                    ),
                });
            }

            // Otherwise, maybe dragging a container
            const pointerIntersections = pointerWithin(args);
            const intersections =
                pointerIntersections.length > 0
                    ? pointerIntersections
                    : rectIntersection(args);

            let overId = getFirstCollision(intersections, "id");

            if (overId) {
                lastOverId.current = overId;
                return [{ id: overId }];
            }

            if (recentlyMovedToNewContainer.current) {
                lastOverId.current = activeId;
            }

            return lastOverId.current ? [{ id: lastOverId.current }] : [];
        },
        [activeId, items]
    );

    const [clonedItems, setClonedItems] = useState<Items | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        })
    );

    // Finds which container (status) a ticket with the given id belongs to
    const findContainer = (id: UniqueIdentifier): Status | undefined => {
        if (id in items) {
            return id as Status;
        }

        return (Object.keys(items) as Status[]).find((key) =>
            items[key].some((ticket) => ticket.ticketId === id)
        );
    };

    // Gets index of the ticket with given id in its container
    const getIndex = (id: UniqueIdentifier): number => {
        const container = findContainer(id);
        if (!container) return -1;

        return items[container].findIndex((ticket) => ticket.ticketId === id);
    };

    const onDragCancel = () => {
        if (clonedItems) {
            setItems(clonedItems);
        }
        setActiveId(null);
        setClonedItems(null);
    };

    // Prevent false "overId" when layout shifts after a move
    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [items]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}
            onDragStart={({ active }) => {
                setActiveId(active.id);
                setClonedItems(items);
            }}
            onDragOver={({ active, over }) => {
                const overId = over?.id;

                if (
                    overId == null ||
                    active.id in items // skipping container reordering
                ) {
                    return;
                }

                const overContainer = findContainer(overId);
                const activeContainer = findContainer(active.id);

                if (
                    !overContainer ||
                    !activeContainer ||
                    activeContainer === overContainer
                ) {
                    return;
                }

                setItems((items) => {
                    const activeItems = items[activeContainer];
                    const overItems = items[overContainer];

                    const activeIndex = activeItems.findIndex(
                        (ticket) => ticket.ticketId === active.id
                    );
                    const ticketToMove = activeItems[activeIndex];
                    if (!ticketToMove) return items;

                    const overIndex = overItems.findIndex(
                        (ticket) => ticket.ticketId === overId
                    );

                    let newIndex: number;

                    if (containers.includes(overId as Status)) {
                        // Over a container directly (i.e., it's empty)
                        newIndex = 0;
                    } else {
                        const overIndex = overItems.findIndex(
                            (ticket) => ticket.ticketId === overId
                        );

                        const isBelowOverItem =
                            over &&
                            active.rect.current.translated &&
                            active.rect.current.translated.top >
                                over.rect.top + over.rect.height;

                        const modifier = isBelowOverItem ? 1 : 0;

                        newIndex =
                            overIndex >= 0
                                ? overIndex + modifier
                                : overItems.length;
                    }

                    recentlyMovedToNewContainer.current = true;

                    return {
                        ...items,
                        [activeContainer]: activeItems.filter(
                            (t) => t.ticketId !== active.id
                        ),
                        [overContainer]: [
                            ...overItems.slice(0, newIndex),
                            ticketToMove,
                            ...overItems.slice(newIndex),
                        ],
                    };
                });
            }}
            onDragEnd={({ active, over }) => {
                console.log("onDragEnd");
                console.log("Active ID:", active.id);
                console.log("Over ID:", over?.id);

                if (!active || !over) {
                    setActiveId(null);
                    return;
                }

                const activeId = active.id;
                const overId = over.id;

                if (
                    containers.includes(activeId as Status) &&
                    containers.includes(overId as Status)
                ) {
                    setContainers((prev) => {
                        const oldIndex = prev.indexOf(activeId as Status);
                        const newIndex = prev.indexOf(overId as Status);
                        return arrayMove(prev, oldIndex, newIndex);
                    });

                    setActiveId(null);
                    return; // Skip ticket logic
                }

                const activeContainer = findContainer(activeId);
                const overContainer = findContainer(overId);

                if (!activeContainer || !overContainer) {
                    setActiveId(null);
                    return;
                }

                const activeIndex = items[activeContainer].findIndex(
                    (ticket) => ticket.ticketId === activeId
                );
                const overIndex = items[overContainer].findIndex(
                    (ticket) => ticket.ticketId === overId
                );

                if (activeIndex === -1) {
                    setActiveId(null);
                    return;
                }

                if (activeContainer === overContainer) {
                    // 🔁 Reorder in same column
                    if (activeIndex !== overIndex) {
                        setItems((items) => ({
                            ...items,
                            [overContainer]: arrayMove(
                                items[overContainer],
                                activeIndex,
                                overIndex
                            ),
                        }));
                    }
                } else {
                    // 🔀 Move across columns
                    const activeTicket = items[activeContainer][activeIndex];

                    setItems((items) => ({
                        ...items,
                        [activeContainer]: items[activeContainer].filter(
                            (ticket) => ticket.ticketId !== activeId
                        ),
                        [overContainer]: [
                            ...items[overContainer].slice(0, overIndex),
                            activeTicket,
                            ...items[overContainer].slice(overIndex),
                        ],
                    }));
                }

                setActiveId(null);
            }}
            cancelDrop={cancelDrop}
            onDragCancel={onDragCancel}
            modifiers={modifiers}
        >
            <div className="flex flex-col md:flex-row justify-between gap-y-6 md:gap-x-4 w-full items-stretch">
                <SortableContext
                    items={[...containers]}
                    strategy={
                        vertical
                            ? verticalListSortingStrategy
                            : horizontalListSortingStrategy
                    }
                >
                    {containers.map((containerId) => {
                        const tickets = items[containerId as Status] ?? [];

                        const ticketsWithId = tickets.filter(
                            (ticket): ticket is Ticket & { ticketId: string } =>
                                Boolean(ticket.ticketId)
                        );

                        return (
                            <DroppableContainer
                                key={containerId}
                                id={containerId}
                                label={
                                    minimal
                                        ? undefined
                                        : formatEnumValue(containerId)
                                }
                                dotComponent={getStatusDot(containerId)}
                                columns={columns}
                                items={ticketsWithId}
                                scrollable={scrollable}
                                handleSize={20}
                                loading={loading}
                            >
                                <SortableContext
                                    items={ticketsWithId.map(
                                        (ticket) => ticket.ticketId!
                                    )}
                                    strategy={strategy}
                                >
                                    {ticketsWithId.map((ticket, index) => (
                                        <SortableItem
                                            disabled={isSortingContainer}
                                            key={ticket.ticketId}
                                            id={ticket.ticketId}
                                            ticket={ticket}
                                            index={index}
                                            handle={handle}
                                            handleSize={20}
                                            style={getItemStyles}
                                            renderItem={renderItem}
                                            containerId={containerId}
                                            getIndex={getIndex}
                                        />
                                    ))}
                                </SortableContext>
                            </DroppableContainer>
                        );
                    })}
                </SortableContext>
            </div>

            {createPortal(
                <DragOverlay
                    adjustScale={adjustScale}
                    dropAnimation={dropAnimation}
                >
                    {activeId
                        ? (containers as UniqueIdentifier[]).includes(activeId)
                            ? renderContainerDragOverlay(activeId as Status)
                            : (() => {
                                  const activeTicket = Object.values(items)
                                      .flat()
                                      .find(
                                          (ticket) =>
                                              ticket.ticketId === activeId
                                      );

                                  return activeTicket
                                      ? renderSortableItemDragOverlay(
                                            activeTicket
                                        )
                                      : null;
                              })()
                        : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );

    function renderSortableItemDragOverlay(ticket: Ticket) {
        const containerId = findContainer(ticket.ticketId!);
        const index = getIndex(ticket.ticketId!);

        if (!containerId) return null;

        return (
            <Item
                value={ticket.ticketId}
                handle={handle}
                ticket={ticket}
                style={getItemStyles({
                    containerId,
                    overIndex: -1,
                    index,
                    value: ticket.ticketId!,
                    isSorting: true,
                    isDragging: true,
                    isDragOverlay: true,
                })}
                renderItem={renderItem}
                dragOverlay
            />
        );
    }

    function renderContainerDragOverlay(containerId: Status) {
        const tickets = items[containerId] ?? [];
        const validTickets = tickets.filter(
            (ticket): ticket is Ticket & { ticketId: string } =>
                Boolean(ticket.ticketId)
        );

        return (
            <Container
                label={`${formatEnumValue(containerId)}`}
                columns={columns}
                style={{
                    height: "100%",
                }}
                shadow
                unstyled={false}
            >
                {validTickets.map((ticket, index) => (
                    <Item
                        key={ticket.ticketId}
                        ticket={ticket}
                        value={ticket.ticketId}
                        handle={handle}
                        style={getItemStyles({
                            containerId,
                            overIndex: -1,
                            index,
                            value: ticket.ticketId!,
                            isDragging: false,
                            isSorting: false,
                            isDragOverlay: false,
                        })}
                        renderItem={renderItem}
                    />
                ))}
            </Container>
        );
    }
}

interface SortableItemProps {
    containerId: UniqueIdentifier;
    id: UniqueIdentifier;
    index: number;
    handle: boolean;
    handleSize: number;
    disabled?: boolean;
    ticket: Ticket;
    style(args: any): React.CSSProperties;
    getIndex(id: UniqueIdentifier): number;
    renderItem(): React.ReactElement;
}

function SortableItem({
    disabled,
    id,
    index,
    handle,
    handleSize,
    renderItem,
    style,
    containerId,
    getIndex,
    ticket,
}: SortableItemProps) {
    const {
        setNodeRef,
        setActivatorNodeRef,
        listeners,
        isDragging,
        isSorting,
        over,
        overIndex,
        transform,
        transition,
    } = useSortable({
        id,
    });
    const mounted = useMountStatus();
    const mountedWhileDragging = isDragging && !mounted;

    return (
        <Item
            ref={disabled ? undefined : setNodeRef}
            value={id}
            ticket={ticket}
            dragging={isDragging}
            sorting={isSorting}
            handle={handle}
            handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
            handleSize={handleSize}
            index={index}
            style={style({
                index,
                value: id,
                isDragging,
                isSorting,
                overIndex: over ? getIndex(over.id) : overIndex,
                containerId,
            })}
            transition={transition}
            transform={transform}
            fadeIn={mountedWhileDragging}
            listeners={listeners}
            renderItem={renderItem}
        />
    );
}

function useMountStatus() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 500);

        return () => clearTimeout(timeout);
    }, []);

    return isMounted;
}
