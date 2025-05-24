import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorDisplayProps {
  errorMessage: string;
  onReset: (e: React.MouseEvent) => void;
}

export function ErrorDisplay({ errorMessage, onReset }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      <ExclamationCircleIcon className="w-12 h-12 mb-3 text-red-500" />
      <p className="text-lg font-medium text-red-600">Error</p>
      <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onReset(e);
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Try Again
      </button>
    </div>
  );
}
