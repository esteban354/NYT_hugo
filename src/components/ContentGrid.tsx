import type { ReactNode } from 'react';

interface ContentGridProps {
  title: string;
  controls?: ReactNode;
  children: ReactNode;
}

export default function ContentGrid({ title, controls, children }: ContentGridProps) {
  return (
    <>
      <h2 className="section-title">{title}</h2>
      {controls && <div className="controls">{controls}</div>}
      <div className="grid">{children}</div>
    </>
  );
}
