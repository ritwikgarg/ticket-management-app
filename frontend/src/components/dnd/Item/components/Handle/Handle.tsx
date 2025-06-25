import React, { forwardRef } from "react";

import { Action, type ActionProps } from "../Action";
import { IconGripVertical } from "@tabler/icons-react";

export const Handle = forwardRef<
    HTMLButtonElement,
    ActionProps & { size?: number; disabled?: boolean }
>(({ size = 20, disabled = false, ...props }, ref) => {
    return (
        <Action
            ref={ref}
            cursor={disabled ? "not-allowed" : "grab"}
            data-cypress="draggable-handle"
            {...props}
        >
            <IconGripVertical size={size}></IconGripVertical>
        </Action>
    );
});
