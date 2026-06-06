import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { PageTransition } from "@/components/ui/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "PeopleCore HCM", template: "%s | PeopleCore" },
  description:
    "Cloud-based Human Capital Management for small to mid-size companies.",
  keywords: [
    "HCM",
    "HR Software",
    "Payroll",
    "Time Off",
    "Performance Reviews",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[color:var(--background)]">
        <AuthProvider>
          <PageTransition>{children}</PageTransition>
        </AuthProvider>
        <Script id="peoplecore-theme" strategy="beforeInteractive">
          {`
            try {
              const savedTheme = localStorage.getItem('pc_theme');
              const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.classList.toggle('dark', initialTheme === 'dark');
            } catch (e) {}
          `}
        </Script>
      </body>
    </html>
  );
}
