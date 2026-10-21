import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'modern' | 'pixel';

interface ThemeContextType {
  theme: Theme;
  toastTheme: Theme;
  isCracking: boolean;
  breachHits: number;
  breachStatusText: string;
  isUnlockedToastVisible: boolean;
  hasBreached: boolean;
  toggleTheme: (x?: number, y?: number) => void;
  systemRestore: () => void;
  triggerBreach: (x?: number, y?: number) => void;
  closeToast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'localhostusak_theme';
const MANUAL_OVERRIDE_KEY = 'localhostusak_theme_manual';

// Kullanıcının yerel cihaz saatine göre tema belirleme:
// Sabah 07:00 ile Akşam 19:00 arası: Beyaz / Aydınlık tema ('pixel' / light)
// Akşam 19:00 ile Sabah 07:00 arası: Dark / Karanlık tema ('modern' / dark)
export const getAutoThemeByTime = (): Theme => {
  if (typeof window === 'undefined') return 'modern';
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? 'pixel' : 'modern';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      // Kullanıcı bu oturumda manuel tema butonuna bastıysa kullanıcının seçimine saygı duy
      const manual = sessionStorage.getItem(MANUAL_OVERRIDE_KEY);
      const saved = sessionStorage.getItem(STORAGE_KEY) as Theme | null;
      if (manual === 'true' && (saved === 'modern' || saved === 'pixel')) {
        return saved;
      }
    }
    // Cihaz saatine göre otomatik tema seç (07:00 - 19:00 pixel/beyaz, 19:00 - 07:00 modern/dark)
    return getAutoThemeByTime();
  });

  // data-theme attribute'u güncelle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    sessionStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Cihaz saatini periyodik olarak kontrol et (kullanıcı manuel seçim yapmadıysa otomatik geçiş yap)
  useEffect(() => {
    const checkThemeTime = () => {
      const manual = sessionStorage.getItem(MANUAL_OVERRIDE_KEY);
      if (manual !== 'true') {
        const expected = getAutoThemeByTime();
        setThemeState((current) => (current !== expected ? expected : current));
      }
    };

    const interval = setInterval(checkThemeTime, 60000);
    window.addEventListener('visibilitychange', checkThemeTime);
    window.addEventListener('focus', checkThemeTime);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', checkThemeTime);
      window.removeEventListener('focus', checkThemeTime);
    };
  }, []);

  const toggleTheme = useCallback((_x?: number, _y?: number) => {
    const next: Theme = theme === 'modern' ? 'pixel' : 'modern';
    sessionStorage.setItem(MANUAL_OVERRIDE_KEY, 'true');
    sessionStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  }, [theme]);

  // systemRestore: dark mode'a dön
  const systemRestore = useCallback(() => {
    sessionStorage.setItem(MANUAL_OVERRIDE_KEY, 'true');
    setThemeState('modern');
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toastTheme: theme,
        isCracking: false,
        breachHits: 0,
        breachStatusText: '',
        isUnlockedToastVisible: false,
        hasBreached: true,
        toggleTheme,
        systemRestore,
        triggerBreach: toggleTheme,
        closeToast: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
