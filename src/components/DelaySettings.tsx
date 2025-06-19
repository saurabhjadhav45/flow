
import { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';

interface DelaySettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function DelaySettings({ data, onChange, onValidationChange }: DelaySettingsProps) {
  const [error, setError] = useState('');

  useEffect(() => {
    const valid = Boolean(data.duration) || Boolean((data.until as string)?.trim());
    setError(valid ? '' : 'Duration or Until is required');
    onValidationChange?.(valid);
  }, [data.duration, data.until, onValidationChange]);
  return (
    <div className="space-y-4 text-left">
      <fieldset className="space-y-4">
        <legend className="font-medium">Timing</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Duration (ms)
            <FiInfo className="inline-block ml-1" title="Delay duration" />
          </label>
          <input
            type="number"
            value={(data.duration as number | undefined) ?? ''}
            onChange={(e) => onChange('duration', Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-md ${error && !data.duration && !(data.until as string) ? 'border-red-500' : 'border-gray-600'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Until
            <FiInfo className="inline-block ml-1" title="Delay until specific time" />
          </label>
          <input
            type="datetime-local"
            value={(data.until as string) || ''}
            onChange={(e) => onChange('until', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${error && !data.duration && !(data.until as string) ? 'border-red-500' : 'border-gray-600'}`}
          />
          {error && !data.duration && !(data.until as string) && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      </fieldset>
    </div>
  );
}
