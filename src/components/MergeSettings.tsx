
import { useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';
import ExpressionInput from './ExpressionInput';

interface MergeSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function MergeSettings({ data, onChange, onValidationChange }: MergeSettingsProps) {
  // Merge node currently has no required fields but still reports validity
  useEffect(() => {
    onValidationChange?.(true);
  }, [onValidationChange]);
  return (
    <div className="space-y-4 text-left">
      <fieldset className="space-y-4">
        <legend className="font-medium">Merge Options</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Mode
            <FiInfo className="inline-block ml-1" title="How inputs are merged" />
          </label>
          <select
            value={(data.mergeMode as string) || 'append'}
            onChange={(e) => onChange('mergeMode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          >
            <option value="append">Append</option>
            <option value="combine">Combine</option>
            <option value="overwrite">Overwrite</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Fields
            <FiInfo className="inline-block ml-1" title="Fields to merge" />
          </label>
          <ExpressionInput
            value={(data.mergeFields as string) || ''}
            onChange={(v) => onChange('mergeFields', v)}
            placeholder="Comma separated fields"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-medium">Input</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Inputs
            <FiInfo className="inline-block ml-1" title="Number of inputs" />
          </label>
          <input
            type="number"
            min={1}
            value={(data.inputCount as number) || 2}
            onChange={(e) => onChange('inputCount', parseInt(e.target.value, 10) || 1)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          />
        </div>
      </fieldset>
    </div>
  );
}
