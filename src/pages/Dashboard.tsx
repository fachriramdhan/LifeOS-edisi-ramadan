import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Moon, CheckCircle, DollarSign, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import api from '../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { darkMode } = useOutletContext<{ darkMode: boolean }>();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/reports/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading vibes...</div>;

  const ibadahScore = stats?.ibadah ? 
    (['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].filter(p => stats.ibadah[p]).length / 5) * 100 
    : 0;

  const habitScore = stats?.habits?.total > 0 
    ? (stats.habits.completed / stats.habits.total) * 100 
    : 0;

  const chartData = {
    labels: stats?.weeklyTrend?.map((d: any) => d.date.slice(5)) || [],
    datasets: [
      {
        label: 'Prayer Streak',
        data: stats?.weeklyTrend?.map((d: any) => d.score) || [],
        backgroundColor: darkMode ? '#ccff00' : '#10b981',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#333' : '#fff',
        titleColor: darkMode ? '#fff' : '#000',
        bodyColor: darkMode ? '#fff' : '#000',
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: darkMode ? '#888' : '#aaa' }
      },
      y: {
        display: false,
        max: 5,
      },
    },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      
      {/* Hero Card */}
      <div className="relative overflow-hidden bg-black dark:bg-white text-white dark:text-black p-6 rounded-3xl shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-lime opacity-20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm opacity-70 mb-1">Target Ramadan</p>
              <h2 className="text-3xl font-bold font-display">30 Hari Lagi</h2>
            </div>
            <div className="w-12 h-12 bg-white/20 dark:bg-black/10 rounded-full flex items-center justify-center backdrop-blur-md">
              <Zap className="w-6 h-6 text-neon-lime dark:text-black" />
            </div>
          </div>
          
          <div className="bg-white/10 dark:bg-black/5 p-4 rounded-2xl backdrop-blur-sm">
            <p className="text-xs opacity-80 italic mb-2">"Barangsiapa berpuasa Ramadan karena iman..."</p>
            <div className="w-full bg-white/20 dark:bg-black/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-neon-lime dark:bg-black h-full w-[15%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-3">
            <Moon className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold font-display dark:text-white">{Math.round(ibadahScore)}%</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Skor Ibadah</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold font-display dark:text-white">
            {stats?.habits?.completed || 0}<span className="text-sm text-gray-400 font-sans">/{stats?.habits?.total || 0}</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Kebiasaan Selesai</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg dark:text-white">Konsistensi</h3>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="h-40">
          <Bar options={options} data={chartData} />
        </div>
      </div>

      {/* Expenses Mini */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 text-white p-6 rounded-3xl flex items-center justify-between shadow-lg">
        <div>
          <p className="text-xs opacity-60 mb-1">Total Pengeluaran</p>
          <h3 className="text-2xl font-bold font-display">Rp {stats?.expenses?.toLocaleString('id-ID') || 0}</h3>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

    </motion.div>
  );
};

export default Dashboard;
