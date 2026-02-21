import React, { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, TrendingDown, Wallet, PieChart } from 'lucide-react';
import api from '../api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ZakatCalculator from '../components/ZakatCalculator';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Finance = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'expenses' | 'zakat'>('expenses');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/finance');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/finance', {
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(amount),
        category,
        note
      });
      setAmount('');
      setNote('');
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExpense = async (id: number) => {
    if (!confirm('Hapus pengeluaran ini?')) return;
    try {
      await api.delete(`/finance/${id}`);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Prepare Chart Data
  const categories = ['Makanan', 'Transportasi', 'Tagihan', 'Belanja', 'Sedekah', 'Lainnya'];
  const categoryData = categories.map(cat => 
    expenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0)
  );

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categoryData,
        backgroundColor: [
          '#10B981', // Emerald (Food)
          '#3B82F6', // Blue (Transport)
          '#F59E0B', // Amber (Utilities)
          '#EC4899', // Pink (Shopping)
          '#8B5CF6', // Violet (Charity)
          '#6B7280', // Gray (Other)
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#333',
          font: { size: 10 }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
        <button 
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'expenses' ? 'bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}
        >
          Pengeluaran
        </button>
        <button 
          onClick={() => setActiveTab('zakat')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'zakat' ? 'bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}
        >
          Zakat
        </button>
      </div>

      {activeTab === 'expenses' ? (
        <div className="space-y-6">
          {/* Total Card & Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black dark:bg-white text-white dark:text-black p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-center">
              <div className="relative z-10">
                <p className="opacity-60 text-sm mb-1">Total Pengeluaran</p>
                <h2 className="text-4xl font-bold font-display">Rp {totalExpenses.toLocaleString('id-ID')}</h2>
              </div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500 opacity-20 blur-3xl rounded-full -mr-10 -mt-10"></div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-center relative">
               {totalExpenses > 0 ? (
                 <div className="w-full h-32">
                   <Doughnut data={chartData} options={chartOptions} />
                 </div>
               ) : (
                 <div className="text-center text-gray-400 text-xs">
                   <PieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                   Belum ada data
                 </div>
               )}
            </div>
          </div>

          {/* Add Form */}
          <form onSubmit={addExpense} className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">Jumlah</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 font-bold text-lg dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-bold dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Catatan</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-bold dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Detail..."
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 active:scale-95 transition-transform flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Tambah Transaksi
            </button>
          </form>

          {/* List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase ml-2">Transaksi Terakhir</h3>
            <AnimatePresence>
              {expenses.map((expense) => (
                <motion.div 
                  key={expense.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white">{expense.category}</h4>
                      <p className="text-xs text-gray-400">{format(new Date(expense.date), 'd MMM')} • {expense.note}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-500">-Rp {expense.amount.toLocaleString('id-ID')}</p>
                    <button onClick={() => deleteExpense(expense.id)} className="text-xs text-gray-300 hover:text-red-500 mt-1">
                      <Trash2 className="w-3 h-3 inline" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {expenses.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                Belum ada pengeluaran.
              </div>
            )}
          </div>
        </div>
      ) : (
        <ZakatCalculator />
      )}
    </motion.div>
  );
};

export default Finance;
