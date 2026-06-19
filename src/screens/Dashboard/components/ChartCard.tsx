import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { AppIcon } from '../../../components/Common/AppIcon';

interface ChartCardProps {
  title:       string;
  children:    ReactNode;
  period?:     string;
  linkLabel?:  string;
  sizeClass?:  string;
}

export function ChartCard({ title, children, period, linkLabel }: ChartCardProps) {
  return (
    <div className="dash-chart-card">
      <div className="dash-chart-card__header">
        <span className="dash-chart-card__title">{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {period && (
            <button className="dash-chart-card__period" type="button">
              {period}
              <AppIcon icon={ChevronDown} size={13} color="#374151" />
            </button>
          )}
          {linkLabel && (
            <span className="dash-chart-card__link">{linkLabel}</span>
          )}
        </div>
      </div>
      {/* Scrollable on small screens so SVG doesn't break layout */}
      <div className="dash-chart-scroll">
        {children}
      </div>
    </div>
  );
}
