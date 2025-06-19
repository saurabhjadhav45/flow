interface JsonViewerProps {
  data: unknown;
}

export default function JsonViewer({ data }: JsonViewerProps) {
  return (
    <pre className="bg-gray-100 p-2 rounded text-left text-xs overflow-auto max-h-60 w-full">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
