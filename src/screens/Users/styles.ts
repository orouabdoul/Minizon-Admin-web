import type { CSSProperties } from 'react';

export const actionIconBox = (bg: string): CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const perfFill = (width: number, color: string): CSSProperties => ({
  width: `${width}%`,
  height: 8,
  background: color,
  borderRadius: 9999,
  transition: 'width 0.4s ease',
});
