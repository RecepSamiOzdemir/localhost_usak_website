import seoPages from '../seo/pages.json';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GeneralSettingsData, fetchGeneralSettings } from '../services/api';

const DEFAULT_GENERAL_SETTINGS: GeneralSettingsData = {
  meta: {
    siteTitle: seoPages['/'].title,
    defaultDescription: seoPages['/'].description,
    keywords:
      'Uşak yazılım, Uşak teknoloji, localhostusak, developer community, UI UX Uşak, Uşak meetup, remote çalışma, coworking',
  },
  header: {
    announcementActive: false,
    announcementText: 'Yeni buluşma takvimimiz açıklandı! Detaylar etkinlikler sayfasında.',
    announcementUrl: '/etkinlikler',
  },
  footer: {
    tagline:
      "Uşak'ın yerel teknoloji, yazılım ve tasarım ekosistemini büyüten açık ve bağımsız topluluk.",
    locationCoordinates: '38.6823° N, 29.4082° E',
    copyrightText: "© 2026 localhostusak • Uşak'ta geliştirildi",
  },
};

interface GeneralSettingsContextType {
  settings: GeneralSettingsData;
  isLoading: boolean;
}

const GeneralSettingsContext = createContext<GeneralSettingsContextType>({
  settings: DEFAULT_GENERAL_SETTINGS,
  isLoading: false,
});

export const GeneralSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GeneralSettingsData>(DEFAULT_GENERAL_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    fetchGeneralSettings()
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setSettings({
            meta: { ...DEFAULT_GENERAL_SETTINGS.meta, ...(data.meta || {}) },
            header: { ...DEFAULT_GENERAL_SETTINGS.header, ...(data.header || {}) },
            footer: { ...DEFAULT_GENERAL_SETTINGS.footer, ...(data.footer || {}) },
          });
        }
      })
      .catch(() => {
        // Fallback to defaults
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <GeneralSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </GeneralSettingsContext.Provider>
  );
};

export const useGeneralSettings = () => useContext(GeneralSettingsContext);
