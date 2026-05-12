import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  ShieldCheck, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const { user, profile, role, logout } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/submit', icon: PlusCircle, label: 'New Request' },
    { to: '/history', icon: History, label: 'History' },
  ];

  if (role === 'admin') {
    navItems.push({ to: '/admin', icon: ShieldCheck, label: 'Review Panel' });
  }

  return (
    <aside className="w-64 bg-bu-black text-white h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-bu-gold rounded-lg flex items-center justify-center text-bu-black shadow-lg shadow-bu-gold/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">BU Research</h1>
          <p className="text-[10px] uppercase font-mono tracking-widest text-bu-gold">Benefit System</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              isActive 
                ? "bg-bu-gold text-bu-black font-bold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {user && (
          <div className="mb-4 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-500 uppercase tracking-tighter font-bold mb-1">Signed in as</p>
            <p className="text-sm font-medium truncate">{profile?.displayName || user.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-bu-gold uppercase font-bold">{role}</span>
            </div>
          </div>
        )}
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 transition-all font-bold"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
