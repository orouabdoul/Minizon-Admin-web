import type { ReactNode } from 'react';

// ── Primitive table building blocks ─────────────────────

interface ChildrenProps { children: ReactNode; }
interface ThProps       { children: ReactNode; width?: string; }
interface TdProps       { children?: ReactNode; colSpan?: number; }
interface TrProps       { children: ReactNode; onClick?: () => void; className?: string; }

export function Table({ children }: ChildrenProps) {
  return (
    <div className="table-wrap">
      <table className="data-table">{children}</table>
    </div>
  );
}

export function TableHead({ children }: ChildrenProps) {
  return <thead className="data-table__head">{children}</thead>;
}

export function TableBody({ children }: ChildrenProps) {
  return <tbody className="data-table__body">{children}</tbody>;
}

export function TableRow({ children, onClick, className }: TrProps) {
  return (
    <tr
      className={`data-table__row${onClick ? ' data-table__row--clickable' : ''}${className ? ' ' + className : ''}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function Th({ children, width }: ThProps) {
  return <th className="data-table__th" style={width ? { width } : undefined}>{children}</th>;
}

export function Td({ children, colSpan }: TdProps) {
  return <td className="data-table__td" colSpan={colSpan}>{children}</td>;
}
