
import { WorkflowEditor } from './components/WorkflowEditor';
import { NodePalette } from './components/NodePalette';
import { Toolbar } from './components/Toolbar';
import { useWorkflowStore } from './store/workflowStore';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';
import "./App.css"

function App() {
  const sidebarOpen = useWorkflowStore((state) => state.sidebarOpen);
  const theme = useThemeStore((state) => state.theme);

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
        {/* <NodeConfigPanel /> */}
      </div>
    </div>
  );
}

export default App;
