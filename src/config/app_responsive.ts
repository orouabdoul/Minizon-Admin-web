import { breakpoints } from '../theme/breakpoints';

export const mq = {
  mobile:       `@media (max-width: ${breakpoints.mobile}px)`,
  tablet:       `@media (max-width: ${breakpoints.tablet}px)`,
  laptop:       `@media (max-width: ${breakpoints.laptop}px)`,
  desktop:      `@media (max-width: ${breakpoints.desktop}px)`,
  largeDesktop: `@media (min-width: ${breakpoints.largeDesktop}px)`,
  tabletUp:     `@media (min-width: ${breakpoints.tablet + 1}px)`,
  laptopUp:     `@media (min-width: ${breakpoints.laptop + 1}px)`,
  desktopUp:    `@media (min-width: ${breakpoints.desktop + 1}px)`,
} as const;

/** fluid clamp() helper — use inside CSS-in-JS or style attributes */
export const clamp = (min: string, preferred: string, max: string) =>
  `clamp(${min}, ${preferred}, ${max})`;

/** Responsive value map — pick the right value in useResponsive hooks */
export const responsiveValue = <T>(map: {
  mobile?: T;
  tablet?: T;
  laptop?: T;
  desktop?: T;
  default: T;
}) => map;
