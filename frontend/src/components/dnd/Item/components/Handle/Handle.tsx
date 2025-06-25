import React, {forwardRef} from 'react';

import {Action, type ActionProps} from '../Action';
import { IconGripVertical } from '@tabler/icons-react';

export const Handle = forwardRef<HTMLButtonElement, ActionProps & { size?: number }>(
  ({ size = 20, ...props }, ref) => {
    return (
      <Action
        ref={ref}
        cursor="grab"
        data-cypress="draggable-handle"
        {...props}
      >
        <IconGripVertical size={size}></IconGripVertical>
      </Action>
    );
  }
);
