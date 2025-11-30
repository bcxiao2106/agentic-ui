import './globals.css';
import { QueryProvider } from '@/components/QueryProvider';

export const metadata = {
  title: 'Agentic UI Studio',
  description: 'Agentic UI Studio for building views with AI components',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
