import type { ReactNode } from 'react';

interface ActivityItemProps {
  name:      string;
  sub:       string;
  right?:    ReactNode;
  dotColor?: string;
  variant?:  'default' | 'error' | 'warning';
  iconNode?: ReactNode;
}

export function ActivityItem({ name, sub, right, dotColor, variant = 'default', iconNode }: ActivityItemProps) {
  const cls = variant === 'error'
    ? 'dash-activity-item dash-activity-item--error'
    : variant === 'warning'
      ? 'dash-activity-item dash-activity-item--warning'
      : 'dash-activity-item';

  return (
    <div className={cls}>
      {iconNode}
      <div className="dash-activity-item__text">
        <div className="dash-activity-item__name">{name}</div>
        <div className="dash-activity-item__sub">{sub}</div>
      </div>
      {dotColor && <div className="dash-activity-item__dot" style={{ background: dotColor }} />}
      {right}
    </div>
  );
}

interface ActivityColumnProps {
  title:    string;
  children: ReactNode;
}

export function ActivityColumn({ title, children }: ActivityColumnProps) {
  return (
    <div className="dash-activity-col">
      <div className="dash-activity-col__title">{title}</div>
      <div className="dash-activity-col__items">{children}</div>
    </div>
  );
}
