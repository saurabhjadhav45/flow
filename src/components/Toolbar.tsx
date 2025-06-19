import { useCallback, useState } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { useThemeStore } from '../store/themeStore';
import { initializeNodeId } from '../utils/getNodeId';
import type { WorkflowNode } from '../types/workflow';
import { setupEdges } from '../utils/setupEdges';
import { FiSun, FiMoon } from 'react-icons/fi';
import { executeWorkflow } from '../utils/executeWorkflow';
import { runNode } from '../nodes/executors';

export function Toolbar() {
  const {
    nodes,
    edges,
    clearWorkflow,
    openSidebar,
    setPendingConnection,
    deleteEdge,
  } = useWorkflowStore();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const theme = useThemeStore((state) => state.theme);

  const handleNewWorkflow = useCallback(() => {
    if (window.confirm('Are you sure you want to create a new workflow? All unsaved changes will be lost.')) {
      clearWorkflow();
      initializeNodeId([]);
    }
  }, [clearWorkflow]);

  const handleSave = useCallback(() => {
    const workflow = {
      nodes,
      edges,
    };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleLoad = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const workflow = JSON.parse(event.target?.result as string);
            // TODO: Validate workflow structure
            const edgesWithHandlers = setupEdges(workflow.edges || [], {
              onAdd: ({ source, sourceHandle, target, edgeId }) => {
                setPendingConnection({
                  source,
                  sourceHandle,
                  target,
                  edgeId,
                });
                openSidebar();
              },
              onDelete: deleteEdge,
            });

            useWorkflowStore.setState({
              nodes: workflow.nodes,
              edges: edgesWithHandlers,
            });
            initializeNodeId((workflow.nodes as WorkflowNode[]) || []);
          } catch {
            alert('Invalid workflow file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [deleteEdge, openSidebar, setPendingConnection]);

  const setNodeResult = useWorkflowStore((s) => s.setNodeResult);
  const setNodeError = useWorkflowStore((s) => s.setNodeError);
  const setNodeInput = useWorkflowStore((s) => s.setNodeInput);
  const setNodeStatus = useWorkflowStore((s) => s.setNodeStatus);
  const clearResults = useWorkflowStore((s) => s.clearResults);
  const [running, setRunning] = useState(false);

  const handleRun = useCallback(async () => {
    setRunning(true);
    clearResults();
    try {
      await executeWorkflow(
        nodes,
        edges,
        (n) => n.data,
        runNode,
        setNodeResult,
        setNodeError,
        setNodeInput,
        setNodeStatus
      );
    } finally {
      setRunning(false);
    }
  }, [
    nodes,
    edges,
    clearResults,
    setNodeResult,
    setNodeError,
    setNodeInput,
    setNodeStatus,
  ]);

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleNewWorkflow}
          className="btn btn-secondary"
        >
          New Workflow
        </button>
        <button
          onClick={handleSave}
          className="btn btn-primary"
        >
          Save
        </button>
        <button
          onClick={handleLoad}
          className="btn btn-secondary"
        >
          Load
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className={`btn btn-secondary ${running ? 'opacity-50 cursor-wait' : ''}`}
          onClick={handleRun}
          disabled={running}
        >
          {running ? 'Running...' : 'Run'}
        </button>
        <button onClick={toggleTheme} className="btn btn-secondary">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </div>
  );
}
