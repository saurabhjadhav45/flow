import React from 'react';

interface DelaySettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export default function DelaySettings({ data, onChange }: DelaySettingsProps) {
  return (
    <div className="space-y-4 text-left">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Duration (ms)</label>
        <input
          type="number"
          value={(data.duration as number | undefined) ?? ''}
          onChange={(e) => onChange('duration', Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Until</label>
        <input
          type="datetime-local"
          value={(data.until as string) || ''}
          onChange={(e) => onChange('until', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
    </div>
  );
}
