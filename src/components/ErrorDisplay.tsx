import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

/**
 * ErrorDisplay shows a friendly error message with an optional retry button
 */
const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;