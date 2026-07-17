import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ems_notifications';
const SEED_VERSION = 'v2_inr_currency';
const VERSION_KEY  = 'ems_notif_version';
if (localStorage.getItem(VERSION_KEY) !== SEED_VERSION) {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(VERSION_KEY, SEED_VERSION);
}

const SEED_NOTIFICATIONS = [
  { id: 'n1', type: 'leave', title: 'Leave Approved', message: 'Your annual leave request for Jul 20–22 has been approved.', time: '2 hours ago', read: false, icon: 'calendar' },
  { id: 'n2', type: 'payroll', title: 'Payslip Ready', message: 'Your June 2026 payslip is now available for download.', time: '1 day ago', read: false, icon: 'dollar' },
  { id: 'n3', type: 'announcement', title: 'Company Announcement', message: 'Town hall meeting scheduled for July 15 at 2:00 PM in the main conference room.', time: '2 days ago', read: true, icon: 'megaphone' },
  { id: 'n4', type: 'task', title: 'Task Reminder', message: 'Task "Code review for feature branch" is due in 2 days.', time: '3 days ago', read: true, icon: 'task' },
  { id: 'n5', type: 'announcement', title: 'Holiday Notice', message: 'Office will be closed on August 15th for Independence Day.', time: '4 days ago', read: true, icon: 'megaphone' },
  { id: 'n6', type: 'payroll', title: 'Salary Credited', message: 'Your June 2026 salary of ₹75,000 has been credited to your account.', time: '1 week ago', read: true, icon: 'dollar' },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return { notifications, unreadCount, markRead, markAllRead };
};
