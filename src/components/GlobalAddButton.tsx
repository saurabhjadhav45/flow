import { useWorkflowStore } from '../store/workflowStore';

export function GlobalAddButton() {
  const openSidebar = useWorkflowStore(state => state.openSidebar);

  return (
    <button
      onClick={openSidebar}
      className="absolute top-4 right-4 z-10 p-2 rounded-full bg-blue-500 text-white shadow"
      aria-label="Add node"
    >
      +
    </button>
  );
}

export default GlobalAddButton;
