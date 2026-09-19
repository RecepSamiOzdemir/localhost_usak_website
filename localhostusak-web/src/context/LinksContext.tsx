import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommunityLinks, DEFAULT_COMMUNITY_LINKS } from '../constants/links';
import { fetchCommunityLinks } from '../services/api';

interface LinksContextType {
  links: CommunityLinks;
  updateLinks: (newLinks: Partial<CommunityLinks>) => Promise<{ success: boolean; message?: string }>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

const STORAGE_KEY = 'localhostusak_community_links';

export const LinksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<CommunityLinks>(() => {
    // Check localStorage for cached/offline links
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          return { ...DEFAULT_COMMUNITY_LINKS, ...JSON.parse(cached) };
        }
      } catch {
        // Fallback to defaults
      }
    }
    return DEFAULT_COMMUNITY_LINKS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch dynamic links from backend on mount
  useEffect(() => {
    let isMounted = true;

    fetchCommunityLinks()
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          const merged = { ...DEFAULT_COMMUNITY_LINKS, ...data };
          setLinks(merged);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {}
        }
      })
      .catch((_err) => {
        // Silent catch: use cached or default links
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateLinks = async (newLinks: Partial<CommunityLinks>): Promise<{ success: boolean; message?: string }> => {
    const merged = { ...links, ...newLinks };
    setLinks(merged);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {}

    return {
      success: true,
      message: 'Bağlantılar yerel olarak güncellendi. Kalıcı değişiklikler Payload CMS Admin panelinden (/admin) yapılmalıdır.',
    };
  };

  const resetToDefaults = async (): Promise<void> => {
    await updateLinks(DEFAULT_COMMUNITY_LINKS);
  };

  return (
    <LinksContext.Provider value={{ links, updateLinks, resetToDefaults, isLoading }}>
      {children}
    </LinksContext.Provider>
  );
};

export const useLinks = (): LinksContextType => {
  const context = useContext(LinksContext);
  if (!context) {
    // Return default links safely if used outside provider
    return {
      links: DEFAULT_COMMUNITY_LINKS,
      updateLinks: async () => ({ success: false, message: 'LinksProvider missing' }),
      resetToDefaults: async () => {},
      isLoading: false,
    };
  }
  return context;
};
