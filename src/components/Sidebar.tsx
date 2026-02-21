import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Moon, CheckCircle, DollarSign, FileText, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/ibadah', icon: Moon, label: 'Ibadah' },
    { to: '/productivity', icon: CheckCircle, label: 'Productivity' },
    { to: '/finance', icon: DollarSign, label: 'Finance' },
    { to: '/reports', icon: FileText, label: 'Reports', premium: true },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-emerald-900 text-white h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Moon className="w-8 h-8 text-emerald-400" />
          MyLifeOS
        </h1>
        <p className="text-xs text-emerald-300 mt-1">Ramadan & Productivity</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                isActive ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800/50'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-emerald-300 truncate capitalize">{user?.role} Plan</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full text-emerald-100 hover:bg-emerald-800/50 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
