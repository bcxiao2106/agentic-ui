# Calendar Event Manager - Studio

A professional Next.js 15 application showcasing a beautiful calendar event management UI built with TypeScript, React, and Tailwind CSS.

## Features

- 📅 **Calendar Day View**: Displays the day name, date, and all events
- 🎨 **Event Cards**: Color-coded event cards (Red/Blue) with time and title
- ➕ **Create Event Modal**: Full-featured modal to add new events
- 🎯 **Responsive Design**: Mobile-first responsive layout using Tailwind CSS
- 🌙 **Modern UI**: Clean, professional design with smooth interactions

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page with sample calendar
│   ├── globals.css         # Global Tailwind styles
├── components/
│   ├── CalendarDay.tsx     # Main calendar day component
│   ├── EventCard.tsx       # Individual event card component
│   ├── EventModal.tsx      # Event creation modal
│   └── index.ts            # Component exports
├── types/
│   └── calendar.ts         # Type definitions
```

## Getting Started

### Prerequisites
- Node.js 18.17+ or newer
- npm, yarn, pnpm, or bun

### Installation

1. Navigate to the studio folder:
```bash
cd studio
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Components

### CalendarDayComponent
The main component that displays:
- Day name and date number
- List of events for the day
- Action buttons (Add to calendar, Discard)
- Modal trigger

### EventCard
Displays individual events with:
- Time range
- Event title
- Color indicator (border-left)
- New badge (optional)

### EventModal
Modal dialog for creating events with:
- Title input
- Time input
- Color selection (Red/Blue)
- Submit/Cancel buttons

## Styling

This project uses **Tailwind CSS** for styling with:
- Custom color variables for calendar events
- Responsive breakpoints
- Utility-first approach
- Smooth transitions and hover effects

## Data Structure

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  color: 'red' | 'blue';
  isNew?: boolean;
}

interface CalendarDay {
  name: string;
  number: number;
  events: CalendarEvent[];
}
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **date-fns** - Date utilities

## Customization

### Adding New Colors
Edit `tailwind.config.js` to add more color options:
```javascript
colors: {
  'calendar-red': '#dc2626',
  'calendar-blue': '#2563eb',
  // Add more colors here
}
```

### Modifying Event Structure
Update the `CalendarEvent` interface in `src/types/calendar.ts`

### Changing Theme
Modify the Tailwind classes in each component to match your design system

## Performance

- **Server-side rendering**: Next.js handles optimized rendering
- **Code splitting**: Automatic with Next.js App Router
- **Image optimization**: Built-in Next.js image optimization
- **CSS optimization**: Tailwind's production build optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

Built with ❤️ for the Agentic UI project
