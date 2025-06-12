import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface WebhookSettings {
  testUrl: string;
  prodUrl: string;
  path: string;
  method: string;
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
  const [path, setPath] = useState('');
  const [method, setMethod] = useState('GET');
  const [auth, setAuth] = useState('None');
  const [respond, setRespond] = useState('Immediately');
  const [prodUrl, setProdUrl] = useState('');
  const [testUrl, setTestUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [displayNote, setDisplayNote] = useState(false);

  useEffect(() => {
    const id = initialData?.path || uuidv4();
    setPath(id);
    setMethod(initialData?.method || 'GET');
    setAuth(initialData?.auth || 'None');
    setRespond(initialData?.respond || 'Immediately');
    const baseTest = initialData?.testUrl?.split(id)[0] || 'https://example.com/webhook-test/';
    const baseProd = initialData?.prodUrl?.split(id)[0] || 'https://example.com/webhook/';
    setTestUrl(`${baseTest}${id}`);
    setProdUrl(initialData?.prodUrl || `${baseProd}${id}`);
    setNotes(initialData?.notes || '');
    setDisplayNote(initialData?.displayNote || false);
  }, [initialData]);

  const handleSave = () => {
    onSave({ path, method, auth, respond, prodUrl, testUrl, notes, displayNote, isListening: initialData?.isListening });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md w-96" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">Configure Webhook</h3>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm mb-1">Test URL</label>
            <input className="w-full border px-2 py-1" value={testUrl} readOnly />
          </div>
          <div>
            <label className="block text-sm mb-1">Production URL</label>
            <input className="w-full border px-2 py-1" value={prodUrl} onChange={e => setProdUrl(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">HTTP Method</label>
            <select className="w-full border px-2 py-1" value={method} onChange={e => setMethod(e.target.value)}>
              {['GET','POST','PUT','DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Path</label>
            <input className="w-full border px-2 py-1" value={path} onChange={e => setPath(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Authentication</label>
            <select className="w-full border px-2 py-1" value={auth} onChange={e => setAuth(e.target.value)}>
              <option value="None">None</option>
              <option value="Basic">Basic</option>
              <option value="Bearer">Bearer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Respond</label>
            <select className="w-full border px-2 py-1" value={respond} onChange={e => setRespond(e.target.value)}>
              <option value="Immediately">Immediately</option>
              <option value="After Workflow">After Workflow</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea className="w-full border px-2 py-1" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={displayNote} onChange={e => setDisplayNote(e.target.checked)} />
            <span className="text-sm">Display Note in Flow</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 border" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 border bg-blue-500 text-white" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
