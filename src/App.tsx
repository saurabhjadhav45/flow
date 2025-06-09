
import { WorkflowEditor } from './components/WorkflowEditor';
import { NodePalette } from './components/NodePalette';
import { NodeConfigPanel } from './components/NodeConfigPanel';
import { Toolbar } from './components/Toolbar';
import "./App.css"

function App() {
  return (
      <div className="h-screen flex flex-col">
        <Toolbar />
        <div className="flex-1 flex">
          <NodePalette />
          <div className="flex-1 relative">
            <WorkflowEditor />
          </div>
          {/* <NodeConfigPanel /> */}
        </div>
      </div>
  );
}

export default App;
