
import { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import ExpressionInput from './ExpressionInput';

interface CodeSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function CodeSettings({ data, onChange, onValidationChange }: CodeSettingsProps) {
  // Error text indicates when the code field is empty
  const [codeError, setCodeError] = useState('');

  // Simple validation: ensure a code snippet is provided
  useEffect(() => {
    const valid = Boolean((data.code as string)?.trim());
    setCodeError(valid ? '' : 'Code is required');
    // Send validity state to parent component
    onValidationChange?.(valid);
  }, [data.code, onValidationChange]);
  return (
    <div className="space-y-4 text-left">
      <fieldset className="space-y-4">
        <legend className="font-medium">Configuration</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Language
            <FiInfo className="inline-block ml-1" title="Execution language" />
          </label>
          <select
            value={(data.language as string) || 'javascript'}
            onChange={(e) => onChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Mode
            <FiInfo className="inline-block ml-1" title="How the code runs" />
          </label>
          <select
            value={(data.mode as string) || 'full'}
            onChange={(e) => onChange('mode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md"
          >
            <option value="full">Full</option>
            <option value="inline">Inline</option>
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-medium">Body</legend>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Code
            <FiInfo className="inline-block ml-1" title="Script content" />
          </label>
          <ExpressionInput
            value={(data.code as string) || ''}
            onChange={(v) => onChange('code', v)}
            multiline
          />
          {codeError && (
            <p className="text-red-500 text-xs mt-1">{codeError}</p>
          )}
        </div>
      </fieldset>
    </div>
  );
}
