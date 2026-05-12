import { ShieldCheck, GraduationCap, UserCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  role: 'faculty' | 'admin';
  setRole: (role: 'faculty' | 'admin') => void;
}

export default function Header({ role, setRole }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 academic-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-bu-purple/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-bu-purple leading-tight">BU Research</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold font-mono">Benefit System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setRole('faculty')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                role === 'faculty' 
                  ? "bg-white text-bu-purple shadow-sm ring-1 ring-slate-200" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <UserCircle className="w-4 h-4" />
              อาจารย์
            </button>
            <button
              onClick={() => setRole('admin')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                role === 'admin' 
                  ? "bg-white text-bu-purple shadow-sm ring-1 ring-slate-200" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              เจ้าหน้าที่
            </button>
          </div>
          
          <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block" />
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {role === 'faculty' ? 'อาจารย์ สมชาย วิจัยดี' : 'เจ้าหน้าที่ สมสิริ ตรวจสอบ'}
              </p>
              <p className="text-xs text-slate-500">
                {role === 'faculty' ? 'คณะวิทยาศาสตร์และเทคโนโลยี' : 'กองส่งเสริมงานวิจัย'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm ring-1 ring-slate-100">
              {role === 'faculty' ? 'SV' : 'ST'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
