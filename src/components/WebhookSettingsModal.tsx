import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface WebhookSettings {
  testUrl: string;
  prodUrl: string;
  method: string;
  path: string;
  auth: string;
  respond: string;
  notes: string;
  displayNote: boolean;
  isListening?: boolean;
}

interface Props {
  open: boolean;
  initialData?: Partial<WebhookSettings>;
  onSave: (data: WebhookSettings) => void;
  onClose: () => void;
}

export default function WebhookSettingsModal({ open, initialData, onSave, onClose }: Props) {
  const [testUrl, setTestUrl] = useState('');
  const [prodUrl, setProdUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('');
  const [auth, setAuth] = useState('None');
  const [respond, setRespond] = useState('Immediately');
  const [notes, setNotes] = useState('');
  const [displayNote, setDisplayNote] = useState(false);

  useEffect(() => {
    const uuid = initialData?.path ?? uuidv4();
    const baseTest = initialData?.testUrl?.replace(/\/[^/]*$/, '') || 'https://example.com/webhook-test';
    const baseProd = initialData?.prodUrl?.replace(/\/[^/]*$/, '') || 'https://example.com/webhook';
    setPath(uuid);
    setMethod(initialData?.method ?? 'GET');
    setAuth(initialData?.auth ?? 'None');
    setRespond(initialData?.respond ?? 'Immediately');
    setNotes(initialData?.notes ?? '');
    setDisplayNote(initialData?.displayNote ?? false);
    setTestUrl(`${baseTest}/${uuid}`);
    setProdUrl(initialData?.prodUrl ?? `${baseProd}/${uuid}`);
  }, [initialData]);

  const handleSave = () => {
    onSave({
      testUrl,
      prodUrl,
      method,
      path,
      auth,
      respond,
      notes,
      displayNote,
      isListening: initialData?.isListening ?? false,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="bg-white dark:bg-gray-800 rounded p-6 w-96 max-h-full overflow-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Configure Webhook</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Test URL</label>
            <input type="text" value={testUrl} readOnly className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Production URL</label>
            <input type="text" value={prodUrl} onChange={e => setProdUrl(e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">HTTP Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="input w-full">
              {['GET','POST','PUT','DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Path</label>
            <input type="text" value={path} onChange={e => setPath(e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Authentication</label>
            <select value={auth} onChange={e => setAuth(e.target.value)} className="input w-full">
              <option value="None">None</option>
              <option value="Basic">Basic</option>
              <option value="Bearer">Bearer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Respond</label>
            <select value={respond} onChange={e => setRespond(e.target.value)} className="input w-full">
              <option value="Immediately">Immediately</option>
              <option value="After Workflow">After Workflow</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input w-full" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={displayNote} onChange={e => setDisplayNote(e.target.checked)} />
            <span className="text-sm">Display Note in Flow</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
