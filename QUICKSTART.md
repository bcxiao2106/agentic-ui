# Studio - Calendar Event Manager UI

## Quick Start Guide

### 1️⃣ Install Dependencies

```bash
cd studio
npm install
```

or with pnpm:
```bash
cd studio
pnpm install
```

### 2️⃣ Start Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### 3️⃣ Build for Production

```bash
npm run build
npm start
```

## Project Overview

This is a professional Next.js 15 application that replicates the calendar event management UI from the design screenshot. It includes:

✅ **Calendar Day Display**
- Shows day name and date
- Moon icon in header
- Clean, modern layout

✅ **Event Cards**
- Color-coded (Red/Blue) event cards
- Time and title display
- Smooth styling with Tailwind CSS

✅ **Create Event Modal**
- Input fields for event details
- Color selection
- Add to calendar / Discard buttons

✅ **Professional Styling**
- Tailwind CSS utility classes
- Responsive design
- Smooth animations and transitions

## File Structure

```
studio/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── CalendarDay.tsx     # Main component
│   │   ├── EventCard.tsx       # Event display
│   │   ├── EventModal.tsx      # Modal dialog
│   │   └── index.ts            # Exports
│   └── types/
│       └── calendar.ts         # TypeScript types
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## Key Features

🎨 **Modern UI Design**
- Clean, minimal aesthetic matching the design screenshot
- Professional color scheme
- Smooth transitions

🚀 **Performance**
- Server-side rendering with Next.js
- Optimized CSS with Tailwind
- Fast load times

📱 **Responsive**
- Works on desktop and mobile
- Flexible layout
- Touch-friendly buttons

🔧 **Developer Friendly**
- TypeScript for type safety
- Component-based architecture
- Easy to customize and extend

## Customization

### Adding New Events
Edit `src/app/page.tsx` and modify the `sampleDay` object:

```typescript
const sampleDay: CalendarDay = {
  name: 'Friday',
  number: 28,
  events: [
    // Add your events here
  ],
};
```

### Styling Changes
- Edit Tailwind classes in components
- Modify colors in `tailwind.config.js`
- Update CSS in `src/app/globals.css`

### Adding Features
- Create new components in `src/components/`
- Add new types in `src/types/`
- Use TypeScript for type safety

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 3.4
- Lucide React (Icons)
- date-fns (Date utilities)

## Support

For questions or issues, refer to the main README.md in the studio folder.

Happy coding! 🎉
