import type { CSSProperties } from 'react';

export const trustTrack: CSSProperties = {
  width:        80,
  height:       8,
  background:   '#E5E7EB',
  borderRadius: 9999,
  overflow:     'hidden',
  flexShrink:   0,
};

export const trustFill = (score: number): CSSProperties => ({
  width:        `${score}%`,
  height:       8,
  background:   '#1A5FB4',
  borderRadius: 9999,
});
