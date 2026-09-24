import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Unable to load content',
  message = 'An unexpected network error occurred while connecting to the store server.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-red-50/50 rounded-2xl border border-red-200/60 max-w-lg mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-red-950 mb-1">{title}</h3>
      <p className="text-sm text-red-700/80 mb-5">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" icon={RefreshCw}>
          Retry Request
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
