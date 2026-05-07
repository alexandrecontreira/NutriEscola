import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  tone?: 'green' | 'yellow' | 'orange' | 'red' | 'slate';
};

export function Badge({ children, tone = 'green' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
