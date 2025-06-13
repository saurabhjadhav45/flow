import { useCallback } from "react";
import { useWorkflowStore } from "../store/workflowStore";

export function NodeConfigPanel() {
  const { selectedNode, nodes, updateNode } = useWorkflowStore();

  const selectedNodeData = nodes.find((node) => node.id === selectedNode);

  const handleConfigChange = useCallback(
    (field: string, value: unknown) => {
      if (!selectedNode) return;

      updateNode(selectedNode, {
        data: {
          ...selectedNodeData!.data,
          config: {
            ...(selectedNodeData!.data.config as Record<string, unknown>),
            [field]: value,
          },
        },
      });
    },
    [selectedNode, selectedNodeData, updateNode]
  );

  if (!selectedNode || !selectedNodeData) {
    return (
      <div className="w-64 h-full bg-white border-l p-4">
        <p className="text-gray-500">Select a node to configure</p>
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-white border-l p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Node Configuration</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node Name
          </label>
          <input
            type="text"
            value={selectedNodeData.data.label}
            onChange={(e) =>
              updateNode(selectedNode, {
                data: { ...selectedNodeData.data, label: e.target.value },
              })
            }
            className="input w-full"
          />
        </div>

        {/* Node type specific configuration */}
        {selectedNodeData.type === "httpRequest" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="text"
                value={
                  (selectedNodeData.data.config.url as string | undefined) ?? ""
                }
                onChange={(e) => handleConfigChange("url", e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                value={
                  (selectedNodeData.data.config.method as string | undefined) ??
                  "GET"
                }
                onChange={(e) => handleConfigChange("method", e.target.value)}
                className="input w-full"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>
        )}

        {selectedNodeData.type === "delay" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delay (ms)
            </label>
            <input
              type="number"
              value={
                (selectedNodeData.data.config.delay as number | undefined) ??
                1000
              }
              onChange={(e) =>
                handleConfigChange("delay", parseInt(e.target.value))
              }
              className="input w-full"
            />
          </div>
        )}

        {/* {selectedNodeData.type === 'setVariable' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variable Name
              </label>
              <input
                type="text"
                value={(selectedNodeData.data.config.variableName as string | undefined) ?? ''}
                onChange={(e) => handleConfigChange('variableName', e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={(selectedNodeData.data.config.value as string | undefined) ?? ''}
                onChange={(e) => handleConfigChange('value', e.target.value)}
                className="input w-full"
              />
            </div>
          </div>
        )}

        {selectedNodeData.type === 'condition' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <input
              type="text"
              value={(selectedNodeData.data.config.condition as string | undefined) ?? ''}
              onChange={(e) => handleConfigChange('condition', e.target.value)}
              className="input w-full"
              placeholder="e.g., value > 10"
            />
          </div>
        )} */}

        {selectedNodeData.type === "webhook" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook URL
            </label>
            <input
              type="text"
              value={
                (selectedNodeData.data.config.webhookUrl as
                  | string
                  | undefined) ?? ""
              }
              onChange={(e) => handleConfigChange("webhookUrl", e.target.value)}
              className="input w-full"
              placeholder="https://..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
