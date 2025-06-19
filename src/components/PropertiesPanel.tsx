import React, { useEffect, useState } from 'react';
import { FiSettings, FiArrowLeft } from 'react-icons/fi';
import type { Node } from 'reactflow';
import WebhookSettings from './WebhookSettings';
import CodeSettings from './CodeSettings';
import SetSettings from './SetSettings';
import DelaySettings from './DelaySettings';
import MergeSettings from './MergeSettings';
import IfSettings from './IfSettings';
import EmailSettings from './EmailSettings';
import AirtableSettings from './AirtableSettings';

interface PropertiesPanelProps {
  node: Node;
  onUpdateNode: (nodeId: string, newData: Record<string, unknown>) => void;
  onClose: () => void;
}

export default function PropertiesPanel({ node, onUpdateNode, onClose }: PropertiesPanelProps) {
  const [formData, setFormData] = useState(node.data);

  useEffect(() => {
    setFormData(node.data);
  }, [node]);

  // Sync fileInputs with formData.files when panel opens or node changes
  useEffect(() => {
    if (formData.files) {
      const newInputs = Object.entries(formData.files).map(([key, file]) => {
        const f = file as { name: string };
        return { key, file: f.name ? new File([], f.name) : undefined };
      });
      setFileInputs(newInputs);
    } else {
      setFileInputs([]);
    }
  }, [formData.files]);

  const handleInputChange = (field: string, value: unknown) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    onUpdateNode(node.id, { [field]: value });
  };

  // Handle multiple file input for HTTP request with key names (UI-based)
  const [fileInputs, setFileInputs] = useState<Array<{ key: string; file?: File }>>([]);

  const handleAddFileInput = () => {
    setFileInputs([...fileInputs, { key: '' }]);
  };

  const handleRemoveFileInput = (idx: number) => {
    const newInputs = [...fileInputs];
    newInputs.splice(idx, 1);
    setFileInputs(newInputs);
    // Remove from formData.files as well
    if (formData.files) {
      const filesCopy = { ...formData.files };
      const removedKey = Object.keys(formData.files)[idx];
      delete filesCopy[removedKey];
      setFormData({ ...formData, files: filesCopy });
      onUpdateNode(node.id, { files: filesCopy });
    }
  };

  const handleFileKeyChange = (idx: number, value: string) => {
    const newInputs = [...fileInputs];
    newInputs[idx].key = value;
    setFileInputs(newInputs);
  };

  const handleFileChange = (idx: number, file: File | undefined) => {
    const newInputs = [...fileInputs];
    newInputs[idx].file = file;
    setFileInputs(newInputs);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result ?? null;
        const key = newInputs[idx].key || file.name;
        const filesObj = {
          ...(formData.files || {}),
          [key]: { name: file.name, content },
        };
        setFormData({ ...formData, files: filesObj });
        onUpdateNode(node.id, { files: filesObj });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Example IF node configuration helpers (unused placeholder)

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
        <label className="block text-sm font-medium text-gray-600 mb-2">File Upload</label>
        <div className="space-y-2">
          {fileInputs.map((input, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Key name"
                value={input.key}
                onChange={e => handleFileKeyChange(idx, e.target.value)}
                className="px-2 py-1 border border-gray-400 rounded w-1/3"
              />
              <label className="relative w-2/3">
                <input
                  type="file"
                  onChange={e => handleFileChange(idx, e.target.files?.[0])}
                  className="px-2 py-1 border border-gray-400 rounded w-full opacity-0 absolute left-0 top-0 h-full cursor-pointer"
                  value={undefined}
                />
                <span className="block px-2 py-1 border border-gray-400 rounded w-full bg-white text-left cursor-pointer truncate">
                  {input.file ? input.file.name : 'No file chosen'}
                </span>
              </label>
              <button type="button" onClick={() => handleRemoveFileInput(idx)} className="!bg-red-400 p-2 rounded text-white text-xs">Remove</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddFileInput} className="!bg-violet-500 mt-2 px-3 py-2 bg-blue-500 text-white rounded text-xs">Add File</button>
      </div>
    </div>
  );


  const renderProperties = () => {
    switch (node.type) {
      case 'httpRequest':
        return renderHttpRequestProperties();
      case 'webhook':
        return <WebhookSettings data={formData} onChange={handleInputChange} />;
      case 'code':
      case 'function':
      case 'functionItem':
        return <CodeSettings data={formData} onChange={handleInputChange} />;
      case 'set':
        return <SetSettings data={formData} onChange={handleInputChange} />;
      case 'delay':
        return <DelaySettings data={formData} onChange={handleInputChange} />;
      case 'merge':
        return <MergeSettings data={formData} onChange={handleInputChange} />;
      case 'if':
        return <IfSettings data={formData} onChange={handleInputChange} />;
      case 'email':
        return <EmailSettings data={formData} onChange={handleInputChange} />;
      case 'airtable':
        return <AirtableSettings data={formData} onChange={handleInputChange} />;
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
    <div className="fixed inset-0 bg-[#444257bf] z-90" onClick={onClose}>
      <span
        className="text-white flex items-center gap-2 cursor-pointer absolute top-2 left-4 p-2"
        onClick={onClose}
      >
        <FiArrowLeft className="w-5 h-5 text-white" />
        Back to canvas
      </span>
      <div
        className="p-6 flex items-center justify-center z-50 my-8 h-[calc(100%-64px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#f1f3f9] h-full  w-[30%] p-4 rounded-tl-lg flex items-center justify-center">
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
        <div className="bg-[#f1f3f9] h-full  w-[30%] p-4 rounded-tr-lg">
          <h6 className="tracking-[3px] uppercase text-md text-left font-semibold text-[#909298]">
            Output
          </h6>
        </div>
      </div>
    </div>
  );
};