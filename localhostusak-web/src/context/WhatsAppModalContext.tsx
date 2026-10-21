import React, { createContext, useContext, useState, useCallback } from 'react';
import { WhatsAppRulesModal } from '../components/shared';

interface WhatsAppModalContextType {
  openWhatsAppWithRules: (targetUrl?: string, groupLabel?: string) => void;
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
    (url?: string, label?: string) => {
      const finalUrl = (url && url.trim()) || 'https://chat.whatsapp.com/I8eMGS58Gtz3dSn9J2mINa';

      // Her zaman topluluk kuralları modalını göster
      setTargetUrl(finalUrl);
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

const defaultWhatsAppModalContext: WhatsAppModalContextType = {
  openWhatsAppWithRules: (targetUrl?: string, _groupLabel?: string) => {
    const finalUrl = (targetUrl && targetUrl.trim()) || 'https://chat.whatsapp.com/I8eMGS58Gtz3dSn9J2mINa';
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  },
  isRulesAccepted: false,
};

export const useWhatsAppModal = (): WhatsAppModalContextType => {
  const context = useContext(WhatsAppModalContext);
  if (!context) {
    console.warn('useWhatsAppModal was called outside WhatsAppModalProvider. Using safe fallback.');
    return defaultWhatsAppModalContext;
  }
  return context;
};
