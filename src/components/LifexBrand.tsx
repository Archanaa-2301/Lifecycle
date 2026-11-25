import React from 'react';

interface LifexBrandProps {
  className?: string;
}

export const LifexBrand: React.FC<LifexBrandProps> = ({
  className = '',
}) => (
  <header
    className={`w-full h-28 shrink-0 flex items-center px-7
      border-b border-cyan-900/50 bg-[#040c14] overflow-hidden ${className}`}
  >
    <img
      src="/lifex-logo.png"
      alt="LIFEX - Lifecycle Intelligence For Engineering Excellence"
      style={{
        height: '62px',
        width: '150px',
        maxWidth: '100%',
        objectFit: 'contain',
        objectPosition: 'left center',
      }}
    />
  </header>
);

export default LifexBrand;