import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import type { PocketItem } from '../types/pocket';

interface ImportStatusProps {
  status: 'idle' | 'importing' | 'completed' | 'error';
  currentIndex: number;
  total: number;
  error?: string;
  importedItems: PocketItem[];
  onReset: () => void;
}

export function ImportStatus({
  status,
  currentIndex,
  total,
  error,
  importedItems,
  onReset,
}: ImportStatusProps) {
  if (status === 'idle') return null;

  const progressPercent = Math.round((currentIndex / total) * 100) || 0;

  return (
    <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-blue-200 shadow-lg">
      <div className="container mx-auto flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-blue-900">
            {status === 'importing' && 'Importing to Feedbin...'}
            {status === 'completed' && 'Import Completed'}
            {status === 'error' && 'Import Error'}
          </h3>

          {(status === 'completed' || status === 'error') && (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Close
            </button>
          )}
        </div>

        {status === 'importing' && (
          <>
            <div className="flex items-center justify-between text-sm text-blue-700 mb-1">
              <span>
                Processing item {currentIndex + 1} of {total}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </>
        )}

        {status === 'completed' && (
          <div className="flex items-center text-green-700">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span>
              Successfully imported {importedItems.length} items to Feedbin
            </span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center text-red-700">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            <span>
              Error on item {currentIndex + 1}: {error}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
