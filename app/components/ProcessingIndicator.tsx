export function ProcessingIndicator() {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3" />
      <p className="text-lg font-medium text-blue-600">Processing file...</p>
    </div>
  );
}
