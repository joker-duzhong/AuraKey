import React from 'react';

interface SvgIconProps {
  svgContent: string;
  size?: number | string;
  color?: string;
  className?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({ 
  svgContent, 
  size = 20, 
  color = 'currentColor', 
  className = '' 
}) => {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ 
        width: size, 
        height: size, 
        color: color 
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default SvgIcon;
