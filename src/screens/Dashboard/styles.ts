import type { CSSProperties } from 'react';

export const dashStyles = {
  chartsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 32,
  } satisfies CSSProperties,
} as const;
