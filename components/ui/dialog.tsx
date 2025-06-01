import React, { useEffect } from 'react';

// Dialog context for open/close state
const DialogContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | undefined>(undefined);

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false);
    }
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  return (
    <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error('DialogTrigger must be used within Dialog');
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: () => ctx.setOpen(true),
  });
}

export function DialogContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx || !ctx.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => ctx.setOpen(false)} />
      <div className={`relative bg-white rounded-lg shadow-lg p-6 z-10 ${className}`}>{children}</div>
    </div>
  );
}
