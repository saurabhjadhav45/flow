import { useWorkflowStore } from '../store/workflowStore';

interface VariablePickerProps {
  /** Called with the selected variable expression */
  onSelect: (variableExpression: string) => void;
  /** Optional label for the select element */
  label?: string;
}

export default function VariablePicker({ onSelect, label }: VariablePickerProps) {
  const variables = useWorkflowStore((state) => state.variables);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      onSelect(`{{${val}}}`);
      e.target.selectedIndex = 0;
    }
  };

  if (!variables.length) {
    return null;
  }

  return (
    <div className="mt-2">
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}
      <select
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-600 rounded-md"
        defaultValue=""
      >
        <option value="" disabled>
          Insert variable...
        </option>
        {variables.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
