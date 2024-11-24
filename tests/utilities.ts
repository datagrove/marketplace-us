
import type { JSX } from 'solid-js';
import { render as renderComponent } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';

type RenderOptions = Parameters<typeof renderComponent>[1];

export * from '@solidjs/testing-library';

export const render = (ui: JSX.Element, options?: RenderOptions) => {
  return {
    ...renderComponent(() => ui, options),
    user: userEvent.setup(),
  };
};
