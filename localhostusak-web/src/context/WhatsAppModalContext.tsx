import React, { createContext, useContext, useState, useCallback } from 'react';
import { WhatsAppRulesModal } from '../components/shared';

interface WhatsAppModalContextType {
  openWhatsAppWithRules: (targetUrl: string, groupLabel?: string) => void;
  isRulesAccepted: boolean;
}

const WhatsAppModalContext = createContext<WhatsAppModalContextType | undefined>(undefined);

const RULES_ACCEPTED_STORAGE_KEY = 'localhostusak_wa_rules_accepted';

export const WhatsAppModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [groupLabel, setGroupLabel] = useState<string | undefined>(undefined);
  const [isRulesAccepted, setIsRulesAccepted] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(RULES_ACCEPTED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const openWhatsAppWithRules = useCallback(
    (url: string, label?: string) => {
      if (!url) return;

      // Check session memory
      const accepted = sessionStorage.getItem(RULES_ACCEPTED_STORAGE_KEY) === 'true';
      if (accepted) {
        // Already accepted in this session, open directly
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      // Not accepted yet, show modal
      setTargetUrl(url);
      setGroupLabel(label);
      setIsOpen(true);
    },
    []
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    try {
      sessionStorage.setItem(RULES_ACCEPTED_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setIsRulesAccepted(true);
    setIsOpen(false);
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  }, [targetUrl]);

  return (
    <WhatsAppModalContext.Provider value={{ openWhatsAppWithRules, isRulesAccepted }}>
      {children}
      <WhatsAppRulesModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        targetUrl={targetUrl}
        groupLabel={groupLabel}
      />
    </WhatsAppModalContext.Provider>
  );
};

export const useWhatsAppModal = (): WhatsAppModalContextType => {
  const context = useContext(WhatsAppModalContext);
  if (!context) {
    throw new Error('useWhatsAppModal must be used within a WhatsAppModalProvider');
  }
  return context;
};
