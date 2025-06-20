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
import JsonViewer from "./JsonViewer";
import { useWorkflowStore } from "../store/workflowStore";

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
  // Combined validity of child settings components
  const [isValid, setIsValid] = useState(true);
  // Error for the HTTP request URL field
  const [urlError, setUrlError] = useState('');
  const [testOutput, setTestOutput] = useState<unknown>(null);
  const inputItems =
    useWorkflowStore((state) => state.inputByNode[node.id] || []);
  const outputItems =
    useWorkflowStore((state) => state.outputByNode[node.id] || []);

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
    setUrlError('');
  }, [node]);

  // Validate HTTP request URL
  // Validate the HTTP request URL whenever it or the node type changes
  useEffect(() => {
    if (node.type === 'httpRequest') {
      if (!(formData.url as string)?.trim()) {
        setUrlError('URL is required');
        setIsValid(false);
      } else {
        setUrlError('');
        setIsValid(true);
      }
    }
  }, [node.type, formData.url]);

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

  // Triggered by "Test Node" button
  const handleTestNode = async () => {
    if (!isValid) {
      alert('Please fix validation errors before testing.');
      return;
    }

    const method = (formData.method as string) || 'GET';
    const url = (formData.url as string) ||
      'https://jsonplaceholder.typicode.com/todos/1';

    let headers: Record<string, string> = {};
    try {
      if (formData.headers) {
        headers = JSON.parse(formData.headers as string);
      }
    } catch {
      // ignore parse errors
    }

    let body: BodyInit | undefined;
    if (formData.body && method !== 'GET') {
      try {
        body = JSON.stringify(JSON.parse(formData.body as string));
      } catch {
        body = String(formData.body);
      }
    }

    try {
      const res = await fetch(url, { method, headers, body });
      const json = await res.json();
      setTestOutput(json);
    } catch (err) {
      setTestOutput({ error: String(err) });
    }

    setActiveTab('docs');
  };

  // Handle multiple file input for HTTP request with key names (UI-based)
  const [fileInputs, setFileInputs] = useState<
    Array<{ key: string; file?: File }>
  >([]);

  const handleAddFileInput = () => {
    setFileInputs([...fileInputs, { key: "" }]);
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


  const renderHttpRequestProperties = () => (
    <div className="space-y-4 text-left">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Method
        </label>
        <select
          value={formData.method || "GET"}
          onChange={(e) => handleInputChange("method", e.target.value)}
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
        <label className="block text-sm font-medium text-gray-600 mb-2">
          URL
        </label>
        <input
          type="text"
          value={formData.url || ""}
          onChange={(e) => handleInputChange("url", e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className={`w-full px-3 py-2 border rounded-md ${urlError ? 'border-red-500' : 'border-gray-600'}`}
        />
        {urlError && (
          <p className="text-red-500 text-xs mt-1">{urlError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Headers (JSON)
        </label>
        <textarea
          value={formData.headers}
          onChange={(e) => handleInputChange("headers", e.target.value)}
          placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
          className="w-full h-24 px-3 py-2  border border-gray-600 rounded-md  font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Body
        </label>
        <textarea
          value={formData.body || ""}
          onChange={(e) => handleInputChange("body", e.target.value)}
          placeholder="{name: 'John Doe', age: 30}"
          className="w-full h-32 px-3 py-2  border border-gray-600 rounded-md font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          File Upload
        </label>
        <div className="space-y-2">
          {fileInputs.map((input, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Key name"
                value={input.key}
                onChange={(e) => handleFileKeyChange(idx, e.target.value)}
                className="px-2 py-1 border border-gray-400 rounded w-1/3"
              />
              <label className="relative w-2/3">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(idx, e.target.files?.[0])}
                  className="px-2 py-1 border border-gray-400 rounded w-full opacity-0 absolute left-0 top-0 h-full cursor-pointer"
                  value={undefined}
                />
                <span className="block px-2 py-1 border border-gray-400 rounded w-full bg-white text-left cursor-pointer truncate">
                  {input.file ? input.file.name : "No file chosen"}
                </span>
              </label>
              <button
                type="button"
                onClick={() => handleRemoveFileInput(idx)}
                className="!bg-red-400 p-2 rounded text-white text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddFileInput}
          className="!bg-violet-500 mt-2 px-3 py-2 bg-blue-500 text-white rounded text-xs"
        >
          Add File
        </button>
      </div>
    </div>
  );

  const renderProperties = () => {
    switch (node.type) {
      case "httpRequest":
        return renderHttpRequestProperties();
      case "webhook":
        return (
          <WebhookSettings
            data={formData}
            onChange={handleInputChange}
            onValidationChange={setIsValid}
          />
        );
      case "code":
      case "function":
      case "functionItem":
        return (
          <CodeSettings
            data={formData}
            onChange={handleInputChange}
            onValidationChange={setIsValid}
          />
        );
      case "set":
        return (
          <SetSettings
            data={formData}
            onChange={handleInputChange}
            onValidationChange={setIsValid}
          />
        );
      case "delay":
        return (
          <DelaySettings
            data={formData}
            onChange={handleInputChange}
            onValidationChange={setIsValid}
          />
        );
      case "merge":
        return (
          <MergeSettings
            data={formData}
            onChange={handleInputChange}
            onValidationChange={setIsValid}
          />
        );
      case "if":
        return (
          <IfSettings
            data={formData}
            onChange={handleInputChange}
            onValidationChange={setIsValid}
          />
        );
      case "email":
        return (
          <EmailSettings
            data={formData}
            onChange={handleInputChange}
            onValidationChange={setIsValid}
          />
        );
      case "airtable":
        return (
          <AirtableSettings
            data={formData}
            onChange={handleInputChange}
            onValidationChange={setIsValid}
          />
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
          <button
            className={`mt-4 px-3 py-2 rounded text-white ${
              isValid ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleTestNode}
            disabled={!isValid}
          >
            Test Node
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <h6 className="tracking-[3px] uppercase text-md text-left font-semibold text-[#909298]">
          Parameters
        </h6>
        <button
          className={`self-start px-3 py-2 rounded text-white ${
            isValid ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleTestNode}
          disabled={!isValid}
        >
          Test Node
        </button>
      </div>
    );
  };

  // Render Docs/Output Tab
  const renderDocsTab = () => (
    <div className="h-full flex flex-col items-start gap-3">
      <h6 className="tracking-[3px] uppercase text-md font-semibold text-[#909298]">
        Output / Docs
      </h6>
      <div className="w-full">
        <div className="text-xs font-semibold">Input ({inputItems.length})</div>
        <JsonViewer data={inputItems} />
      </div>
      <div className="w-full">
        <div className="text-xs font-semibold">Output ({outputItems.length})</div>
        <JsonViewer data={outputItems} />
      </div>
      {testOutput && (
        <div className="w-full">
          <div className="text-xs font-semibold">Test Output</div>
          <JsonViewer data={testOutput} />
        </div>
      )}
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
                className={`px-3 py-2 rounded text-white ${
                  isValid ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={handleTestNode}
                disabled={!isValid}
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
