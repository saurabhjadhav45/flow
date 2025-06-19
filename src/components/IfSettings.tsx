
import { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';

interface IfSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function IfSettings({ data, onChange, onValidationChange }: IfSettingsProps) {
  const conditions = (data.conditions as Array<{ left: string; op: string; right: string }> | undefined) || [];

  // Displayed when any condition row is incomplete
  const [error, setError] = useState('');

  // Ensure each condition has both sides filled out
  useEffect(() => {
    const valid = conditions.every((c) => c.left.trim() && c.right.trim());
    setError(valid ? '' : 'All conditions require fields');
    onValidationChange?.(valid);
  }, [conditions, onValidationChange]);

  const handleConditionChange = (index: number, key: 'left' | 'op' | 'right', value: string) => {
    const newConditions = conditions.map((c, i) => (i === index ? { ...c, [key]: value } : c));
    onChange('conditions', newConditions);
  };

  const addCondition = () => {
    onChange('conditions', [...conditions, { left: '', op: '==', right: '' }]);
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    onChange('conditions', newConditions);
  };

  return (
    <div className="space-y-4 text-left overflow-x-hidden">
      <fieldset className="space-y-2">
        <legend className="font-medium">Conditions</legend>
        {conditions.map((c, idx) => (
          <div key={idx} className="flex flex-wrap items-center gap-2 min-w-0">
            <input
              type="text"
              value={c.left}
              onChange={(e) => handleConditionChange(idx, 'left', e.target.value)}
              placeholder="Field"
              className="flex-1 min-w-0 px-2 py-1 border border-gray-600 rounded-md"
            />
            <select
              value={c.op}
              onChange={(e) => handleConditionChange(idx, 'op', e.target.value)}
              className="px-2 py-1 border border-gray-600 rounded-md"
              style={{ maxWidth: 150 }}
            >
              <option value="==">equals</option>
              <option value="!=">not equals</option>
              <option value=">">greater than</option>
              <option value=">=">greater than or equal</option>
              <option value="<">less than</option>
              <option value="<=">less than or equal</option>
              <option value="contains">contains</option>
              <option value="not_contains">not contains</option>
              <option value="starts_with">starts with</option>
              <option value="ends_with">ends with</option>
            </select>
            <input
              type="text"
              value={c.right}
              onChange={(e) => handleConditionChange(idx, 'right', e.target.value)}
              placeholder="Value"
              className="flex-1 min-w-0 px-2 py-1 border border-gray-600 rounded-md"
            />
            <button
              onClick={() => removeCondition(idx)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={addCondition} className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
          Add Condition
        </button>
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-medium">Match</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Match
            <FiInfo className="inline-block ml-1" title="Condition join type" />
          </label>
          <select
            value={(data.andOr as string) || 'AND'}
            onChange={(e) => onChange('andOr', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
      </fieldset>
    </div>
  );
}
