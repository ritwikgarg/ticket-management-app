import React, {
    forwardRef,
    isValidElement,
    Children,
    cloneElement,
    type JSXElementConstructor,
} from "react";

import { Handle } from "../Item";
import { cn } from "@/lib/utils";
import styles from "./Container.module.css";
import { Badge } from "@/components/ui/badge";
import { TicketCardSkeleton } from "@/components/ticket/CardSkeleton";

export interface Props {
    children: React.ReactNode;
    columns?: number;
    label?: string;
    dotComponent?: React.ReactNode;
    style?: React.CSSProperties;
    horizontal?: boolean;
    hover?: boolean;
    handleProps?: React.HTMLAttributes<any>;
    handleSize?: number;
    scrollable?: boolean;
    shadow?: boolean;
    placeholder?: boolean;
    unstyled?: boolean;
    className?: React.ComponentProps<JSXElementConstructor<any>>;
    onClick?(): void;
    onRemove?(): void;
    loading?: boolean;
}

export const Container = forwardRef<HTMLElement, Props>(
    (
        {
            children,
            columns = 1,
            handleProps,
            handleSize,
            horizontal,
            hover,
            onClick,
            onRemove,
            label,
            dotComponent,
            placeholder,
            style,
            scrollable,
            shadow,
            unstyled,
            className,
            loading,
            ...props
        }: Props,
        ref
    ) => {
        const Component = onClick ? "button" : "div";

        // Count number of actual sortable items inside (even if wrapped in SortableContext)
        let count = 0;

        if (!placeholder && children) {
            const childArray = Children.toArray(children);
            const wrappedChild = childArray[0];

            if (
                isValidElement(wrappedChild) &&
                wrappedChild.props &&
                (wrappedChild.props as { children?: React.ReactNode }).children
            ) {
                const innerChildren = Children.toArray(
                    (wrappedChild.props as { children?: React.ReactNode })
                        .children
                );
                count = innerChildren.filter(isValidElement).length;
            } else {
                count = childArray.filter(isValidElement).length;
            }
        }

        return (
            <Component
                {...props}
                ref={ref as React.Ref<any>}
                onClick={onClick}
                tabIndex={onClick ? 0 : undefined}
                className={cn(className)}
                style={style}
            >
                {label ? (
                    <div className="flex flex-row justify-between items-center border-b-1 px-4 py-2">
                        <div className="flex items-center gap-x-2">
                            {dotComponent}
                            <span>{label}</span>
                            <Badge className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground border rounded-full">
                                {count}
                            </Badge>
                        </div>
                        <div className={styles.Actions}>
                            <Handle {...handleProps} size={handleSize} />
                        </div>
                    </div>
                ) : null}

                {placeholder ? (
                    children
                ) : loading ? (
                    <ul className="p-2 space-y-2 min-h-60">
                        {[...Array(2)].map((_, i) => (
                            <li key={i} className="w-full">
                                <div className="w-full">
                                    <TicketCardSkeleton />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul className="p-2 space-y-2 min-h-10">{children}</ul>
                )}


            </Component>
        );
    }
);

Container.displayName = "Container";
