import React, { createContext, useContext, useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

interface NotificationSettings {
  Fajr: boolean;
  Dhuhr: boolean;
  Asr: boolean;
  Maghrib: boolean;
  Isha: boolean;
  Imsak: boolean; // For Ramadan
}

interface NotificationContextType {
  settings: NotificationSettings;
  toggleSetting: (key: keyof NotificationSettings) => void;
  requestPermission: () => Promise<void>;
  permissionGranted: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      Fajr: true,
      Dhuhr: false,
      Asr: false,
      Maghrib: true,
      Isha: true,
      Imsak: true
    };
  });

  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support desktop notifications');
      return;
    }
    const permission = await Notification.requestPermission();
    setPermissionGranted(permission === 'granted');
    if (permission === 'granted') {
      toast.success('Notifications enabled!');
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <NotificationContext.Provider value={{ settings, toggleSetting, requestPermission, permissionGranted }}>
      {children}
      <Toaster position="top-center" richColors />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
