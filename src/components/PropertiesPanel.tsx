import React, { useEffect, useState } from 'react';
import { FiSettings, FiArrowLeft } from 'react-icons/fi';
import type { Node } from 'reactflow';
import WebhookSettings from './WebhookSettings';
import HttpRequestSettings from './HttpRequestSettings';
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

  const handleInputChange = (field: string, value: unknown) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    onUpdateNode(node.id, { [field]: value });
  };

  const renderProperties = () => {
    switch (node.type) {
      case 'httpRequest':
        return <HttpRequestSettings data={formData} onChange={handleInputChange} />;
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
}
