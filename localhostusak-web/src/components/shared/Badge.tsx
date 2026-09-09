import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'blue' | 'live' | 'green' | 'purple' | 'subtle';
  style?: React.CSSProperties;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  style,
  className = '',
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'orange':
        return 'badge-orange';
      case 'blue':
        return 'badge-blue';
      case 'live':
        return 'badge-live';
      default:
        return 'badge-orange';
    }
  };

  return (
    <span className={`badge ${getVariantClass()} ${className}`} style={style}>
      {children}
    </span>
  );
};
