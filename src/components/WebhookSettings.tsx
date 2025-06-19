import { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';

interface WebhookSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function WebhookSettings({ data, onChange, onValidationChange }: WebhookSettingsProps) {
  const [pathError, setPathError] = useState('');

  useEffect(() => {
    const valid = (data.path as string)?.trim().length > 0;
    setPathError(valid ? '' : 'Path is required');
    onValidationChange?.(valid);
  }, [data.path, onValidationChange]);
  return (
    <div className="space-y-4 text-left">
      <fieldset className="space-y-3">
        <legend className="font-medium">Request</legend>
        <div>
          <label className="block text-sm mb-1">
            Test URL
            <FiInfo className="inline-block ml-1" title="Generated test webhook URL" />
          </label>
          <input
            className="w-full border px-2 py-1"
            value={data.testUrl as string || ''}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm mb-1">
            Production URL
            <FiInfo className="inline-block ml-1" title="URL for production use" />
          </label>
          <input
            className="w-full border px-2 py-1"
            value={data.prodUrl as string || ''}
            onChange={(e) => onChange('prodUrl', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">
            HTTP Method
            <FiInfo className="inline-block ml-1" title="HTTP method for webhook" />
          </label>
          <select
            className="w-full border px-2 py-1"
            value={(data.method as string) || 'GET'}
            onChange={(e) => onChange('method', e.target.value)}
          >
            {['GET', 'POST', 'PUT', 'DELETE'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">
            Path
            <FiInfo className="inline-block ml-1" title="Relative request path" />
          </label>
          <input
            className={`w-full border px-2 py-1 ${pathError ? 'border-red-500' : ''}`}
            value={data.path as string || ''}
            onChange={(e) => onChange('path', e.target.value)}
          />
          {pathError && (
            <p className="text-red-500 text-xs mt-1">{pathError}</p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-medium">Authentication</legend>
        <div>
          <label className="block text-sm mb-1">
            Authentication
            <FiInfo className="inline-block ml-1" title="Webhook authentication type" />
          </label>
          <select
            className="w-full border px-2 py-1"
            value={(data.auth as string) || 'None'}
            onChange={(e) => onChange('auth', e.target.value)}
          >
            <option value="None">None</option>
            <option value="Basic">Basic</option>
            <option value="Bearer">Bearer</option>
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-medium">Response</legend>
        <div>
          <label className="block text-sm mb-1">
            Respond
            <FiInfo className="inline-block ml-1" title="When to respond to caller" />
          </label>
          <select
            className="w-full border px-2 py-1"
            value={(data.respond as string) || 'Immediately'}
            onChange={(e) => onChange('respond', e.target.value)}
          >
            <option value="Immediately">Immediately</option>
            <option value="After Workflow">After Workflow</option>
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-medium">Notes</legend>
        <div>
          <label className="block text-sm mb-1">
            Notes
            <FiInfo className="inline-block ml-1" title="Internal note for this webhook" />
          </label>
          <textarea
            className="w-full border px-2 py-1"
            value={data.notes as string || ''}
            onChange={(e) => onChange('notes', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(data.displayNote)}
            onChange={(e) => onChange('displayNote', e.target.checked)}
          />
          <span className="text-sm">Display Note in Flow</span>
        </div>
      </fieldset>
    </div>
  );
}
