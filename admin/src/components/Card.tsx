import { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: FC<CardProps> = ({ children, className = '', onClick }) => {
  const base = 'rounded-xl p-6 transition';
  const clickable = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`${base} ${clickable} ${className} bg-[#0b1424] border border-[#122033] shadow-sm`}
    >
      {children}
    </div>
  );
};

export default Card;
