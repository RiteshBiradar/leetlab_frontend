import React from 'react';

const Button = ({ children, onClick = () => {}, className = '', variant = 'default', size = 'default', ...props }) => {
  let buttonClass = 'px-4 py-2 rounded font-medium transition-colors ';
  
  if (variant === 'default') {
    buttonClass += 'bg-blue-600 text-white hover:bg-blue-700 ';
  } else if (variant === 'outline') {
    buttonClass += 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ';
  } else if (variant === 'secondary') {
    buttonClass += 'bg-gray-200 text-gray-900 hover:bg-gray-300 ';
  }
  
  if (size === 'lg') {
    buttonClass += 'px-6 py-3 text-lg ';
  }
  
  return (
    <button 
      className={buttonClass + className} 
      onClick={onClick} 
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
