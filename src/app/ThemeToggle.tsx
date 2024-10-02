'use client';
import React, { useEffect, useState } from 'react';
import { Ghost } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button onClick={toggleTheme} className="text-xl">
      <Ghost size={24} className={isDark ? 'text-yellow-400' : 'text-gray-800'} />
    </button>
  );
};

export default ThemeToggle;
