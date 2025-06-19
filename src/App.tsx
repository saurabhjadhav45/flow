
import { WorkflowEditor } from './components/WorkflowEditor';
import { NodePalette } from './components/NodePalette';
import { Toolbar } from './components/Toolbar';
import { useWorkflowStore } from './store/workflowStore';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { useNodesStore } from './store/nodes';
import "./App.css"

function App() {
  const sidebarOpen = useWorkflowStore((state) => state.sidebarOpen);
  const theme = useThemeStore((state) => state.theme);
  const nodes = useNodesStore((s) => s.nodes);
  const select = useNodesStore((s) => s.select);
  const selected = useNodesStore((s) => s.selected);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <div className="flex-1 relative">
        <WorkflowEditor />
        {sidebarOpen && <NodePalette />}
        <div className="absolute top-4 left-4 space-x-2">
          {nodes.map((n) => (
            <button
              key={n.id}
              onClick={() => select(n.id)}
              className="border px-2 py-1 rounded bg-white"
            >
              {n.type} {n.id}
            </button>
          ))}
        </div>
        {selected && <Sidebar />}
      </div>
    </div>
  );
}

export default App;
