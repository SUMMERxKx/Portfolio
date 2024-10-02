import React, { useEffect, useState } from 'react';
import { Ghost } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
  }, [isDark]);

  return (
    <button onClick={() => setIsDark(!isDark)} className="text-xl">
      <Ghost size={24} className={isDark ? 'text-yellow-400' : 'text-gray-800'} />
    </button>
  );
};

export default ThemeToggle;