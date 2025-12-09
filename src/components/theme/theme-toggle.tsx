'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner'; // Import sonner for toast

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    if (theme === 'dark') {
      // Attempting light—show toast and revert
      toast("You played yourself. There is no day mode. Night mode forever!", {
        duration: 3000,
        style: { background: '#1e1e3f', color: 'white' }, // Dark theme toast
      });
      // Stay dark—no setTheme('light')
    } else {
      // Already light? Force dark (edge case)
      setTheme('dark');
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleToggle}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
