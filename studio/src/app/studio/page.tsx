'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ComponentsView from '@/components/ComponentsView';

type ViewMode = 'newView' | 'gallery' | 'components';

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

  const [selectedComponent, setSelectedComponent] = useState<ViewMode>('newView');

  const renderMainContent = () => {
    switch (selectedComponent) {
      case 'newView':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate New View</h2>
              <p className="text-gray-600">Generate new view panel coming soon</p>
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gallery</h2>
              <p className="text-gray-600">Gallery panel coming soon</p>
            </div>
          </div>
        );
      case 'components':
        return <ComponentsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <Sidebar onSelectComponent={(component) => setSelectedComponent(component as ViewMode)} />
      </div>

      {/* Right Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderMainContent()}
      </div>
    </div>
  );
}
