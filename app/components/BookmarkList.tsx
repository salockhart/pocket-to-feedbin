import { format } from 'date-fns';
import type { PocketItem } from '../types/pocket';

interface BookmarkListProps {
  items: PocketItem[];
  onReset: () => void;
}

export function BookmarkList({ items, onReset }: BookmarkListProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700">
          {items.length} Bookmarks Loaded
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Upload Different File
        </button>
      </div>

      <div className="overflow-auto flex-grow border border-blue-200 rounded">
        <table className="min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-50 sticky top-0">
            <tr>
              {['Title', 'URL', 'Date Added', 'Tags', 'Status'].map(
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
            {items.map((item) => {
              // Convert Unix timestamp to JavaScript Date
              const date = new Date(Number.parseInt(item.time_added) * 1000);
              const formattedDate = format(date, 'MMM d, yyyy');

              return (
                <tr key={item.url} className="hover:bg-blue-50">
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
