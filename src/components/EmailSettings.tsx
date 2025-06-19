
import { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import VariablePicker from './VariablePicker';

interface EmailSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function EmailSettings({ data, onChange, onValidationChange }: EmailSettingsProps) {
  // Individual error messages for each required field
  const [errors, setErrors] = useState({ smtpHost: '', from: '', to: '' });

  // Validate required message and server fields
  useEffect(() => {
    const newErrors = {
      smtpHost: (data.smtpHost as string)?.trim() ? '' : 'Required',
      from: (data.from as string)?.trim() ? '' : 'Required',
      to: (data.to as string)?.trim() ? '' : 'Required',
    };
    setErrors(newErrors);
    // Inform parent whether all fields are valid
    onValidationChange?.(!Object.values(newErrors).some(Boolean));
  }, [data.smtpHost, data.from, data.to, onValidationChange]);
  return (
    <div className="space-y-4 text-left">
      <fieldset className="space-y-4">
        <legend className="font-medium">Server</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            SMTP Host
            <FiInfo className="inline-block ml-1" title="Mail server host" />
          </label>
          <input
            type="text"
            value={(data.smtpHost as string) || ''}
            onChange={(e) => onChange('smtpHost', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.smtpHost ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.smtpHost && (
            <p className="text-red-500 text-xs mt-1">{errors.smtpHost}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Port
              <FiInfo className="inline-block ml-1" title="SMTP port" />
            </label>
            <input
              type="number"
              value={(data.smtpPort as number | undefined) ?? ''}
              onChange={(e) => onChange('smtpPort', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-600 rounded-md"
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={Boolean(data.smtpSecure)}
              onChange={(e) => onChange('smtpSecure', e.target.checked)}
            />
            <span className="text-sm">Secure</span>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-medium">Authentication</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Username
            <FiInfo className="inline-block ml-1" title="SMTP account" />
          </label>
          <input
            type="text"
            value={(data.smtpUser as string) || ''}
            onChange={(e) => onChange('smtpUser', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Password
            <FiInfo className="inline-block ml-1" title="SMTP password" />
          </label>
          <input
            type="password"
            value={(data.smtpPass as string) || ''}
            onChange={(e) => onChange('smtpPass', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-medium">Message</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            From
            <FiInfo className="inline-block ml-1" title="Sender" />
          </label>
          <input
            type="text"
            value={(data.from as string) || ''}
            onChange={(e) => onChange('from', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.from ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.from && (
            <p className="text-red-500 text-xs mt-1">{errors.from}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            To
            <FiInfo className="inline-block ml-1" title="Recipient" />
          </label>
          <input
            type="text"
            value={(data.to as string) || ''}
            onChange={(e) => onChange('to', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.to ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.to && (
            <p className="text-red-500 text-xs mt-1">{errors.to}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Subject
            <FiInfo className="inline-block ml-1" title="Email subject" />
          </label>
          <input
            type="text"
            value={(data.subject as string) || ''}
            onChange={(e) => onChange('subject', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          />
          <VariablePicker
            onSelect={(v) =>
              onChange('subject', ((data.subject as string) || '') + v)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Body
            <FiInfo className="inline-block ml-1" title="Email body" />
          </label>
          <textarea
            value={(data.body as string) || ''}
            onChange={(e) => onChange('body', e.target.value)}
            className="w-full h-24 px-3 py-2 border border-gray-600 rounded-md"
          />
          <VariablePicker
            onSelect={(v) =>
              onChange('body', ((data.body as string) || '') + v)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Attachments (comma separated URLs)
            <FiInfo className="inline-block ml-1" title="Attachment links" />
          </label>
          <input
            type="text"
            value={(data.attachments as string) || ''}
            onChange={(e) => onChange('attachments', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          />
          <VariablePicker
            onSelect={(v) =>
              onChange('attachments', ((data.attachments as string) || '') + v)
            }
          />
        </div>
      </fieldset>
    </div>
  );
}
