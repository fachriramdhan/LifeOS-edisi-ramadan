import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Moon, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 mobile-container">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-display tracking-tight">Gabung Gerakan</h1>
          <p className="text-gray-400">Tingkatkan perjalanan Ramadanmu</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm text-center border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-neon-lime focus:border-transparent outline-none transition-all"
              placeholder="Nama Lengkap"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-neon-lime focus:border-transparent outline-none transition-all"
              placeholder="Alamat Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-neon-lime focus:border-transparent outline-none transition-all"
              placeholder="Kata Sandi"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neon-lime text-black font-bold text-lg py-4 rounded-2xl hover:bg-lime-400 transition-colors flex items-center justify-center gap-2"
          >
            Mulai Sekarang <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-gray-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-white hover:underline font-bold">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
