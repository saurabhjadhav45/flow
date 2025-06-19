
import { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';

interface AirtableSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function AirtableSettings({ data, onChange, onValidationChange }: AirtableSettingsProps) {
  const [errors, setErrors] = useState({ apiKey: '', baseId: '', table: '' });

  useEffect(() => {
    const newErrors = {
      apiKey: (data.apiKey as string)?.trim() ? '' : 'Required',
      baseId: (data.baseId as string)?.trim() ? '' : 'Required',
      table: (data.table as string)?.trim() ? '' : 'Required',
    };
    setErrors(newErrors);
    onValidationChange?.(!Object.values(newErrors).some(Boolean));
  }, [data.apiKey, data.baseId, data.table, onValidationChange]);
  return (
    <div className="space-y-4 text-left">
      <fieldset className="space-y-4">
        <legend className="font-medium">Authentication</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            API Key
            <FiInfo className="inline-block ml-1" title="Your Airtable API key" />
          </label>
          <input
            type="text"
            value={(data.apiKey as string) || ''}
            onChange={(e) => onChange('apiKey', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.apiKey ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.apiKey && (
            <p className="text-red-500 text-xs mt-1">{errors.apiKey}</p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-medium">Table</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Base ID
            <FiInfo className="inline-block ml-1" title="Airtable base identifier" />
          </label>
          <input
            type="text"
            value={(data.baseId as string) || ''}
            onChange={(e) => onChange('baseId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.baseId ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.baseId && (
            <p className="text-red-500 text-xs mt-1">{errors.baseId}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Table
            <FiInfo className="inline-block ml-1" title="Table name" />
          </label>
          <input
            type="text"
            value={(data.table as string) || ''}
            onChange={(e) => onChange('table', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.table ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.table && (
            <p className="text-red-500 text-xs mt-1">{errors.table}</p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-medium">Operation</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Operation
            <FiInfo className="inline-block ml-1" title="Action to perform" />
          </label>
          <select
            value={(data.operation as string) || 'select'}
            onChange={(e) => onChange('operation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          >
            <option value="select">Select</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Fields (JSON)
            <FiInfo className="inline-block ml-1" title="Fields payload" />
          </label>
          <textarea
            value={(data.fields as string) || ''}
            onChange={(e) => onChange('fields', e.target.value)}
            className="w-full h-24 px-3 py-2 border border-gray-600 rounded-md font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Filter Formula
            <FiInfo className="inline-block ml-1" title="Airtable filter formula" />
          </label>
          <input
            type="text"
            value={(data.filter as string) || ''}
            onChange={(e) => onChange('filter', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          />
        </div>
      </fieldset>
    </div>
  );
}
