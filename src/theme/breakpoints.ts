export const breakpoints = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  largeDesktop: 1440,
} as const;

export type Breakpoint = keyof typeof breakpoints;
