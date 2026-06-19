import type { LucideIcon } from 'lucide-react';

interface AppIconProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export function AppIcon({
  icon: Icon,
  size = 16,
  color,
  className,
  strokeWidth = 1.5,
}: AppIconProps) {
  return (
    <Icon
      size={size}
      color={color}
      className={className}
      strokeWidth={strokeWidth}
    />
  );
}
