import React, { useState, useEffect } from 'react';
import { FiSettings, FiArrowLeft } from 'react-icons/fi';
import type { Node } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

interface PropertiesPanelProps {
  node: Node;
  onUpdateNode: (nodeId: string, newData: Record<string, unknown>) => void;
  onClose: () => void;
}

export default function PropertiesPanel({ node, onUpdateNode, onClose }: PropertiesPanelProps) {
  // Local state for form inputs to ensure smooth typing
  const [formData, setFormData] = useState(node.data);

  // Update local state when node changes
  useEffect(() => {
    let data: Record<string, unknown> = { ...node.data };
    if (node.type === 'webhook') {
      const defaults: Record<string, unknown> = {};
      const id = (data.path as string) || uuidv4();
      if (!data.path) defaults.path = id;
      if (!data.method) defaults.method = 'GET';
      if (!data.auth) defaults.auth = 'None';
      if (!data.respond) defaults.respond = 'Immediately';
      const baseTest = (data.testUrl as string)?.split(id)[0] ||
        'https://example.com/webhook-test/';
      const baseProd = (data.prodUrl as string)?.split(id)[0] ||
        'https://example.com/webhook/';
      if (!data.testUrl) defaults.testUrl = `${baseTest}${id}`;
      if (!data.prodUrl) defaults.prodUrl = `${baseProd}${id}`;
      if (!data.notes) defaults.notes = '';
      if (data.displayNote === undefined) defaults.displayNote = false;

      if (Object.keys(defaults).length) {
        onUpdateNode(node.id, defaults);
        data = { ...data, ...defaults };
      }
    }
    setFormData(data);
  }, [node, onUpdateNode]);

  const handleInputChange = (field: string, value: unknown) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    onUpdateNode(node.id, { [field]: value });
  };

  // Handle file input for HTTP request
  const handleHttpFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        const newFormData = {
          ...formData,
          fileName: file.name,
          fileContent: content,
        };
        setFormData(newFormData);
        onUpdateNode(node.id, { fileName: file.name, fileContent: content });
      };
      reader.readAsArrayBuffer(file); // Use ArrayBuffer for binary support
    }
  };

  const renderHttpRequestProperties = () => (
    <div className="space-y-4 text-left">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Method</label>
        <select
          value={formData.method || 'GET'}
          onChange={(e) => handleInputChange('method', e.target.value)}
          className="w-full px-3 py-2  border border-gray-600 rounded-md"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">URL</label>
        <input
          type="text"
          value={formData.url || ''}
          onChange={(e) => handleInputChange('url', e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="w-full px-3 py-2  border border-gray-600 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Headers (JSON)</label>
        <textarea
          value={formData.headers}
          onChange={(e) => handleInputChange('headers', e.target.value)}
          placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
          className="w-full h-24 px-3 py-2  border border-gray-600 rounded-md  font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Body</label>
        <textarea
          value={formData.body || ''}
          onChange={(e) => handleInputChange('body', e.target.value)}
          placeholder="{name: 'John Doe', age: 30}"
          className="w-full h-32 px-3 py-2  border border-gray-600 rounded-md font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">File Upload (optional)</label>
        <input
          type="file"
          onChange={handleHttpFileChange}
          className="w-full px-3 py-2 border border-gray-600 rounded-md"
          value={undefined} // Prevent React warning, file inputs are always uncontrolled
        />
        {formData.fileName && (
          <div className="mt-2 text-xs text-gray-700">Selected file: {formData.fileName}</div>
        )}
      </div>
    </div>
  );

  const renderWebhookProperties = () => (
    <div className="space-y-3 text-left">
      <div>
        <label className="block text-sm mb-1">Test URL</label>
        <input
          className="w-full border px-2 py-1"
          value={formData.testUrl || ''}
          readOnly
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Production URL</label>
        <input
          className="w-full border px-2 py-1"
          value={formData.prodUrl || ''}
          onChange={(e) => handleInputChange('prodUrl', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">HTTP Method</label>
        <select
          className="w-full border px-2 py-1"
          value={formData.method || 'GET'}
          onChange={(e) => handleInputChange('method', e.target.value)}
        >
          {['GET', 'POST', 'PUT', 'DELETE'].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Path</label>
        <input
          className="w-full border px-2 py-1"
          value={formData.path || ''}
          onChange={(e) => handleInputChange('path', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Authentication</label>
        <select
          className="w-full border px-2 py-1"
          value={formData.auth || 'None'}
          onChange={(e) => handleInputChange('auth', e.target.value)}
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
          value={formData.respond || 'Immediately'}
          onChange={(e) => handleInputChange('respond', e.target.value)}
        >
          <option value="Immediately">Immediately</option>
          <option value="After Workflow">After Workflow</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Notes</label>
        <textarea
          className="w-full border px-2 py-1"
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!formData.displayNote}
          onChange={(e) => handleInputChange('displayNote', e.target.checked)}
        />
        <span className="text-sm">Display Note in Flow</span>
      </div>
    </div>
  );


  const renderProperties = () => {
    switch (node.type) {
      case 'httpRequest':
        return renderHttpRequestProperties();
      case 'webhook':
        return renderWebhookProperties();
      default:
        return <div className="text-gray-400">No properties available</div>;
    }
  };

  const renderInputSection = () => {
    if (node.type === 'webhook') {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center gap-3">
          <h6 className="tracking-[3px] uppercase text-md font-semibold text-[#909298]">
            Pull in events from Webhook
          </h6>
          <button
            className="px-3 py-1 border rounded bg-blue-500 text-white"
            onClick={() => handleInputChange('isListening', true)}
          >
            Listen for test event
          </button>
          <p className="text-xs text-gray-500 px-2">
            Once you've finished building your workflow, run it without having to click this button by using the production webhook URL.
          </p>
        </div>
      );
    }
    return (
      <h6 className="tracking-[3px] uppercase text-md text-left font-semibold text-[#909298]">
        Input
      </h6>
    );
  };

  return (
    <div className='fixed inset-0 bg-[#444257bf] z-90' onClick={onClose}>
      <span className='text-white flex items-center gap-2 cursor-pointer absolute top-2 left-4 p-2'
        onClick={onClose}>
        <FiArrowLeft className="w-5 h-5 text-white"/>
        Back to canvas
      </span>
    <div className="p-6 flex items-center justify-center z-50 my-8 h-[calc(100%-64px)]" onClick={(e) => e.stopPropagation()}>
      <div className='bg-[#f1f3f9] h-full  w-[30%] p-4 rounded-tl-lg flex items-center justify-center'>
        {renderInputSection()}
      </div>
      <div className="w-96 rounded-lg border border-gray-300 flex flex-col w-[40%] h-[calc(100%+48px)]">
        <div className="p-4 flex items-center justify-between bg-[#f1f3f9] rounded-tl-lg rounded-tr-lg">
          <div className="flex items-center gap-2">
            <FiSettings className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-white rounded-bl-lg rounded-br-lg">
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Node: {formData.label}</h3>
            <p className="text-sm text-gray-400">ID: {node.id}</p>
          </div>

          {renderProperties()}
        </div>
      </div>
      <div className='bg-[#f1f3f9] h-full  w-[30%] p-4 rounded-tr-lg'>
        <h6 className='tracking-[3px] uppercase text-md text-left font-semibold text-[#909298]'>
          Output
        </h6>
      </div>
    </div>
    </div>
  );
}