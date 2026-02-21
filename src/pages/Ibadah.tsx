import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Save, BookOpen, Heart, Moon, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import api from '../api';
import PrayerTimes from '../components/PrayerTimes';
import QiblaFinder from '../components/QiblaFinder';

const Ibadah = () => {
  const { darkMode } = useOutletContext<{ darkMode: boolean }>();
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState({
    subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false,
    tarawih: false, tahajud: false, tilawah: 0, sedekah: 0
  });
  const [activeTab, setActiveTab] = useState<'tracker' | 'tools'>('tracker');
  const [ramadanMode, setRamadanMode] = useState(false);

  const formattedDate = format(date, 'yyyy-MM-dd');

  useEffect(() => {
    fetchLog();
  }, [date]);

  const fetchLog = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/ibadah/${formattedDate}`);
      setLog({
        subuh: !!res.data.subuh,
        dzuhur: !!res.data.dzuhur,
        ashar: !!res.data.ashar,
        maghrib: !!res.data.maghrib,
        isya: !!res.data.isya,
        tarawih: !!res.data.tarawih,
        tahajud: !!res.data.tahajud,
        tilawah: res.data.tilawah || 0,
        sedekah: res.data.sedekah || 0
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.post('/ibadah', { date: formattedDate, ...log });
      alert('Saved successfully');
    } catch (err) {
      alert('Error saving');
    }
  };

  const toggle = (field: keyof typeof log) => {
    setLog(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const quranTarget = 30; // Juz
  const pagesPerDay = 20; // Approx 1 juz

  return (
    <div className="space-y-6 pb-20">
      {/* Ramadan Mode Toggle */}
      <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm dark:text-white">Mode Ramadan</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Fitur spesial bulan suci</p>
          </div>
        </div>
        <button 
          onClick={() => setRamadanMode(!ramadanMode)}
          className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${ramadanMode ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
          <motion.div 
            layout
            className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm"
            animate={{ x: ramadanMode ? 20 : 0 }}
          />
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl mb-6">
        <button 
          onClick={() => setActiveTab('tracker')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'tracker' ? 'bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}
        >
          Tracker
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'tools' ? 'bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}
        >
          Alat
        </button>
      </div>

      {activeTab === 'tracker' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Date Navigation */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <button onClick={() => setDate(subDays(date, 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full dark:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold font-display dark:text-white">{format(date, 'EEE, d MMM')}</h2>
            <button onClick={() => setDate(addDays(date, 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full dark:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Fardhu Prayers */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-2">Fardhu</h3>
            {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((prayer) => (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                key={prayer} 
                onClick={() => toggle(prayer as any)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  (log as any)[prayer] 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 dark:text-white'
                }`}
              >
                <span className="capitalize font-bold text-lg font-display">{prayer}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  (log as any)[prayer] ? 'border-white bg-white/20' : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {(log as any)[prayer] && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sunnah & Extras */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-2">Sunnah</h3>
            <div className="grid grid-cols-2 gap-3">
              {['tahajud', 'tarawih'].map((prayer) => (
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  key={prayer}
                  onClick={() => toggle(prayer as any)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    (log as any)[prayer] 
                      ? 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/30' 
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 dark:text-white'
                  }`}
                >
                  <span className="capitalize font-bold block mb-2">{prayer}</span>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    (log as any)[prayer] ? 'border-white bg-white/20' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {(log as any)[prayer] && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quran & Sedekah */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 font-bold dark:text-white">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  Tilawah (Halaman)
                </label>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">Target: {pagesPerDay}</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLog(prev => ({ ...prev, tilawah: Math.max(0, prev.tilawah - 1) }))}
                  className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl font-bold dark:text-white"
                >
                  -
                </button>
                <input
                  type="number"
                  value={log.tilawah}
                  onChange={(e) => setLog({ ...log, tilawah: parseInt(e.target.value) || 0 })}
                  className="flex-1 text-center text-2xl font-bold font-display bg-transparent border-none focus:ring-0 dark:text-white"
                />
                <button 
                  onClick={() => setLog(prev => ({ ...prev, tilawah: prev.tilawah + 1 }))}
                  className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/30"
                >
                  +
                </button>
              </div>
              <div className="mt-2 w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all" 
                  style={{ width: `${Math.min(100, (log.tilawah / pagesPerDay) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <label className="flex items-center gap-2 font-bold dark:text-white mb-3">
                <Heart className="w-5 h-5 text-pink-500" />
                Sedekah (IDR)
              </label>
              <input
                type="number"
                value={log.sedekah || ''}
                placeholder="0"
                onChange={(e) => setLog({ ...log, sedekah: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-pink-500 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform"
          >
            Simpan Progres
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <PrayerTimes darkMode={darkMode} ramadanMode={ramadanMode} />
          
          <div className="grid grid-cols-1 gap-6">
            <QiblaFinder />
            
            <div className={`rounded-3xl p-6 text-white shadow-lg ${ramadanMode ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-orange-400 to-pink-500'}`}>
              <h3 className="font-bold text-xl mb-1">Target Khatam</h3>
              <p className="text-white/80 text-sm mb-4">Selesaikan 30 Juz di bulan Ramadan</p>
              
              <div className="flex justify-between items-end mb-2">
                <span className="text-4xl font-display font-bold">1.2</span>
                <span className="text-sm font-medium mb-2">Juz / Hari</span>
              </div>
              
              <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progres Saat Ini</span>
                  <span>Juz 2</span>
                </div>
                <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[15%]"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Helper icon
const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

export default Ibadah;
