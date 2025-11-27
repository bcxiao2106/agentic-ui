'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Toolbar from '@/components/Toolbar';
import CodeEditor from '@/components/CodeEditor';
import Preview from '@/components/Preview';

export default function StudioPage() {
  const [code, setCode] = useState(`<Card
  size="md"
  confirm={{ label: "Add to calendar", action: { type: "calendar.add" } }}
  cancel={{ label: "Discard", action: { type: "calendar.discard" } }}
>
  <Row align="start">
    <Col align="start" gap={1} width={80}>
      <Caption value={date.name} size="lg" color="secondary" />
      <Title value={date.number} size="3xl" />
    </Col>
  </Row>

  <Col flex="auto">
    {events.map((item) => (
      <Row
        key={item.id}
        padding={{ x: 3, y: 2 }}
        gap={3}
      >
        <Col flex="auto">
          <Text value={item.time} size="sm" weight="bold" color={item.color} />
          <Text value={item.title} size="sm" />
        </Col>
      </Row>
    ))}
  </Col>
</Card>`);

  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onSelectComponent={setSelectedComponent} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <Toolbar />

        {/* Editor and Preview */}
        <div className="flex flex-1 overflow-hidden">
          <CodeEditor code={code} onCodeChange={setCode} />
          <Preview code={code} />
        </div>
      </div>
    </div>
  );
}
