import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapPin, Clock, Moon, Sun, Star, Bell, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'sonner';

interface PrayerTimesProps {
  darkMode: boolean;
  ramadanMode?: boolean;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ darkMode, ramadanMode = false }) => {
  const [timings, setTimings] = useState<any>(null);
  const [hijriDate, setHijriDate] = useState<any>(null);
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [city, setCity] = useState('Jakarta');
  const [loading, setLoading] = useState(true);
  const { settings, toggleSetting, requestPermission, permissionGranted } = useNotifications();
  
  // Ref to store notified prayers to avoid double notifications
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Try to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            fetchPrayerTimes(latitude, longitude);
          } catch (e) {
            fetchPrayerTimes(-6.2088, 106.8456); // Default Jakarta
          }
        },
        () => {
          fetchPrayerTimes(-6.2088, 106.8456); // Default Jakarta
        }
      );
    } else {
      fetchPrayerTimes(-6.2088, 106.8456);
    }

    // Check every minute for notifications
    const interval = setInterval(() => {
      if (timings) checkNotifications(timings);
    }, 60000);

    return () => clearInterval(interval);
  }, [timings]); // Re-run if timings update

  const fetchPrayerTimes = async (lat: number, long: number) => {
    try {
      const date = new Date();
      const response = await axios.get(
        `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
        {
          params: {
            latitude: lat,
            longitude: long,
            method: 20, // Kemenag Indonesia
          },
        }
      );
      setTimings(response.data.data.timings);
      setHijriDate(response.data.data.date.hijri);
      calculateNextPrayer(response.data.data.timings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prayer times', error);
      setLoading(false);
    }
  };

  const calculateNextPrayer = (times: any) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
      { name: 'Fajr', time: times.Fajr },
      { name: 'Dhuhr', time: times.Dhuhr },
      { name: 'Asr', time: times.Asr },
      { name: 'Maghrib', time: times.Maghrib },
      { name: 'Isha', time: times.Isha },
    ];

    if (ramadanMode && times.Imsak) {
        prayers.unshift({ name: 'Imsak', time: times.Imsak });
    }

    for (let p of prayers) {
      const [hours, minutes] = p.time.split(':').map(Number);
      const pTime = hours * 60 + minutes;
      if (pTime > currentTime) {
        setNextPrayer(p.name);
        const diff = pTime - currentTime;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        setTimeLeft(`${h}h ${m}m`);
        return;
      }
    }
    setNextPrayer('Fajr'); // Next day
    setTimeLeft('Tomorrow');
  };

  const checkNotifications = (times: any) => {
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const prayersToCheck = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    if (ramadanMode) prayersToCheck.push('Imsak');

    prayersToCheck.forEach(prayer => {
      if (times[prayer] === currentTimeStr && !notifiedRef.current.has(prayer + currentTimeStr)) {
        // Check if setting enabled
        if (settings[prayer as keyof typeof settings]) {
            sendNotification(prayer);
            notifiedRef.current.add(prayer + currentTimeStr);
        }
      }
    });
  };

  const sendNotification = (prayer: string) => {
    const title = ramadanMode && prayer === 'Maghrib' ? 'Iftar Time!' : 
                  ramadanMode && prayer === 'Imsak' ? 'Imsak Time!' : 
                  `Time for ${prayer}`;
    
    const body = ramadanMode && prayer === 'Maghrib' ? 'Break your fast with Bismillah.' :
                 ramadanMode && prayer === 'Imsak' ? 'Stop eating, Fajr is near.' :
                 `It is now time for ${prayer} prayer.`;

    // In-app toast
    toast(title, {
        description: body,
        duration: 5000,
        icon: <Clock className="w-5 h-5 text-emerald-500" />,
    });

    // Browser notification
    if (permissionGranted) {
      new Notification(title, { body, icon: '/icon.png' });
    }
  };

  if (loading) return <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>;

  const getGradient = () => {
    if (ramadanMode) return 'bg-gradient-to-br from-emerald-900 to-emerald-700';
    if (darkMode) return 'bg-gradient-to-br from-indigo-900 to-purple-900';
    return 'bg-gradient-to-br from-emerald-400 to-cyan-400';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl p-6 ${getGradient()} text-white shadow-xl transition-all duration-500`}
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>

      {ramadanMode && (
        <div className="absolute top-2 right-2 opacity-20 rotate-12">
           <Moon className="w-24 h-24" />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-1 text-xs font-medium opacity-80 mb-1">
              <MapPin className="w-3 h-3" />
              <span>{city}</span>
            </div>
            <h3 className="text-2xl font-bold font-display">{nextPrayer}</h3>
            <p className="text-sm opacity-90">in {timeLeft}</p>
            {hijriDate && ramadanMode && (
              <div className="mt-2 inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                <Star className="w-3 h-3 text-yellow-300" />
                {hijriDate.day} {hijriDate.month.en} {hijriDate.year}
              </div>
            )}
          </div>
          <div className="text-right">
             <button 
                onClick={requestPermission}
                className="mb-2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
             >
                {permissionGranted ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
             </button>
            <div className="text-xs font-medium opacity-80 mb-1">
              {ramadanMode ? 'Iftar (Maghrib)' : 'Maghrib'}
            </div>
            <div className="text-xl font-bold font-display">{timings?.Maghrib}</div>
            {ramadanMode && (
               <div className="mt-2 text-xs font-medium opacity-80">
                 <div className="mb-1">Sahur (Imsak)</div>
                 <div className="font-bold font-display text-lg">{timings?.Imsak}</div>
               </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center">
          {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
            <div 
                key={p} 
                onClick={() => toggleSetting(p as any)}
                className={`p-2 rounded-xl cursor-pointer transition-all ${nextPrayer === p ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'hover:bg-white/10'} ${!settings[p as keyof typeof settings] ? 'opacity-50' : ''}`}
            >
              <div className="text-[10px] opacity-70 mb-1 flex justify-center items-center gap-1">
                  {p}
                  {!settings[p as keyof typeof settings] && <BellOff className="w-2 h-2" />}
              </div>
              <div className="text-xs font-bold">{timings?.[p]}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PrayerTimes;
