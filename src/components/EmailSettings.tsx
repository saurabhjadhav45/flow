import React from 'react';

interface EmailSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export default function EmailSettings({ data, onChange }: EmailSettingsProps) {
  return (
    <div className="space-y-4 text-left">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">SMTP Host</label>
        <input
          type="text"
          value={(data.smtpHost as string) || ''}
          onChange={(e) => onChange('smtpHost', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Port</label>
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
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
        <input
          type="text"
          value={(data.smtpUser as string) || ''}
          onChange={(e) => onChange('smtpUser', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
        <input
          type="password"
          value={(data.smtpPass as string) || ''}
          onChange={(e) => onChange('smtpPass', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">From</label>
        <input
          type="text"
          value={(data.from as string) || ''}
          onChange={(e) => onChange('from', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">To</label>
        <input
          type="text"
          value={(data.to as string) || ''}
          onChange={(e) => onChange('to', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
        <input
          type="text"
          value={(data.subject as string) || ''}
          onChange={(e) => onChange('subject', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Body</label>
        <textarea
          value={(data.body as string) || ''}
          onChange={(e) => onChange('body', e.target.value)}
          className="w-full h-24 px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Attachments (comma separated URLs)</label>
        <input
          type="text"
          value={(data.attachments as string) || ''}
          onChange={(e) => onChange('attachments', e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
        />
      </div>
    </div>
  );
}
