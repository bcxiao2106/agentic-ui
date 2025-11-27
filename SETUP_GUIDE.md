# 🎉 Calendar Event Manager UI - Complete Setup Guide

Welcome to the **Calendar Event Manager Studio**! This is a professional Next.js 15 application that replicates the beautiful calendar event management UI from your design screenshot.

## 📋 What's Included

✅ **Complete Next.js 15 Project Structure**
- TypeScript for type safety
- Server-side rendering with App Router
- Production-ready configuration

✅ **Professional React Components**
- `CalendarDay` - Main calendar view component
- `EventCard` - Individual event display
- `EventModal` - Event creation dialog

✅ **Modern Styling**
- Tailwind CSS 3.4 with custom theme
- Responsive design
- Smooth animations and transitions

✅ **Full Type Safety**
- TypeScript interfaces for events and calendar data
- Strict mode enabled
- Component prop validation

## 🚀 Quick Start (30 seconds)

### Option 1: Automatic Setup
```bash
bash setup-studio.sh
```

### Option 2: Manual Setup
```bash
cd studio
npm install
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

## 📁 Project Structure

```
studio/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Home page with sample data
│   │   └── globals.css          # Tailwind directives and globals
│   │
│   ├── components/
│   │   ├── CalendarDay.tsx      # Main calendar component
│   │   │   └── Features:
│   │   │       - Day name & date display
│   │   │       - Event list rendering
│   │   │       - Modal state management
│   │   │       - Add/Discard buttons
│   │   │
│   │   ├── EventCard.tsx        # Event display component
│   │   │   └── Features:
│   │   │       - Color-coded borders (red/blue)
│   │   │       - Time and title display
│   │   │       - Optional "New" badge
│   │   │       - Smooth styling
│   │   │
│   │   ├── EventModal.tsx       # Event creation modal
│   │   │   └── Features:
│   │   │       - Title input field
│   │   │       - Time input field
│   │   │       - Color selection (red/blue)
│   │   │       - Form validation
│   │   │       - Submit/Cancel actions
│   │   │
│   │   └── index.ts             # Component exports
│   │
│   └── types/
│       └── calendar.ts          # TypeScript type definitions
│
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── README.md                    # Full documentation
└── .env.example                 # Environment variables template
```

## 🎨 Design Features

### Visual Elements
- **Day Header**: Large day number (28) with day name (Friday)
- **Moon Icon**: Decorative icon in top right
- **Event Cards**: 
  - Left border color indicator (red or blue)
  - Time display in matching color
  - Event title
  - Subtle background color
- **Action Buttons**:
  - "Add to calendar" (black background)
  - "Discard" (gray background)
  - Hover effects for interactivity

### Color Scheme
- **Red Events**: `#dc2626` - For important events
- **Blue Events**: `#2563eb` - For meetings/reviews
- **Background**: Light gray gradient
- **Text**: Dark gray for contrast

## 💻 Available Scripts

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🔧 Customization Guide

### Adding New Events
Edit `src/app/page.tsx`:

```typescript
const sampleDay: CalendarDay = {
  name: 'Friday',
  number: 28,
  events: [
    {
      id: '1',
      title: 'Lunch',
      time: '12:00 - 12:45 PM',
      color: 'red',
      isNew: false,
    },
    // Add more events here
  ],
};
```

### Changing Colors
Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'calendar-red': '#dc2626',
      'calendar-blue': '#2563eb',
      'custom-color': '#FF6B6B', // Add new colors
    },
  },
}
```

### Modifying Components
All components are in `src/components/`:
- **CalendarDay.tsx** - Main layout and state management
- **EventCard.tsx** - Event display styling
- **EventModal.tsx** - Modal form and inputs

### Adding New Features
1. Create a new component in `src/components/`
2. Define types in `src/types/calendar.ts`
3. Import and use in other components
4. Update `src/components/index.ts` for exports

## 📦 Dependencies

### Core
- **next@15.1.0** - React framework
- **react@19.0.0-rc** - UI library
- **typescript@5.9.0** - Type safety

### Styling
- **tailwindcss@3.4.1** - Utility CSS framework
- **autoprefixer@10.4.17** - CSS vendor prefixes

### Utilities
- **lucide-react@0.376.0** - Icon library
- **clsx@2.1.1** - Conditional classnames
- **date-fns@3.6.0** - Date utilities

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Latest |
| Firefox | ✅ Latest |
| Safari  | ✅ Latest |
| Edge    | ✅ Latest |
| Mobile  | ✅ Responsive |

## 🎯 Key Features

### Component Architecture
- ✅ Modular and reusable components
- ✅ Clear separation of concerns
- ✅ Type-safe props and state
- ✅ Easy to test and debug

### Performance
- ✅ Server-side rendering
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ CSS minification in production

### Developer Experience
- ✅ Hot module replacement (HMR)
- ✅ TypeScript with strict mode
- ✅ ESLint configuration included
- ✅ Well-documented code

### User Experience
- ✅ Smooth animations and transitions
- ✅ Responsive design (mobile-first)
- ✅ Accessible color contrasts
- ✅ Touch-friendly interactive elements

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build
```

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev)

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional Hosting
```bash
npm run build
npm start
```

## 📞 Support

For issues or questions:
1. Check the README.md in the studio folder
2. Review component source code in `src/components/`
3. Check TypeScript types in `src/types/`
4. Refer to official documentation links above

## 📝 License

MIT License - Feel free to use this project for personal and commercial purposes.

## 🎉 You're All Set!

Your professional calendar event manager UI is ready to go!

```
cd studio
npm install
npm run dev
```

Open **http://localhost:3000** and start building! 🚀

---

**Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS**
