import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react').then(mod => mod.Editor), {
  ssr: false,
});

interface TabComponentProps {
  handlerSourceCode: string;
  inputSchema: string;
  outputSchema: string;
  onHandlerChange: (value: string) => void;
  onInputSchemaChange: (value: string) => void;
  onOutputSchemaChange: (value: string) => void;
}

const TabComponent: React.FC<TabComponentProps> = ({
  handlerSourceCode,
  inputSchema,
  outputSchema,
  onHandlerChange,
  onInputSchemaChange,
  onOutputSchemaChange,
}) => {
  const [activeTab, setActiveTab] = useState<'handler' | 'input' | 'output'>('handler');

  return (
    <div>
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'handler' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('handler')}
        >
          Handler
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'input' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('input')}
        >
          Input Schema
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'output' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('output')}
        >
          Output Schema
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'handler' && (
          <Editor
            height="200px"
            defaultLanguage="javascript"
            value={handlerSourceCode}
            onChange={(value) => onHandlerChange(value || '')}
            options={{ theme: 'vs-dark', minimap: { enabled: false } }}
          />
        )}
        {activeTab === 'input' && (
          <Editor
            height="200px"
            defaultLanguage="json"
            value={inputSchema}
            onChange={(value) => onInputSchemaChange(value || '')}
            options={{ theme: 'vs-dark', minimap: { enabled: false } }}
          />
        )}
        {activeTab === 'output' && (
          <Editor
            height="200px"
            defaultLanguage="json"
            value={outputSchema}
            onChange={(value) => onOutputSchemaChange(value || '')}
            options={{ theme: 'vs-dark', minimap: { enabled: false } }}
          />
        )}
      </div>
    </div>
  );
};

export default TabComponent;
