
import React from 'react';

export default function SectionTitle({ children, className = '', ...props }) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 mb-4 ${className}`} {...props}>
      {children}
    </h2>
  );
}
