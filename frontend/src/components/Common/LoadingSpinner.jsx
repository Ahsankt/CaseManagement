import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center space-x-2">
        <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
        <span className="text-gray-600">{text}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
