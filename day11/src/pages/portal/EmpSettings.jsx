import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../hooks/useSettings';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

const EmpSettings = () => {
  const { user, logout } = useAuth();
  const { settings, updateSetting, updateSettings } = useSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Successfully logged out.');
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSetting('theme', nextTheme);
    toast.success(`Theme updated to ${nextTheme} mode`);
  };

  const handleNotificationChange = (key, val) => {
    updateSetting(key, val);
    toast.success('Notification preferences updated');
  };

  const handleLanguageChange = (e) => {
    updateSetting('language', e.target.value);
    toast.success('Language preferences updated');
  };

  const isDarkMode = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-xs text-slate-500">Configure your app appearance and notification preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Profile Card Summary */}
        <Card className="p-5 md:col-span-1 text-center flex flex-col justify-between">
          <div>
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full text-white text-xl font-bold flex items-center justify-center mx-auto shadow-md">
              {user?.name?.charAt(0)}
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mt-3">{user?.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{user?.designation}</p>
            <p className="text-[10px] text-slate-400 mt-1">{user?.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="danger" className="w-full flex justify-center items-center" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1.5" /> Log Out
            </Button>
          </div>
        </Card>

        {/* Configurations column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Appearance Settings */}
          <Card className="p-5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Appearance</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dark Mode</p>
                <p className="text-[11px] text-slate-500">Toggle application dark / light visual modes</p>
              </div>
              <button
                onClick={handleToggleTheme}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
              </button>
            </div>
          </Card>

          {/* Localization Settings */}
          <Card className="p-5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Localization</h4>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Language</p>
                <p className="text-[11px] text-slate-500">Change workspace portal display language</p>
              </div>
              <select
                value={settings.language}
                onChange={handleLanguageChange}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Notifications Preferences */}
          <Card className="p-5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Notification Preferences</h4>
            <div className="space-y-4 text-xs">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Email Leave Updates</p>
                  <p className="text-[10px] text-slate-500">Receive email notification when leaves are approved</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifEmailLeave}
                  onChange={(e) => handleNotificationChange('notifEmailLeave', e.target.checked)}
                  className="h-4.5 w-4.5 accent-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Payslip Ready alerts</p>
                  <p className="text-[10px] text-slate-500">Receive alert when new payslips are posted</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifPayslipReady}
                  onChange={(e) => handleNotificationChange('notifPayslipReady', e.target.checked)}
                  className="h-4.5 w-4.5 accent-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Sound Notifications</p>
                  <p className="text-[10px] text-slate-500">Play tone indicators for notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifSoundEnabled}
                  onChange={(e) => handleNotificationChange('notifSoundEnabled', e.target.checked)}
                  className="h-4.5 w-4.5 accent-indigo-600"
                />
              </div>

            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default EmpSettings;
