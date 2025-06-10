
import { WorkflowEditor } from './components/WorkflowEditor';
import { NodePalette } from './components/NodePalette';
import { NodeConfigPanel } from './components/NodeConfigPanel';
import { Toolbar } from './components/Toolbar';
import { useWorkflowStore } from './store/workflowStore';
import "./App.css"

function App() {
  const sidebarOpen = useWorkflowStore((state) => state.sidebarOpen);

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
