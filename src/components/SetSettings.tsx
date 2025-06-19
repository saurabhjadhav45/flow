
interface SetSettingsProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export default function SetSettings({ data, onChange }: SetSettingsProps) {
  const mappings = (data.mappings as Array<{ field: string; value: string }> | undefined) || [];

  const handleMappingChange = (index: number, key: 'field' | 'value', value: string) => {
    const newMappings = mappings.map((m, i) => (i === index ? { ...m, [key]: value } : m));
    onChange('mappings', newMappings);
  };

  const addMapping = () => {
    onChange('mappings', [...mappings, { field: '', value: '' }]);
  };

  const removeMapping = (index: number) => {
    const newMappings = mappings.filter((_, i) => i !== index);
    onChange('mappings', newMappings);
  };

  return (
    <div className="space-y-2 text-left">
      {mappings.map((map, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            value={map.field}
            onChange={(e) => handleMappingChange(idx, 'field', e.target.value)}
            placeholder="Field"
            className="flex-1 px-2 py-1 border border-gray-600 rounded-md"
          />
          <input
            type="text"
            value={map.value}
            onChange={(e) => handleMappingChange(idx, 'value', e.target.value)}
            placeholder="Value"
            className="flex-1 px-2 py-1 border border-gray-600 rounded-md"
          />
          <button
            onClick={() => removeMapping(idx)}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={addMapping} className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
        Add Field
      </button>
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={Boolean(data.keepOnlySetFields)}
          onChange={(e) => onChange('keepOnlySetFields', e.target.checked)}
        />
        <span className="text-sm">Keep Only Set Fields</span>
      </div>
    </div>
  );
}
