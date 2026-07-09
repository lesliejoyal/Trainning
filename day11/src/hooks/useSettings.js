import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ems_settings';

const DEFAULT_SETTINGS = {
  theme: 'system',           // 'light' | 'dark' | 'system'
  accent: 'indigo',
  language: 'en',
  density: 'comfortable',
  timezone: 'America/Los_Angeles',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  // Notifications
  notifEmailLeave:    true,
  notifEmailPayroll:  true,
  notifEmailHire:     true,
  notifPushAll:       false,
  notifWeeklyReport:  true,
  notifMonthlyReport: false,
  notifSoundEnabled:  true,
  notifLeaveApproved: true,
  notifPayslipReady:  true,
  notifNewMessage:    false,
  // Security
  twoFactor:       false,
  auditLog:        true,
  sessionTimeout:  '30',
  dataRetention:   '12',
  // Company
  companyName:  'Acme Corporation',
  companyEmail: 'hr@acme.com',
  companyPhone: '+1 555-0000',
  companyAddr:  '123 Business Park, San Francisco, CA 94105',
  companyWeb:   'https://acme.com',
};

const applyTheme = (theme) => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', isDark);
};

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Apply theme on change or mount
  useEffect(() => {
    applyTheme(settings.theme);

    // Watch for system preference changes if 'system' theme is active
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme]);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      // Dispatch storage event so other instances (like Navbar) know to update
      window.dispatchEvent(new Event('ems-settings-changed'));
      return next;
    });
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => {
      const next = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('ems-settings-changed'));
      return next;
    });
  }, []);

  // Sync state if localStorage changes in another component or tab
  useEffect(() => {
    const syncSettings = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSettings(JSON.parse(stored));
        }
      } catch { /* */ }
    };

    window.addEventListener('ems-settings-changed', syncSettings);
    window.addEventListener('storage', syncSettings);
    return () => {
      window.removeEventListener('ems-settings-changed', syncSettings);
      window.removeEventListener('storage', syncSettings);
    };
  }, []);

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings: () => updateSettings(DEFAULT_SETTINGS),
  };
};
