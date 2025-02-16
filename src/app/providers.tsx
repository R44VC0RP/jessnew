'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    const handleThemeChange = () => {
      document.body.setAttribute('data-theme-changing', 'true');
      setTimeout(() => {
        document.body.removeAttribute('data-theme-changing');
      }, 500); // Match this with the CSS transition duration
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const handleThemeChange = (theme: string) => {
    window.dispatchEvent(new Event('theme-change'));
    return theme;
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
} 