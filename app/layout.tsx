import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'INGETIN - Task Manager',
  description: 'Task manager super simpel untuk mencatat apapun. Bereskan tugasmu, centang, dan biarkan kami menyingkirkannya dari pandanganmu.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased text-slate-100 bg-[#0a0a0a]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
