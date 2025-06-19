import type { ChangeEvent } from 'react';
import { FiInfo } from 'react-icons/fi';
import VariablePicker from './VariablePicker';

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
      <fieldset className="space-y-4">
        <legend className="font-medium">Request</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Method
            <FiInfo className="inline-block ml-1" title="HTTP method" />
          </label>
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
          <label className="block text-sm font-medium text-gray-600 mb-2">
            URL
            <FiInfo className="inline-block ml-1" title="Request endpoint" />
          </label>
          <input
            type="text"
            value={(data.url as string) || ''}
            onChange={(e) => onChange('url', e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="w-full px-3 py-2  border border-gray-600 rounded-md"
          />
          <VariablePicker
            onSelect={(v) => onChange('url', ((data.url as string) || '') + v)}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-medium">Headers</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Headers (JSON)
            <FiInfo className="inline-block ml-1" title="Additional request headers" />
          </label>
          <textarea
            value={(data.headers as string) || ''}
            onChange={(e) => onChange('headers', e.target.value)}
            placeholder='{"Content-Type": "application/json"}'
            className="w-full h-24 px-3 py-2  border border-gray-600 rounded-md  font-mono text-sm"
          />
          <VariablePicker
            onSelect={(v) =>
              onChange('headers', ((data.headers as string) || '') + v)
            }
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-medium">Body</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Body
            <FiInfo className="inline-block ml-1" title="Request payload" />
          </label>
          <textarea
            value={(data.body as string) || ''}
            onChange={(e) => onChange('body', e.target.value)}
            placeholder="{name: 'John Doe'}"
            className="w-full h-32 px-3 py-2  border border-gray-600 rounded-md font-mono text-sm"
          />
          <VariablePicker
            onSelect={(v) =>
              onChange('body', ((data.body as string) || '') + v)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            File Upload (optional)
            <FiInfo className="inline-block ml-1" title="Binary payload" />
          </label>
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
      </fieldset>
    </div>
  );
}
