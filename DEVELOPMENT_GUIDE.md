# 🔨 Development Guide - Calendar Event Manager

This guide provides detailed instructions for extending and customizing the Calendar Event Manager UI.

## 🏗️ Architecture Overview

### Component Hierarchy
```
layout.tsx (Root)
└── page.tsx (Home)
    └── CalendarDayComponent
        ├── EventCard (for each event)
        └── EventModal
```

### State Management
- **CalendarDayComponent**: Manages events list and modal state
- **EventModal**: Manages form inputs (title, time, color)
- Local React state using `useState` hook

## 🛠️ Development Workflow

### 1. Making Changes
```bash
# Start development server
npm run dev

# Changes auto-reload via HMR
# Open browser to http://localhost:3000
```

### 2. Type Safety
All components use TypeScript with strict mode:

```typescript
interface EventCardProps {
  event: CalendarEvent;
  onDelete?: (eventId: string) => void;
}
```

### 3. Testing Components
Add console.logs or use React DevTools:
```typescript
useEffect(() => {
  console.log('Events updated:', events);
}, [events]);
```

## 📝 Adding New Components

### Step 1: Create Component File
Create `src/components/MyComponent.tsx`:

```typescript
'use client';

import React from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
};
```

### Step 2: Add to Index
Update `src/components/index.ts`:

```typescript
export { MyComponent } from './MyComponent';
```

### Step 3: Use in Other Components
```typescript
import { MyComponent } from '@/components';

export default function Home() {
  return <MyComponent title="Hello" />;
}
```

## 🎨 Styling Guide

### Using Tailwind Classes
```typescript
<div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
  {/* Content */}
</div>
```

### Common Tailwind Patterns

**Button Styles**:
```typescript
// Primary Button
<button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">

// Secondary Button
<button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">

// Subtle Button
<button className="text-blue-500 hover:text-blue-700">
```

**Card Styles**:
```typescript
<div className="p-4 bg-white rounded-lg shadow border-l-4 border-l-red-500">
  {/* Content */}
</div>
```

**Text Styles**:
```typescript
<h1 className="text-6xl font-bold">Header</h1>
<p className="text-sm text-gray-600">Subtitle</p>
<span className="text-xs font-semibold">Badge</span>
```

### Custom Tailwind Configuration
Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'calendar-red': '#dc2626',
        'calendar-blue': '#2563eb',
      },
      spacing: {
        'calendar': '28px',
      },
      fontSize: {
        'calendar-lg': ['2.25rem', { lineHeight: '2.5rem' }],
      },
    },
  },
}
```

## 📊 Data Flow

### Event Creation Flow
```
User clicks "Add to calendar"
    ↓
Modal opens (EventModal)
    ↓
User fills form & submits
    ↓
onSubmit callback triggered
    ↓
CalendarDayComponent updates state
    ↓
Events list re-renders with new event
    ↓
Modal closes
```

### Event Data Structure
```typescript
{
  id: "abc123",              // Unique identifier
  title: "Meeting",          // Event name
  time: "2:00 - 3:00 PM",   // Time range
  color: "blue",             // Color variant
  isNew: false               // New badge flag
}
```

## 🔍 Debugging Tips

### Using Console Logs
```typescript
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);
```

### React Developer Tools
1. Install [React DevTools](https://react-devtools-tutorial.vercel.app/)
2. Open DevTools panel in browser
3. Inspect components and state

### VS Code Debugging
Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Events display correctly
- [ ] Modal opens/closes
- [ ] Form validation works
- [ ] New events appear in list
- [ ] Colors render correctly
- [ ] Responsive on mobile
- [ ] Buttons are clickable
- [ ] No console errors

### Adding Unit Tests (Jest + React Testing Library)

Install dependencies:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Create `src/components/__tests__/EventCard.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { EventCard } from '../EventCard';

describe('EventCard', () => {
  it('renders event title', () => {
    const event = {
      id: '1',
      title: 'Meeting',
      time: '2:00 PM',
      color: 'red',
    };

    render(<EventCard event={event} />);
    expect(screen.getByText('Meeting')).toBeInTheDocument();
  });
});
```

## 🚀 Performance Optimization

### Code Splitting
Next.js automatically splits code:
```typescript
// Dynamic import for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/image.png"
  alt="Description"
  width={400}
  height={300}
/>
```

### Memoization
```typescript
import { memo } from 'react';

const EventCard = memo(({ event }: EventCardProps) => {
  return <div>{event.title}</div>;
});
```

## 📚 Adding Features

### Example: Add Event Filter
1. Create filter state in CalendarDayComponent
2. Add filter buttons above event list
3. Filter events based on selection
4. Re-render event list

```typescript
const [colorFilter, setColorFilter] = useState<'all' | 'red' | 'blue'>('all');

const filteredEvents = colorFilter === 'all' 
  ? events 
  : events.filter(e => e.color === colorFilter);
```

### Example: Add Event Edit Feature
1. Add edit state to CalendarDayComponent
2. Create EditModal component
3. Update event data in state
4. Re-render with updated event

### Example: Add Event Deletion
1. Add delete button to EventCard
2. Pass onDelete callback from parent
3. Remove event from state
4. Update UI

```typescript
const handleDelete = (id: string) => {
  setEvents(events.filter(e => e.id !== id));
};
```

## 🔐 TypeScript Best Practices

### Interface Naming
```typescript
// Component-specific props
interface EventCardProps { ... }

// Domain models
interface CalendarEvent { ... }

// API responses
interface EventResponse { ... }
```

### Type Definitions
```typescript
// Union types for variants
type EventColor = 'red' | 'blue';

// Enums for constants
enum EventStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
}

// Utility types
type EventPreview = Omit<CalendarEvent, 'id'>;
```

## 📦 Dependency Management

### Adding New Packages
```bash
# Install package
npm install package-name

# Dev dependency
npm install --save-dev package-name

# Using pnpm
pnpm add package-name
```

### Updating Packages
```bash
# Check outdated
npm outdated

# Update all
npm update

# Update specific
npm update package-name
```

## 🌐 Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Calendar Manager
```

Use in code:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## 🚢 Build & Deploy

### Building for Production
```bash
# Build
npm run build

# Check output
ls -la .next

# Start production server
npm start
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Preview
vercel --prod
```

## 📖 File Organization Best Practices

```
src/
├── components/        # Reusable React components
├── types/            # TypeScript type definitions
├── app/              # Next.js app routes
├── utils/            # Helper functions
├── hooks/            # Custom React hooks
├── services/         # API calls & external services
└── constants/        # Constants and configuration
```

## 🎯 Common Tasks

### Add Dark Mode
1. Create context for theme
2. Add theme toggle button
3. Use conditional classes with theme

### Add Search/Filter
1. Add search input
2. Filter events based on input
3. Update display

### Add Event Categories
1. Extend CalendarEvent interface
2. Add category selector in modal
3. Filter/display by category

### Add Date Navigation
1. Add prev/next date buttons
2. Update CalendarDay data
3. Animate transition

## 📞 Getting Help

1. Check console for errors (`F12` → Console tab)
2. Review component prop types
3. Check TypeScript errors in VS Code
4. Read Next.js and React documentation
5. Review similar components in codebase

## ✅ Next Steps

1. ✅ Understand current project structure
2. ✅ Make small CSS changes to components
3. ✅ Add a new component
4. ✅ Implement new feature
5. ✅ Deploy to production

Happy coding! 🚀
