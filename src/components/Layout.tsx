import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { LayoutDashboard, Moon, CheckCircle, DollarSign, FileText, User, Sun, Menu, X, Bell, BellOff, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const { user, logout } = useAuth();
  const { settings, toggleSetting, requestPermission, permissionGranted } = useNotifications();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Beranda' },
    { to: '/ibadah', icon: Moon, label: 'Ibadah' },
    { to: '/productivity', icon: CheckCircle, label: 'Kebiasaan' },
    { to: '/finance', icon: DollarSign, label: 'Keuangan' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="mobile-container flex flex-col h-screen">
        
        {/* Header */}
        <header className="px-6 py-6 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-lime to-emerald-500 flex items-center justify-center text-black font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase() || 'M'}
            </div>
            <div>
              <h1 className="text-sm font-bold dark:text-white">Hai, {user?.name?.split(' ')[0]}</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Ramadan Hari ke-5</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsFaqOpen(true)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
          <Outlet context={{ darkMode }} />
        </main>

        {/* Floating Bottom Nav */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[440px] z-50">
          <div className="glass dark:bg-gray-900/90 rounded-2xl p-2 flex justify-between items-center shadow-2xl shadow-black/10">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300',
                    isActive 
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  )
                }
              >
                <item.icon className="w-5 h-5 mb-1" />
              </NavLink>
            ))}
          </div>
        </div>

        {/* Full Screen Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed inset-0 z-[60] bg-white dark:bg-black p-6 mobile-container overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold font-display dark:text-white">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <X className="w-6 h-6 dark:text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold dark:text-white">{user?.name}</h3>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold dark:text-white flex items-center gap-2">
                      <Bell className="w-4 h-4" /> Notifikasi
                    </h3>
                    {!permissionGranted && (
                      <button onClick={requestAccess} className="text-xs bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full font-bold">
                        Aktifkan
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(settings).map((key) => (
                      <button
                        key={key}
                        onClick={() => toggleSetting(key as any)}
                        className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                          settings[key as keyof typeof settings]
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-700'
                        }`}
                      >
                        {key}
                        {settings[key as keyof typeof settings] ? <CheckCircle className="w-3 h-3" /> : <BellOff className="w-3 h-3 opacity-50" />}
                      </button>
                    ))}
                  </div>
                </div>

                <NavLink to="/reports" onClick={() => setIsMenuOpen(false)} className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl font-medium dark:text-white">
                  Laporan Bulanan
                </NavLink>
                
                <button onClick={logout} className="w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl font-medium text-left">
                  Keluar
                </button>
              </div>
              
              <div className="mt-12 text-center text-xs text-gray-400">
                <p>MyLifeOS v1.0</p>
                <p>Edisi Ramadan</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ Overlay */}
        <AnimatePresence>
          {isFaqOpen && (
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-[60] bg-white dark:bg-black p-6 mobile-container overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold font-display dark:text-white">Panduan & FAQ</h2>
                <button onClick={() => setIsFaqOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <X className="w-6 h-6 dark:text-white" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                  <h3 className="font-bold text-lg mb-2 dark:text-white">Selamat Datang di MyLifeOS! 🌙</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Aplikasi ini dirancang untuk membantu kamu menjalani Ramadan yang lebih produktif dan bermakna. Berikut adalah panduan singkat penggunaan fitur-fiturnya.
                  </p>
                </div>

                <div className="space-y-4">
                  <FaqItem 
                    question="Bagaimana cara mencatat ibadah harian?" 
                    answer="Masuk ke halaman 'Ibadah' melalui menu bawah. Di tab 'Tracker', kamu bisa mencentang sholat 5 waktu, sholat sunnah, dan mencatat jumlah halaman tilawah serta sedekah harianmu. Jangan lupa klik 'Simpan Progres' ya!" 
                  />
                  <FaqItem 
                    question="Apa itu Mode Ramadan?" 
                    answer="Mode Ramadan adalah fitur spesial yang mengubah tampilan dan fungsi aplikasi untuk bulan suci. Aktifkan di halaman Ibadah untuk melihat jadwal Imsak, Iftar, dan target Khatam Quran." 
                  />
                  <FaqItem 
                    question="Bagaimana cara menggunakan Kalkulator Zakat?" 
                    answer="Buka halaman 'Keuangan' dan pilih tab 'Zakat'. Masukkan total tabungan, nilai emas/perak, dan hutang kamu. Aplikasi akan otomatis menghitung 2.5% kewajiban zakatmu." 
                  />
                  <FaqItem 
                    question="Apakah notifikasi adzan bisa diatur?" 
                    answer="Tentu! Buka menu utama (ikon burger di pojok kanan atas), lalu lihat bagian 'Notifikasi'. Kamu bisa mengaktifkan atau mematikan pengingat untuk setiap waktu sholat secara terpisah." 
                  />
                  <FaqItem 
                    question="Bagaimana cara mencari arah Kiblat?" 
                    answer="Di halaman 'Ibadah', pilih tab 'Tools'. Kamu akan menemukan fitur Pencari Kiblat. Pastikan kamu memberikan izin akses lokasi dan kompas pada perangkatmu untuk hasil yang akurat." 
                  />
                </div>

                <div className="text-center pt-8 pb-4">
                  <p className="text-xs text-gray-400">Dibuat dengan ❤️ untuk Ramadan yang lebih baik.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
  
  function requestAccess() {
      requestPermission();
  }
};

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-bold text-sm dark:text-white py-2"
      >
        {question}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
          <X className="w-4 h-4 rotate-45" />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-2">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
