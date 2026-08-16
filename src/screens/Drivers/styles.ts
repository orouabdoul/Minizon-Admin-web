import type { CSSProperties } from 'react';

export const scoreTrack: CSSProperties = {
  width: 64,
  height: 8,
  background: '#E5E7EB',
  borderRadius: 9999,
  overflow: 'hidden',
  flexShrink: 0,
};

export const scoreFill = (score: number): CSSProperties => ({
  width: `${score}%`,
  height: 8,
  background: '#7C3AED',
  borderRadius: 9999,
});
