# 🎨 Agentic UI Studio - Widget Builder

A professional Widget Builder interface with a sidebar, code editor, and live preview - inspired by modern design tools.

## ✨ Features

✅ **Sidebar Navigation**
- New widget button
- Gallery section
- Components library
- Icons library
- Quick access to widgets
- Publish button

✅ **Top Toolbar**
- Title display
- JSON export button
- Share button
- Download button

✅ **Code Editor**
- Syntax highlighting
- Line numbers
- Dark theme
- Live code editing

✅ **Live Preview Panel**
- Real-time preview of components
- Calendar event example
- Responsive design
- Interactive buttons

## 🏗️ Project Structure

```
studio/src/
├── app/
│   ├── page.tsx              # Redirects to /studio
│   └── studio/
│       └── page.tsx          # Main studio layout
├── components/
│   ├── Sidebar.tsx           # Left sidebar navigation
│   ├── Toolbar.tsx           # Top toolbar
│   ├── CodeEditor.tsx        # Code editing panel
│   ├── Preview.tsx           # Live preview panel
│   ├── CalendarDay.tsx       # Calendar component
│   ├── EventCard.tsx         # Event card
│   └── EventModal.tsx        # Event modal dialog
└── types/
    └── calendar.ts           # Type definitions
```

## 🚀 Quick Start

```bash
cd studio
npm install
npm run dev
```

Open: **http://localhost:3000**

## 📐 Layout Breakdown

### Sidebar (Left - 240px)
- Header with logo
- Navigation buttons
- Widget list
- Publish button

### Toolbar (Top - 64px)
- Page title
- Action buttons (JSON, Share, Download)

### Code Editor (Center - 66%)
- Dark background
- Syntax highlighting
- Line numbers
- Editable code area

### Preview (Right - 33%)
- Light background
- Component preview
- Interactive elements
- Sample data

## 🎯 Components

### Sidebar Component
- Navigation items with icons
- Active state management
- Widget listing
- Responsive layout

**File:** `src/components/Sidebar.tsx`

### Toolbar Component
- Title display
- Action buttons
- Icon integration
- Hover effects

**File:** `src/components/Toolbar.tsx`

### CodeEditor Component
- Line numbering
- Dark theme
- Code display
- Syntax highlighting prep

**File:** `src/components/CodeEditor.tsx`

### Preview Component
- Live component rendering
- Sample data
- Interactive buttons
- Responsive design

**File:** `src/components/Preview.tsx`

## 💻 Technologies

- Next.js 15.1.0
- React 18.3.0
- TypeScript 5.9.0
- Tailwind CSS 3.4.1
- Lucide React (icons)

## 🎨 Design System

### Colors
- Primary: Black (`#000000`)
- Secondary: Gray (`#6b7280`)
- Success: Blue (`#2563eb`)
- Warning: Red (`#dc2626`)
- Backgrounds: Gray shades

### Typography
- Headers: Bold, 6xl-2xl
- Labels: Medium, sm-base
- Body: Regular, sm
- Code: Monospace font

### Spacing
- Padding: 4-8 units
- Gaps: 3-4 units
- Margins: 8 units

### Components
- Buttons: Rounded, with hover states
- Cards: Rounded with shadows
- Inputs: Bordered with focus states
- Icons: 18-40px sizes

## 🔧 Customization

### Change Sidebar Items
Edit `src/components/Sidebar.tsx`:
```typescript
const sections = [
  { id: 'add', label: 'New widget', icon: Plus },
  // Add more items here
];
```

### Change Preview Content
Edit `src/components/Preview.tsx`:
```typescript
const [sampleData] = React.useState({
  // Update sample data here
});
```

### Modify Editor Content
Edit `src/app/studio/page.tsx`:
```typescript
const [code, setCode] = useState(`
  // Your default code here
`);
```

## 📖 Usage

### Accessing the Studio
- Home page redirects to `/studio`
- Direct URL: `http://localhost:3000/studio`

### Sidebar Navigation
- Click items to select them
- Active items are highlighted
- Widgets section appears when "New widget" is selected

### Code Editor
- View and edit code
- Line numbers on left
- Syntax highlighting (dark theme)

### Preview Panel
- See component in real-time
- Try interactive buttons
- View with sample data

## 🔄 Component Communication

```
StudioPage
├── Sidebar (passes onSelectComponent)
├── Toolbar (static header)
└── Code Editor + Preview (synced via state)
```

## 🎯 Features You Can Add

1. **Code Execution**: Run component code in preview
2. **Drag & Drop**: Drag components from sidebar
3. **Component Inspector**: Click preview to inspect
4. **Export Options**: Export as component, HTML, JSON
5. **Undo/Redo**: Code history
6. **Color Picker**: Visual color selection
7. **Responsive Preview**: Mobile/tablet/desktop views
8. **Component Library**: More pre-built components

## 📱 Responsive Design

- Sidebar: Fixed width (240px)
- Toolbar: Full width
- Editor: Flexible
- Preview: 33% of remaining space

Works on:
- Desktop (1920x1080+)
- Laptop (1366x768)
- Tablet (1024x768)

## 🎨 Styling Notes

All styling uses Tailwind CSS utility classes. Key classes:

```
Layout:
- flex, flex-1, flex-col
- h-screen, w-60, w-1/3
- overflow-auto, overflow-hidden

Colors:
- bg-white, bg-gray-50, bg-gray-900
- text-gray-900, text-gray-600
- border-gray-200, border-gray-800

Spacing:
- p-4, px-6, py-2
- gap-3, gap-2
- mb-8, mt-2
```

## 🚀 Deployment

```bash
# Build
npm run build

# Start production server
npm start

# Deploy to Vercel
npm install -g vercel
vercel
```

## 📝 Notes

- All components are client-side (`'use client'`)
- No external API calls (local state only)
- Icons from Lucide React
- Responsive sidebar navigation
- Preview updates with code changes

## 🎓 Learning Resources

- Next.js App Router: https://nextjs.org/docs/app
- React Hooks: https://react.dev/reference/react
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev

## 🤝 Support

For questions or issues, refer to the main documentation in the root directory.

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**
