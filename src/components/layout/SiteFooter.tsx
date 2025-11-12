import React from 'react';

const SiteFooter = () => {
  return (
    <footer className="border-t border-soft bg-[rgba(20,23,29,0.75)] py-8 text-center text-xs uppercase tracking-[0.35em] text-foreground-muted backdrop-blur">
      <p className="text-xs text-foreground-soft">Thanks for visiting</p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.5em] text-foreground-subtle">
        &copy; {new Date().getFullYear()} Samar Khajuria
      </p>
    </footer>
  );
};

export default SiteFooter;


