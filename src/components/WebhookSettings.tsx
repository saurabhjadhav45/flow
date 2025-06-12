interface WebhookSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export default function WebhookSettings({ data, onChange }: WebhookSettingsProps) {
  return (
    <div className="space-y-3 text-left">
      <div>
        <label className="block text-sm mb-1">Test URL</label>
        <input
          className="w-full border px-2 py-1"
          value={data.testUrl as string || ''}
          readOnly
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Production URL</label>
        <input
          className="w-full border px-2 py-1"
          value={data.prodUrl as string || ''}
          onChange={(e) => onChange('prodUrl', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">HTTP Method</label>
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
        <label className="block text-sm mb-1">Path</label>
        <input
          className="w-full border px-2 py-1"
          value={data.path as string || ''}
          onChange={(e) => onChange('path', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Authentication</label>
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
      <div>
        <label className="block text-sm mb-1">Respond</label>
        <select
          className="w-full border px-2 py-1"
          value={(data.respond as string) || 'Immediately'}
          onChange={(e) => onChange('respond', e.target.value)}
        >
          <option value="Immediately">Immediately</option>
          <option value="After Workflow">After Workflow</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Notes</label>
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
    </div>
  );
}
