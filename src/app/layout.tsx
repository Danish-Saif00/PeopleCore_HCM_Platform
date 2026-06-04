import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'PeopleCore HCM', template: '%s | PeopleCore' },
  description: 'Cloud-based Human Capital Management for small to mid-size companies.',
  keywords: ['HCM', 'HR Software', 'Payroll', 'Time Off', 'Performance Reviews'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('pc_theme');
                const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (initialTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[color:var(--background)]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
