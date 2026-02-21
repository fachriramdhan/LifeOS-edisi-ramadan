import React from 'react';
import { Download, FileText } from 'lucide-react';
import api from '../api';
import { motion } from 'framer-motion';

const Reports = () => {
  const downloadReport = async () => {
    try {
      const res = await api.get('/reports/ramadan', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ramadan-report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
      alert('Error downloading report');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      
      <div className="bg-black dark:bg-white text-white dark:text-black p-8 rounded-3xl shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/10 dark:bg-black/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <FileText className="w-10 h-10" />
          </div>
          
          <h2 className="text-3xl font-bold font-display mb-2">Rekap Bulanan</h2>
          <p className="text-white/60 dark:text-black/60 mb-8 max-w-xs mx-auto">
            Dapatkan ringkasan PDF detail tentang Ibadah, kebiasaan, dan keuanganmu.
          </p>

          <button
            onClick={downloadReport}
            className="w-full bg-neon-lime text-black font-bold py-4 rounded-2xl shadow-lg shadow-neon-lime/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Unduh PDF
          </button>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
        <div className="flex justify-center gap-2 mb-4 opacity-50">
          <div className="w-2 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="w-2 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="w-2 h-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="w-2 h-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="w-2 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-400">Analitik Lanjutan Segera Hadir</p>
      </div>

    </motion.div>
  );
};

export default Reports;
