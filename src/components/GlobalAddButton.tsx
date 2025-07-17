import { useWorkflowStore } from "../store/workflowStore";

export function GlobalAddButton() {
  const openSidebar = useWorkflowStore((state) => state.openSidebar);

  return (
    <button
      onClick={openSidebar}
      aria-label="Add node"
      className="btn-icon absolute w-8 h-8 top-4 right-4 border-2 bg-transparent hover:bg-blue-50dark:border-white dark:text-white dark:hover:bg-white/10"
    >
      +
    </button>
  );
}

export default GlobalAddButton;
