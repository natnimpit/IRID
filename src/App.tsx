/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

// View Components
import Dashboard from './components/Dashboard';
import ModuleSelector from './components/ModuleSelector';
import RequestWizard from './components/RequestWizard';
import { MemoType, ResearchRequest, RequestStatus } from './types';
import { useState, useEffect } from 'react';
import { storage } from './lib/utils';
import { GraduationCap, UserCircle, ShieldCheck, AlertCircle } from 'lucide-react';

// Placeholder for Login
import { useAuth } from './contexts/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [faculty, setFaculty] = useState('Science and Technology');
  const [error, setError] = useState('');
  
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name, faculty);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bu-black p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="w-16 h-16 bg-bu-gold rounded-2xl flex items-center justify-center text-bu-black mx-auto mb-6 shadow-xl shadow-bu-gold/20">
          <GraduationCap className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-bu-black text-center mb-2">BU Research</h1>
        <p className="text-slate-500 text-center mb-8 text-sm">
          {isLogin ? 'ระบบตรวจสอบสิทธิประโยชน์งานวิจัย' : 'สร้างบัญชีผู้ใช้งานใหม่'}
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-gold/20 focus:border-bu-gold transition-all"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">คณะ (Faculty)</label>
                <select 
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-gold/20 focus:border-bu-gold transition-all"
                >
                  <option>Science and Technology</option>
                  <option>Business Administration</option>
                  <option>Communication Arts</option>
                  <option>Engineering</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">อีเมล / Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-gold/20 focus:border-bu-gold transition-all"
              placeholder="email@bu.ac.th"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">รหัสผ่าน / Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-gold/20 focus:border-bu-gold transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-bu-gold text-bu-black font-bold rounded-2xl shadow-lg hover:shadow-bu-gold/30 hover:bg-bu-gold-hover transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-bu-gold hover:text-bu-gold-hover transition-colors"
          >
            {isLogin ? 'ยังไม่มีบัญชี? สมัครสมาชิกที่นี่' : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'}
          </button>
          <p className="mt-6 text-[10px] text-slate-400 font-mono uppercase tracking-widest">Authorized Access Only</p>
        </div>
      </div>
    </div>
  );
};

// Adapt Dashboard for Route
const DashboardPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  
  useEffect(() => { 
    setRequests(storage.getRequests()); 
  }, []);

  return (
    <Dashboard 
      role={role || 'faculty'} 
      requests={requests} 
      onCreateNew={() => navigate('/submit')} 
      onUpdate={(req) => { 
        storage.saveRequest(req); 
        setRequests(storage.getRequests()); 
      }}
    />
  );
};

// Admin Review Page
const AdminReviewPage = () => {
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  
  useEffect(() => { 
    setRequests(storage.getRequests()); 
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-bu-black">Admin Review Panel</h2>
        <div className="px-3 py-1 bg-bu-gold/10 text-bu-gold text-[10px] uppercase font-bold rounded-lg border border-bu-gold/20">
          Management Mode
        </div>
      </div>
      <Dashboard 
        role="admin" 
        requests={requests} 
        onCreateNew={() => {}} 
        onUpdate={(req) => { 
          storage.saveRequest(req); 
          setRequests(storage.getRequests()); 
        }}
      />
    </div>
  );
};

// Adapt Submit for Route
const SubmitPage = () => {
  const navigate = useNavigate();
  const [selectedMemo, setSelectedMemo] = useState<MemoType | null>(null);
  
  if (selectedMemo) {
    return (
      <RequestWizard 
        memoType={selectedMemo} 
        onCancel={() => setSelectedMemo(null)} 
        onSubmit={(data) => {
          const newReq: ResearchRequest = {
            ...data,
            id: Math.random().toString(36).substring(2, 9),
            submittedAt: new Date().toISOString(),
            status: RequestStatus.PENDING,
          };
          storage.saveRequest(newReq);
          navigate('/');
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-bu-black">เริ่มทำรายการใหม่</h2>
      <p className="text-slate-500">เลือกประเภทสิทธิประโยชน์ที่ต้องการยื่นคำขอ</p>
      <ModuleSelector onSelect={(m) => setSelectedMemo(m)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/history" element={<div className="p-8 bg-white rounded-3xl border border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Personal History</h2>
              <p className="text-slate-500">Your research benefit applications history will appear here.</p>
            </div>} />
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="admin">
                <AdminReviewPage />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
