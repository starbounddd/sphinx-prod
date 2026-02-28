'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

interface AuthModalContextType {
  isOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openAuthModal = useCallback(() => setIsOpen(true), []);
  const closeAuthModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openAuthModal, closeAuthModal }),
    [isOpen, openAuthModal, closeAuthModal]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
}
