import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ems_settings';

const DEFAULT_SETTINGS = {
  theme: 'system',           // 'light' | 'dark' | 'system'
  accent: 'indigo',
  language: 'en',
  density: 'comfortable',
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
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
  companyName:  'Thamizha Thamizhi',
  companyEmail: 'hr@thamizha.com',
  companyPhone: '+91 44-2345-6789',
  companyAddr:  '42 Anna Salai, Chennai, Tamil Nadu 600002',
  companyWeb:   'https://thamizha.com',
};

const ACCENT_COLORS = {
  indigo: { 500: '#4f46e5', 600: '#4338ca', 100: '#e0e7ff', 950: '#1e1b4b' },
  violet: { 500: '#8b5cf6', 600: '#7c3aed', 100: '#ede9fe', 950: '#2e1065' },
  emerald: { 500: '#10b981', 600: '#059669', 100: '#d1fae5', 950: '#022c22' },
  rose: { 500: '#f43f5e', 600: '#e11d48', 100: '#ffe4e6', 950: '#4c0519' },
  amber: { 500: '#f59e0b', 600: '#d97706', 100: '#fef3c7', 950: '#451a03' },
  sky: { 500: '#0ea5e9', 600: '#0284c7', 100: '#e0f2fe', 950: '#082f49' }
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

    // Apply accent colors
    const colors = ACCENT_COLORS[settings.accent] || ACCENT_COLORS.indigo;
    const root = document.documentElement;
    root.style.setProperty('--primary-500', colors[500]);
    root.style.setProperty('--primary-600', colors[600]);
    root.style.setProperty('--primary-100', colors[100]);
    root.style.setProperty('--primary-950', colors[950]);

    // Apply density attribute
    root.setAttribute('data-density', settings.density || 'comfortable');

    // Watch for system preference changes if 'system' theme is active
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme, settings.accent, settings.density]);

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
