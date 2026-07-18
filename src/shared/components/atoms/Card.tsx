import { type ReactNode } from 'react';

interface CardProps {
  title?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}

function Card({ title, badge, children, className }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 transition-colors duration-300 hover:border-white/20 ${className ?? ''}`}
    >
      {title && (
        <div className='mb-2 flex items-start justify-between' data-testid='title-section'>
          <div className='flex items-center gap-2'>
            <span className='w-1 h-4 bg-purple-500 rounded-full' />
            <p className='text-xs uppercase tracking-wider text-white/40'>{title}</p>
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
