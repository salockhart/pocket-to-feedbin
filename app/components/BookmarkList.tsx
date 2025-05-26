import {
  ArrowPathIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useFeedbinImport } from '../hooks/useFeedbinImport';
import type { PocketItem } from '../types/pocket';
import { CredentialsDialog } from './CredentialsDialog';
import { ImportStatus } from './ImportStatus';

interface BookmarkListProps {
  items: PocketItem[];
  onReset: () => void;
}

export function BookmarkList({ items, onReset }: BookmarkListProps) {
  const {
    importToFeedbin,
    importStatus,
    resetImport,
    showCredentialsPrompt,
    openCredentialsPrompt,
    closeCredentialsPrompt,
    handleCredentialsSubmit,
  } = useFeedbinImport();

  // Close the import status when completed after a delay
  useEffect(() => {
    if (importStatus.status === 'completed') {
      const timer = setTimeout(() => {
        resetImport();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [importStatus.status, resetImport]);

  const handleImportClick = () => {
    openCredentialsPrompt();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700">
          {items.length} Bookmarks Loaded
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleImportClick}
            className="px-4 py-2 flex items-center bg-green-600 text-white rounded hover:bg-green-700 transition"
            disabled={importStatus.status === 'importing'}
          >
            <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
            Import to Feedbin
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Upload Different File
          </button>
        </div>
      </div>

      <CredentialsDialog
        isOpen={showCredentialsPrompt}
        onClose={closeCredentialsPrompt}
        onSubmit={(email, password) => {
          handleCredentialsSubmit(email, password);
          importToFeedbin(items);
        }}
      />

      <ImportStatus {...importStatus} onReset={resetImport} />

      <div className="overflow-auto flex-grow border border-blue-200 rounded">
        <table className="min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-50 sticky top-0">
            <tr>
              {['Title', 'URL', 'Date Added', 'Tags', 'Status', 'Feedbin'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-100">
            {items.map((item, index) => {
              // Convert Unix timestamp to JavaScript Date
              const date = new Date(Number.parseInt(item.time_added) * 1000);
              const formattedDate = format(date, 'MMM d, yyyy');

              // Determine Feedbin import status for this item
              const isProcessing =
                importStatus.status === 'importing' &&
                importStatus.currentIndex === index;

              const isImported = importStatus.importedItems.some(
                (importedItem) => importedItem.url === item.url,
              );

              const isError =
                importStatus.status === 'error' &&
                importStatus.currentIndex === index;

              return (
                <tr
                  key={item.url}
                  className={`
                    hover:bg-blue-50 
                    ${isProcessing ? 'bg-blue-50' : ''}
                    ${isImported ? 'bg-green-50' : ''}
                    ${isError ? 'bg-red-50' : ''}
                  `}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-900 truncate max-w-[300px]">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-800 truncate max-w-[250px]">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600"
                    >
                      {item.url}
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700">
                    {formattedDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700">
                    {item.tags || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700">
                    {item.status}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {isProcessing && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" />
                        Importing
                      </span>
                    )}
                    {isImported && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" />
                        Imported
                      </span>
                    )}
                    {isError && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        <ExclamationCircleIcon className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" />
                        Failed
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
