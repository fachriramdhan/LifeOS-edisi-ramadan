import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, RefreshCw } from 'lucide-react';

const ZakatCalculator = () => {
  const [assets, setAssets] = useState<string>('');
  const [gold, setGold] = useState<string>('');
  const [debts, setDebts] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculateZakat = () => {
    const totalAssets = (parseFloat(assets) || 0) + (parseFloat(gold) || 0) - (parseFloat(debts) || 0);
    const zakatAmount = Math.max(0, totalAssets * 0.025);
    setResult(zakatAmount);
  };

  const reset = () => {
    setAssets('');
    setGold('');
    setDebts('');
    setResult(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neon-lime/20 flex items-center justify-center text-emerald-600 dark:text-neon-lime">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white font-display">Kalkulator Zakat</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Bersihkan hartamu (2.5%)</p>
          </div>
        </div>
        <button onClick={reset} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Tabungan & Uang Tunai</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
            <input 
              type="number" 
              value={assets}
              onChange={(e) => setAssets(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 font-bold dark:text-white focus:ring-2 focus:ring-neon-lime"
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Emas/Perak</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
              <input 
                type="number" 
                value={gold}
                onChange={(e) => setGold(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 font-bold dark:text-white focus:ring-2 focus:ring-neon-lime"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hutang</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
              <input 
                type="number" 
                value={debts}
                onChange={(e) => setDebts(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 font-bold dark:text-white focus:ring-2 focus:ring-neon-lime"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={calculateZakat}
          className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
        >
          Hitung <ArrowRight className="w-4 h-4" />
        </button>

        {result !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-center text-white shadow-lg"
          >
            <p className="text-xs text-white/80 mb-1 uppercase tracking-wider font-bold">Jumlah Zakat</p>
            <p className="text-3xl font-bold font-display">
              Rp {result.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-white/60 mt-2">Berdasarkan 2.5% dari aset bersih</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ZakatCalculator;
