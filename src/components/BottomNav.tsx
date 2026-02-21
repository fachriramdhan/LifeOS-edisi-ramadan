import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Moon, CheckCircle, DollarSign, Menu } from 'lucide-react';
import clsx from 'clsx';

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Home' },
    { to: '/ibadah', icon: Moon, label: 'Ibadah' },
    { to: '/productivity', icon: CheckCircle, label: 'Habits' },
    { to: '/finance', icon: DollarSign, label: 'Finance' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
              isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'
            )
          }
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
