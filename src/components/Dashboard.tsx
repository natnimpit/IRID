import { Plus, Clock, CheckCircle2, AlertCircle, ExternalLink, ChevronRight, Search, Filter, LayoutDashboard } from 'lucide-react';
import { ResearchRequest, RequestStatus, MemoType } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface DashboardProps {
  role: 'faculty' | 'admin';
  requests: ResearchRequest[];
  onCreateNew: () => void;
  onUpdate: (request: ResearchRequest) => void;
}

export default function Dashboard({ role, requests, onCreateNew, onUpdate }: DashboardProps) {
  const stats = {
    pending: requests.filter(r => r.status === RequestStatus.PENDING).length,
    approved: requests.filter(r => r.status === RequestStatus.APPROVED).length,
    incomplete: requests.filter(r => r.status === RequestStatus.INCOMPLETE).length,
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING: return <Clock className="w-4 h-4 text-amber-500" />;
      case RequestStatus.APPROVED: return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case RequestStatus.INCOMPLETE: return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case RequestStatus.REJECTED: return <AlertCircle className="w-4 h-4 text-rose-500" />;
    }
  };

  const getStatusLabel = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING: return 'รอดำเนินการ';
      case RequestStatus.APPROVED: return 'อนุมัติแล้ว';
      case RequestStatus.INCOMPLETE: return 'เอกสารไม่ครบ';
      case RequestStatus.REJECTED: return 'ปฏิเสธ';
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING: return 'bg-amber-50 text-amber-700 border-amber-200';
      case RequestStatus.APPROVED: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case RequestStatus.INCOMPLETE: return 'bg-orange-50 text-orange-700 border-orange-200';
      case RequestStatus.REJECTED: return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const handleReview = (request: ResearchRequest, status: RequestStatus, note?: string) => {
    onUpdate({
      ...request,
      status,
      reviewNotes: note || request.reviewNotes
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-900">
            {role === 'faculty' ? 'รายการคำขอของคุณ' : 'ระบบจัดการเอกสารวิจัย'}
          </h2>
          <p className="text-slate-500">
            {role === 'faculty' 
              ? 'ติดตามสถานะและยื่นคำขอรับสิทธิประโยชน์งานวิจัย' 
              : 'ตรวจสอบและอนุมัติคำขอจากอาจารย์และนักวิจัย'}
          </p>
        </div>

        {role === 'faculty' && (
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-bu-purple text-white rounded-xl font-bold shadow-lg shadow-bu-purple/20 hover:bg-bu-purple/90 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            ยื่นคำขอใหม่
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">รอดำเนินการ</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            <Clock className="w-5 h-5 text-amber-200" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">อนุมัติแล้ว</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">ต้องแก้ไข</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-orange-600">{stats.incomplete}</p>
            <AlertCircle className="w-5 h-5 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="ค้นหาตามชื่อผลงาน..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bu-purple/20 focus:border-bu-purple transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 font-medium hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
              <Filter className="w-4 h-4" />
              กรอง
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 italic font-display text-[11px] uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-normal">ลำดับ / ประเภท</th>
                <th className="px-6 py-4 font-normal">
                  {role === 'faculty' ? 'ชื่อโครงการ / รายละเอียด' : 'ผู้ยื่นคำขอ / รายละเอียด'}
                </th>
                <th className="px-6 py-4 font-normal">จำนวนเงิน / งบ</th>
                <th className="px-6 py-4 font-normal">วันที่มีผล</th>
                <th className="px-6 py-4 font-normal">สถานะ</th>
                <th className="px-6 py-4 font-normal text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <LayoutDashboard className="w-12 h-12" />
                      <p className="text-lg font-medium">ยังไม่มีข้อมูลคำขอในขณะนี้</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((request, idx) => (
                  <tr key={request.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400">{(idx + 1).toString().padStart(2, '0')}</span>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-bu-purple/10 text-bu-purple border border-bu-purple/20">
                          {request.memoType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 group-hover:text-bu-purple transition-colors truncate max-w-[300px]">
                          {request.memoData.title || request.memoData.conferenceName || 'ไม่มีชื่อโครงการ'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {role === 'faculty' 
                            ? (request.memoData.journalName || request.memoData.publisherName || '-')
                            : request.userName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm font-semibold text-slate-700">
                        {request.calculatedAmount || request.memoData.amountRequested 
                          ? (request.calculatedAmount || request.memoData.amountRequested).toLocaleString() + ' ฿'
                          : '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                      {format(new Date(request.submittedAt), 'dd MMM yyyy', { locale: th })}
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                        getStatusColor(request.status)
                      )}>
                        {getStatusIcon(request.status)}
                        {getStatusLabel(request.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={request.driveFolderLink} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-bu-purple transition-all"
                          title="ดูโฟลเดอร์หลักฐาน"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        
                        {role === 'admin' && request.status === RequestStatus.PENDING && (
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReview(request, RequestStatus.APPROVED);
                              }}
                              className="px-3 py-1 bg-emerald-500 text-white rounded-md text-xs font-bold hover:bg-emerald-600 transition-colors"
                            >
                              อนุมัติ
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const note = prompt('ระบุเหตุผลที่ให้แก้ไข:');
                                if (note) handleReview(request, RequestStatus.INCOMPLETE, note);
                              }}
                              className="px-3 py-1 bg-orange-400 text-white rounded-md text-xs font-bold hover:bg-orange-500 transition-colors"
                            >
                              ให้แก้ไข
                            </button>
                          </div>
                        )}

                        {role === 'faculty' && (
                          <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-bu-purple transition-all">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
