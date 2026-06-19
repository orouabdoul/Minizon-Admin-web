import { useState, useEffect } from 'react';
import { breakpoints } from '../theme/breakpoints';

type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'largeDesktop';

function getDevice(w: number): DeviceType {
  if (w <= breakpoints.mobile) return 'mobile';
  if (w <= breakpoints.tablet) return 'tablet';
  if (w <= breakpoints.laptop) return 'laptop';
  if (w <= breakpoints.desktop) return 'desktop';
  return 'largeDesktop';
}

export function useResponsive() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : breakpoints.desktop,
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return {
    width,
    device: getDevice(width),
    isMobile:       width <= breakpoints.mobile,
    isTablet:       width <= breakpoints.tablet,
    isLaptop:       width <= breakpoints.laptop,
    isDesktop:      width <= breakpoints.desktop,
    isLargeDesktop: width >= breakpoints.largeDesktop,
  };
}
