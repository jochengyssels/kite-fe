import "@/app/globals.css";
import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from 'next/font/google';

// Define the font
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Kiteaways',
  description: 'Find the perfect wind for your next adventure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}