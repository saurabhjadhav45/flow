import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import type { OnCopyProps, OnSelectProps } from 'react-json-view';

interface InteractiveJsonViewerProps {
  data: unknown;
  onDragStart?: (expr: string) => void;
}

export default function InteractiveJsonViewer({ data, onDragStart }: InteractiveJsonViewerProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleCopy = ({ namespace, name }: OnCopyProps) => {
    const path = [...namespace, name].filter(Boolean).join('.');
    navigator.clipboard.writeText(`{{$json.${path}}}`);
  };

  const handleSelect = ({ namespace, name }: OnSelectProps) => {
    const path = [...namespace, name].filter(Boolean).join('.');
    setSelectedPath(path);
  };

  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (!selectedPath) return;
    const expr = `{{$json.${selectedPath}}}`;
    e.dataTransfer.setData('text/plain', expr);
    onDragStart?.(expr);
  };

  return (
    <div draggable onDragStart={handleDragStart} className="overflow-auto max-h-60 text-xs text-left">
      <ReactJson
        src={data as object}
        name={false}
        enableClipboard={handleCopy}
        onSelect={handleSelect}
        displayDataTypes={false}
        indentWidth={2}
        collapsed={false}
      />
    </div>
  );
}
