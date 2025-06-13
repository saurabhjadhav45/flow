import React from 'react';

interface AirtableSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export default function AirtableSettings({ data, onChange }: AirtableSettingsProps) {
  return (
    <div className="space-y-4 text-left">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">API Key</label>
        <input
          type="text"
          value={(data.apiKey as string) || ''}
          onChange={(e) => onChange('apiKey', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Base ID</label>
        <input
          type="text"
          value={(data.baseId as string) || ''}
          onChange={(e) => onChange('baseId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Table</label>
        <input
          type="text"
          value={(data.table as string) || ''}
          onChange={(e) => onChange('table', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Operation</label>
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
        <label className="block text-sm font-medium text-gray-600 mb-2">Fields (JSON)</label>
        <textarea
          value={(data.fields as string) || ''}
          onChange={(e) => onChange('fields', e.target.value)}
          className="w-full h-24 px-3 py-2 border border-gray-600 rounded-md font-mono text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Filter Formula</label>
        <input
          type="text"
          value={(data.filter as string) || ''}
          onChange={(e) => onChange('filter', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
    </div>
  );
}
