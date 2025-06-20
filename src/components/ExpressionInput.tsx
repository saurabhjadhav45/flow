import { useState } from 'react';
import type { ChangeEvent } from 'react';
import VariablePicker from './VariablePicker';
import evaluateExpression from '../utils/evaluateExpression';

interface ExpressionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export default function ExpressionInput({
  value,
  onChange,
  placeholder,
  multiline,
}: ExpressionInputProps) {
  const [exprMode, setExprMode] = useState(false);
  const [error, setError] = useState(false);

  const toggle = () => setExprMode((v) => !v);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    if (exprMode) {
      try {
        evaluateExpression(val, {});
        setError(false);
      } catch {
        setError(true);
      }
    }
  };

  const handleInsert = (v: string) => {
    const newVal = value + v;
    onChange(newVal);
    if (exprMode) {
      try {
        evaluateExpression(newVal, {});
        setError(false);
      } catch {
        setError(true);
      }
    }
  };

  const inputClasses = `w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-600'}`;
  const textareaClasses = `w-full h-24 px-3 py-2 border rounded-md font-mono text-sm ${error ? 'border-red-500' : 'border-gray-600'}`;

  return (
    <div>
      <div className="relative">
        {exprMode && multiline ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={textareaClasses}
          />
        ) : exprMode ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={textareaClasses}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={inputClasses}
          />
        )}
        <button
          type="button"
          onClick={toggle}
          title="Toggle expression"
          className="absolute right-1 top-1 px-1 text-xs border border-gray-400 rounded"
        >
          {'</>'}
        </button>
      </div>
      {exprMode && <VariablePicker onSelect={handleInsert} />}
    </div>
  );
}
