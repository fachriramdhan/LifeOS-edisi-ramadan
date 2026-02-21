import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Zap } from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const Productivity = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await api.get('/productivity/habits');
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit) return;
    try {
      const res = await api.post('/productivity/habits', { name: newHabit });
      setNewHabit('');
      fetchHabits();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating habit');
    }
  };

  const deleteHabit = async (id: number) => {
    if (!confirm('Delete this habit?')) return;
    try {
      await api.delete(`/productivity/habits/${id}`);
      setHabits(habits.filter(h => h.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const logHabit = async (id: number, value: number) => {
    const date = new Date().toISOString().split('T')[0];
    try {
      await api.post(`/productivity/habits/${id}/log`, { date, value });
      setHabits(habits.map(h => h.id === id ? { ...h, todayValue: value } : h));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold font-display mb-1">Level Up</h2>
          <p className="opacity-80 text-sm">Bangun konsistensi, satu hari demi satu hari.</p>
        </div>
        <Zap className="absolute right-4 bottom-4 w-24 h-24 text-white opacity-10 rotate-12" />
      </div>

      {/* Add Habit Form */}
      <form onSubmit={addHabit} className="relative">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Kebiasaan baru..."
          className="w-full bg-white dark:bg-gray-900 border-none rounded-2xl pl-6 pr-14 py-4 shadow-sm dark:text-white focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-2 bottom-2 w-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* Habits List */}
      <div className="space-y-3">
        <AnimatePresence>
          {habits.map((habit) => (
            <motion.div 
              key={habit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => logHabit(habit.id, habit.todayValue ? 0 : 1)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    habit.todayValue 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Check className={`w-6 h-6 transition-transform ${habit.todayValue ? 'scale-100' : 'scale-0'}`} />
                </button>
                <div>
                  <h3 className={`font-bold text-lg transition-colors ${habit.todayValue ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-white'}`}>
                    {habit.name}
                  </h3>
                  <p className="text-xs text-gray-400">Target Harian</p>
                </div>
              </div>
              
              <button 
                onClick={() => deleteHabit(habit.id)} 
                className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {habits.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Belum ada kebiasaan. Mulai dari yang kecil!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Productivity;
