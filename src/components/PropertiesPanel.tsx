import { useEffect, useState } from "react";
import { FiSettings, FiX } from "react-icons/fi";
import type { Node } from "reactflow";
import WebhookSettings from "./WebhookSettings";
import CodeSettings from "./CodeSettings";
import SetSettings from "./SetSettings";
import DelaySettings from "./DelaySettings";
import MergeSettings from "./MergeSettings";
import IfSettings from "./IfSettings";
import EmailSettings from "./EmailSettings";
import AirtableSettings from "./AirtableSettings";
import HttpRequestSettings from "./HttpRequestSettings";

interface PropertiesPanelProps {
  node: Node;
  onUpdateNode: (nodeId: string, newData: Record<string, unknown>) => void;
  onClose: () => void;
}

export default function PropertiesPanel({
  node,
  onUpdateNode,
  onClose,
}: PropertiesPanelProps) {
  const [formData, setFormData] = useState(node.data);
  const [isValid, setIsValid] = useState(true);

  const handleLabelChange = (value: string) => {
    const newData = { ...formData, label: value };
    setFormData(newData);
    onUpdateNode(node.id, {
      label: value,
      description: (newData as { description?: string }).description ?? "",
    });
  };

  const handleDescriptionChange = (value: string) => {
    const newData = { ...formData, description: value };
    setFormData(newData);
    onUpdateNode(node.id, {
      label: (newData as { label?: string }).label ?? "",
      description: value,
    });
  };

  useEffect(() => {
    setFormData(node.data);
    setIsValid(true);
  }, [node]);

  const handleInputChange = (field: string, value: unknown) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    onUpdateNode(node.id, { [field]: value });
  };

  const handleTestNode = () => {
    if (!isValid) {
      alert('Please fix validation errors before testing.');
      return;
    }
    alert('Testing node...');
  };



  const renderProperties = () => {
    switch (node.type) {
      case "httpRequest":
        return (
          <HttpRequestSettings
            data={formData}
            onChange={handleInputChange}
            onValidationChange={setIsValid}
          />
        );
      case "webhook":
        return <WebhookSettings data={formData} onChange={handleInputChange} />;
      case "code":
      case "function":
      case "functionItem":
        return <CodeSettings data={formData} onChange={handleInputChange} />;
      case "set":
        return <SetSettings data={formData} onChange={handleInputChange} />;
      case "delay":
        return <DelaySettings data={formData} onChange={handleInputChange} />;
      case "merge":
        return <MergeSettings data={formData} onChange={handleInputChange} />;
      case "if":
        return <IfSettings data={formData} onChange={handleInputChange} />;
      case "email":
        return <EmailSettings data={formData} onChange={handleInputChange} />;
      case "airtable":
        return (
          <AirtableSettings data={formData} onChange={handleInputChange} />
        );
      default:
        return <div className="text-gray-400">No properties available</div>;
    }
  };

  // Add tab state
  const [activeTab, setActiveTab] = useState<"parameters" | "settings" | "docs">(
    "parameters"
  );

  // Render Input Tab Content
  const renderParametersTab = () => {
    if (node.type === "webhook") {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center gap-3">
          <h6 className="tracking-[3px] uppercase text-md font-semibold text-[#909298]">
            Pull in events from Webhook
          </h6>
          <button
            className="px-3 py-1 border rounded bg-blue-500 text-white"
            onClick={() => handleInputChange("isListening", true)}
          >
            Listen for test event
          </button>
          <p className="text-xs text-gray-500 px-2">
            Once you've finished building your workflow, run it without having
            to click this button by using the production webhook URL.
          </p>
        </div>
      );
    }
    return (
      <h6 className="tracking-[3px] uppercase text-md text-left font-semibold text-[#909298]">
        Parameters
      </h6>
    );
  };

  // Render Docs Tab Content (placeholder)
  const renderDocsTab = () => (
    <div className="h-full flex flex-col items-center justify-center text-center gap-3">
      <h6 className="tracking-[3px] uppercase text-md font-semibold text-[#909298]">
        Docs
      </h6>
      <p className="text-xs text-gray-500 px-2">
        Documentation preview or configuration will appear here.
      </p>
    </div>
  );

  return (
    <div className="fixed top-0 right-0 h-full w-[480px] max-w-full z-50 bg-white shadow-2xl border-l border-gray-300 flex flex-col">
      <div className="p-4 flex items-center justify-between bg-[#f1f3f9] border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FiSettings className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        </div>
        <button
          className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-gray-900 px-2 py-1 rounded focus:outline-none"
          onClick={onClose}
        >
          <FiX className="w-5 h-5" />
          {/* <span className="hidden md:inline">Close</span> */}
        </button>
      </div>
      <div className="p-4 space-y-2 border-b border-gray-200 bg-white">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Label
          </label>
          <input
            type="text"
            value={formData.label || ""}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <input
            type="text"
            value={(formData as { description?: string }).description || ""}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === "parameters"
              ? "border-b-2 border-blue-500 text-blue-600 bg-gray-50"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("parameters")}
        >
          Parameters
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === "settings"
              ? "border-b-2 border-blue-500 text-blue-600 bg-gray-50"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === "docs"
              ? "border-b-2 border-blue-500 text-blue-600 bg-gray-50"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("docs")}
        >
          Docs
        </button>
      </div>
      {/* Tab Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {activeTab === "parameters" && (
          <div className="flex-1 p-4 overflow-y-auto">{renderParametersTab()}</div>
        )}
        {activeTab === "settings" && (
          <>
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800 mb-2">
                Node: {formData.label}
              </h3>
              <p className="text-sm text-gray-400">ID: {node.id}</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {renderProperties()}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                className="px-3 py-2 bg-blue-500 text-white rounded"
                onClick={handleTestNode}
              >
                Test Node
              </button>
            </div>
          </>
        )}
        {activeTab === "docs" && (
          <div className="flex-1 p-4 overflow-y-auto">{renderDocsTab()}</div>
        )}
      </div>
    </div>
  );
}
