import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { WebhookNodeData } from './nodes/WebhookNode';

interface WebhookSettingsModalProps {
  /** Existing data for the node being edited */
  data: WebhookNodeData;
  /** Called with updated data when the user saves */
  onSave: (data: WebhookNodeData) => void;
  /** Close the modal without saving */
  onClose: () => void;
  /** Base URLs used to build the test and production URLs */
  baseTestUrl: string;
  baseProdUrl: string;
}

/** Modal used to configure webhook nodes. */
export default function WebhookSettingsModal({
  data,
  onSave,
  onClose,
  baseTestUrl,
  baseProdUrl,
}: WebhookSettingsModalProps) {
  const [path, setPath] = useState(data.path || uuidv4());
  const [method, setMethod] = useState(data.method || 'POST');
  const [auth, setAuth] = useState(data.auth || 'None');
  const [respond, setRespond] = useState(data.respond || 'Immediately');
  const [prodUrl, setProdUrl] = useState(data.prodUrl || `${baseProdUrl}${path}`);
  const [notes, setNotes] = useState(data.notes || '');
  const [displayNote, setDisplayNote] = useState(data.displayNote ?? false);

  const testUrl = `${baseTestUrl}${path}`;

  const handleSave = () => {
    onSave({
      ...data,
      path,
      method,
      auth,
      respond,
      prodUrl,
      testUrl,
      notes,
      displayNote,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content space-y-4">
        <h2 className="text-lg font-semibold">Webhook Settings</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Test URL</label>
          <input type="text" className="input" value={testUrl} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Production URL</label>
          <input
            type="text"
            className="input"
            value={prodUrl}
            onChange={(e) => setProdUrl(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">HTTP Method</label>
          <select
            className="input"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Path</label>
          <input
            type="text"
            className="input"
            value={path}
            onChange={(e) => {
              const value = e.target.value;
              setPath(value);
              // Keep URLs in sync when path changes
              setProdUrl(`${baseProdUrl}${value}`);
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Authentication</label>
          <select
            className="input"
            value={auth}
            onChange={(e) => setAuth(e.target.value)}
          >
            <option value="None">None</option>
            <option value="Basic">Basic</option>
            <option value="Bearer">Bearer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Respond</label>
          <select
            className="input"
            value={respond}
            onChange={(e) => setRespond(e.target.value)}
          >
            <option value="Immediately">Immediately</option>
            <option value="After Workflow">After Workflow</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            className="input h-24"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="display-note"
            type="checkbox"
            checked={displayNote}
            onChange={(e) => setDisplayNote(e.target.checked)}
          />
          <label htmlFor="display-note" className="text-sm">
            Display note in Flow
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
