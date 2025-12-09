'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner'; // For troll toast

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    toast("Day mode is a last refuge of cowards. Embrace the night!", {
      duration: 3000,
      style: { background: '#1e1e3f', color: 'white' }, // Dark theme toast
    });
    // Brief animation: Toggle to light then back (visual feedback)
    setTheme('light');
    setTimeout(() => setTheme('dark'), 100);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleToggle}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
