import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { useThemeStore } from '../store/themeStore';
import { FiSun, FiMoon } from 'react-icons/fi';

export function Toolbar() {
  const { nodes, edges, clearWorkflow } = useWorkflowStore();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const theme = useThemeStore((state) => state.theme);

  const handleNewWorkflow = useCallback(() => {
    if (window.confirm('Are you sure you want to create a new workflow? All unsaved changes will be lost.')) {
      clearWorkflow();
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
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const text = await file.text();
          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
            alert('Invalid workflow file');
            return;
          }
          const store = useWorkflowStore.getState();
          store.setNodes(parsed.nodes);
          store.setEdges(parsed.edges);
          store.setSelectedNode(null);
          store.closeSidebar();
          store.setPendingConnection(null);
        } catch {
          alert('Invalid workflow file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

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
          className="btn btn-secondary opacity-50 cursor-not-allowed"
          disabled
        >
          Run
        </button>
        <button onClick={toggleTheme} className="btn btn-secondary">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </div>
  );
}
