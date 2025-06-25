import React, { useEffect } from "react";
import classNames from "classnames";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";

import { Handle } from "./components";

import styles from "./Item.module.css";
import type { Ticket } from "@/models/Ticket";
import { TicketCard } from "@/components/ticket/Card";

export interface Props {
    dragOverlay?: boolean;
    color?: string;
    disabled?: boolean;
    dragging?: boolean;
    handle?: boolean;
    handleProps?: any;
    handleSize?: any;
    height?: number;
    index?: number;
    fadeIn?: boolean;
    transform?: Transform | null;
    listeners?: DraggableSyntheticListeners;
    sorting?: boolean;
    style?: React.CSSProperties;
    transition?: string | null;
    wrapperStyle?: React.CSSProperties;
    value: React.ReactNode;
    ticket: Ticket;
    onRemove?(): void;
    renderItem?(args: {
        dragOverlay: boolean;
        dragging: boolean;
        sorting: boolean;
        index: number | undefined;
        fadeIn: boolean;
        listeners: DraggableSyntheticListeners;
        ref: React.Ref<HTMLElement>;
        style: React.CSSProperties | undefined;
        transform: Props["transform"];
        transition: Props["transition"];
        value: Props["value"];
    }): React.ReactElement;
}

export const Item = React.memo(
    React.forwardRef<HTMLLIElement, Props>(
        (
            {
                color,
                dragOverlay,
                dragging,
                disabled,
                fadeIn,
                handle,
                handleProps,
                handleSize,
                height,
                index,
                listeners,
                onRemove,
                renderItem,
                sorting,
                style,
                transition,
                transform,
                value,
                wrapperStyle,
                ticket,
                ...props
            },
            ref
        ) => {
            useEffect(() => {
                if (!dragOverlay) {
                    return;
                }

                document.body.style.cursor = "grabbing";

                return () => {
                    document.body.style.cursor = "";
                };
            }, [dragOverlay]);

            return renderItem ? (
                renderItem({
                    dragOverlay: Boolean(dragOverlay),
                    dragging: Boolean(dragging),
                    sorting: Boolean(sorting),
                    index,
                    fadeIn: Boolean(fadeIn),
                    listeners,
                    ref,
                    style,
                    transform,
                    transition,
                    value,
                })
            ) : (
                <li
                    className={classNames(
                        fadeIn && styles.fadeIn,
                        sorting && styles.sorting,
                        dragOverlay && styles.dragOverlay
                    )}
                    style={
                        {
                            ...wrapperStyle,
                            transition: [transition, wrapperStyle?.transition]
                                .filter(Boolean)
                                .join(", "),
                            "--translate-x": transform
                                ? `${Math.round(transform.x)}px`
                                : undefined,
                            "--translate-y": transform
                                ? `${Math.round(transform.y)}px`
                                : undefined,
                            // "--scale-x": transform?.scaleX
                            //     ? `${transform.scaleX}`
                            //     : undefined,
                            // "--scale-y": transform?.scaleY
                            //     ? `${transform.scaleY}`
                            //     : undefined,
                            "--index": index,
                            "--color": color,
                        } as React.CSSProperties
                    }
                    ref={ref}
                >
                    <div
                        data-cypress="draggable-item"
                        {...(!handle ? listeners : undefined)}
                        {...props}
                        tabIndex={!handle ? 0 : undefined}
                    >
                        <div className="flex flex-row gap-x-2">
                            <TicketCard
                                {...ticket}
                                handleProps={handleProps}
                                listeners={listeners}
                                handle={true}
                                handleSize={handleSize}
                            />
                        </div>
                    </div>
                </li>
            );
        }
    )
);
