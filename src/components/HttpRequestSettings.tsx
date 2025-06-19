import type { ChangeEvent } from 'react';

interface HttpRequestSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export default function HttpRequestSettings({ data, onChange }: HttpRequestSettingsProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        onChange('fileName', file.name);
        onChange('fileContent', content);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Method</label>
        <select
          value={(data.method as string) || 'GET'}
          onChange={(e) => onChange('method', e.target.value)}
          className="w-full px-3 py-2  border border-gray-600 rounded-md"
        >
          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">URL</label>
        <input
          type="text"
          value={(data.url as string) || ''}
          onChange={(e) => onChange('url', e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="w-full px-3 py-2  border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Headers (JSON)</label>
        <textarea
          value={(data.headers as string) || ''}
          onChange={(e) => onChange('headers', e.target.value)}
          placeholder='{"Content-Type": "application/json"}'
          className="w-full h-24 px-3 py-2  border border-gray-600 rounded-md  font-mono text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Body</label>
        <textarea
          value={(data.body as string) || ''}
          onChange={(e) => onChange('body', e.target.value)}
          placeholder="{name: 'John Doe'}"
          className="w-full h-32 px-3 py-2  border border-gray-600 rounded-md font-mono text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">File Upload (optional)</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
          value={undefined}
        />
        {!!data.fileName && (
          <div className="mt-2 text-xs text-gray-700">Selected file: {data.fileName as string}</div>
        )}
      </div>
    </div>
  );
}
