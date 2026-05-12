import { useState, useMemo } from 'react';
import { 
  Award, 
  CalendarDays, 
  FileBadge, 
  CreditCard, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Info,
  AlertTriangle
} from 'lucide-react';
import { 
  MemoType, 
  PublicationRewardData, 
  TimeExemptionData, 
  ConferenceSupportData, 
  PageChargeData 
} from '../types';
import { cn } from '../lib/utils';

interface RequestWizardProps {
  memoType: MemoType;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const BLACKLIST_PUBLISHERS = ['MDPI', 'Frontiers', 'Hindawi', 'Bentham Science'];

export default function RequestWizard({ memoType, onCancel, onSubmit }: RequestWizardProps) {
  const [step, setStep] = useState(1);
  const [academicYear, setAcademicYear] = useState('2567');
  const [driveLink, setDriveLink] = useState('');
  
  // Specific Form States
  const [pubData, setPubData] = useState<Partial<PublicationRewardData>>({
    indexing: 'Scopus-Q1',
    hasImpactFactor: false
  });
  const [timeData, setTimeData] = useState<Partial<TimeExemptionData>>({
    authorRole: 'First'
  });
  const [confData, setConfData] = useState<Partial<ConferenceSupportData>>({
    location: 'International',
    occurence: '1st',
    indexing: 'Scopus'
  });
  const [pageData, setPageData] = useState<Partial<PageChargeData>>({});

  const calculatedReward = useMemo(() => {
    if (memoType !== MemoType.PUBLICATION_REWARD) return 0;
    let base = 0;
    if (pubData.indexing === 'Scopus-Q1') base = 25000;
    else if (pubData.indexing === 'Scopus-Q2') base = 15000;
    else if (pubData.indexing === 'Scopus-Q3') base = 10000;
    else if (pubData.indexing === 'TCI-1') base = 5000;
    
    const bonus = pubData.hasImpactFactor ? (pubData.impactFactorValue || 0) * 2000 : 0;
    return base + bonus;
  }, [memoType, pubData]);

  const isPublisherBlacklisted = useMemo(() => {
    if (memoType !== MemoType.TIME_EXEMPTION) return false;
    return BLACKLIST_PUBLISHERS.includes(timeData.publisherName || '');
  }, [memoType, timeData.publisherName]);

  const handleFinalSubmit = () => {
    let memoData = {};
    if (memoType === MemoType.PUBLICATION_REWARD) memoData = pubData;
    else if (memoType === MemoType.TIME_EXEMPTION) memoData = timeData;
    else if (memoType === MemoType.CONFERENCE_SUPPORT) memoData = confData;
    else if (memoType === MemoType.PAGE_CHARGE) memoData = pageData;

    onSubmit({
      userName: 'อาจารย์ สมชาย วิจัยดี',
      role: 'faculty',
      memoType,
      academicYear,
      driveFolderLink: driveLink,
      memoData,
      calculatedAmount: calculatedReward || (memoType === MemoType.PAGE_CHARGE ? pageData.amountRequested : undefined)
    });
  };

  const currentModule = {
    [MemoType.PUBLICATION_REWARD]: { title: 'ขอรางวัลการตีพิมพ์', icon: Award, color: 'text-amber-600' },
    [MemoType.TIME_EXEMPTION]: { title: 'ขอสิทธิยกเว้นบันทึกเวลา', icon: CalendarDays, color: 'text-sky-600' },
    [MemoType.CONFERENCE_SUPPORT]: { title: 'ขอนำเสนอผลงานใน Conference', icon: FileBadge, color: 'text-emerald-600' },
    [MemoType.PAGE_CHARGE]: { title: 'ขออนุมัติค่า Page Charge', icon: CreditCard, color: 'text-purple-600' },
  }[memoType];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
      {/* Stepper Header */}
      <div className="flex bg-slate-50 border-b border-slate-200">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center justify-center py-4 relative">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10",
              step >= s ? "bg-bu-purple text-white" : "bg-slate-200 text-slate-500"
            )}>
              {s}
            </div>
            {s < 3 && (
              <div className={cn(
                "absolute top-1/2 left-[calc(50%+1rem)] right-[-1rem] h-0.5 -translate-y-1/2 transition-all",
                step > s ? "bg-bu-purple" : "bg-slate-200"
              )} />
            )}
            <span className={cn(
               "absolute top-14 text-[10px] uppercase font-bold tracking-wider",
               step === s ? "text-bu-purple" : "text-slate-400"
            )}>
              {s === 1 ? 'ข้อมูลเบื้องต้น' : s === 2 ? 'รายละเอียด' : 'ส่งหลักฐาน'}
            </span>
          </div>
        ))}
        <div className="flex items-center px-6">
          <currentModule.icon className={cn("w-6 h-6", currentModule.color)} />
          <div className="ml-3 hidden sm:block">
            <h3 className="text-sm font-bold text-slate-800">{currentModule.title}</h3>
            <span className="text-[10px] text-slate-500 uppercase font-mono">{memoType}</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 min-h-[450px]">
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ปีการศึกษา</label>
                <select 
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-purple/20 focus:border-bu-purple transition-all"
                >
                  <option>2567</option>
                  <option>2566</option>
                  <option>2565</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ชื่อผู้ยื่นคำขอ</label>
                <input 
                  type="text" 
                  disabled 
                  value="อาจารย์ สมชาย วิจัยดี" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="bg-bu-purple/5 p-6 rounded-2xl border border-bu-purple/10 flex gap-4">
              <Info className="w-6 h-6 text-bu-purple shrink-0" />
              <div className="space-y-2">
                <p className="font-bold text-bu-purple">คำแนะนำสำหรับ {currentModule.title}</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {memoType === MemoType.PUBLICATION_REWARD 
                    ? 'สิทธิประโยชน์นี้จัดขึ้นเพื่อเป็นขวัญและกำลังใจให้กับอาจารย์และนักวิจัยที่ตีพิมพ์ผลงานในวารสารระดับคุณภาพ ตรวจสอบเกณฑ์การจ่ายได้ในขั้นตอนถัดไป' 
                    : 'โปรดเตรียมเอกสารที่เกี่ยวข้อง (เช่น บทความวิจัยเวอร์ชันตีพิมพ์, จดหมายตอบรับ) ในโฟลเดอร์ Google Drive'}
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {memoType === MemoType.PUBLICATION_REWARD && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">ชื่อผลงาน (ภาษาอังกฤษ)</label>
                  <input 
                    type="text" 
                    placeholder="Enter article title..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-purple/20 focus:border-bu-purple"
                    onChange={(e) => setPubData({...pubData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ชื่อวารสาร</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-purple/20 focus:border-bu-purple"
                    onChange={(e) => setPubData({...pubData, journalName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ระดับฐานข้อมูล (Indexing)</label>
                  <select 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-purple/20 focus:border-bu-purple"
                    onChange={(e) => setPubData({...pubData, indexing: e.target.value as any})}
                  >
                    <option value="Scopus-Q1">Scopus Q1</option>
                    <option value="Scopus-Q2">Scopus Q2</option>
                    <option value="TCI-1">TCI ฐาน 1</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <Award className="w-5 h-5 text-amber-600" />
                  <p className="text-sm font-bold text-amber-800">
                    ประมาณการเงินรางวัล: <span className="text-lg">{calculatedReward.toLocaleString()} ฿</span>
                  </p>
                </div>
              </div>
            )}

            {memoType === MemoType.TIME_EXEMPTION && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ชื่อสำนักพิมพ์</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Elsevier, Wiley, MDPI..."
                    className={cn(
                      "w-full p-3 border rounded-xl focus:ring-2 focus:ring-bu-purple/20 focus:border-bu-purple",
                      isPublisherBlacklisted ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white"
                    )}
                    onChange={(e) => setTimeData({...timeData, publisherName: e.target.value})}
                  />
                  {isPublisherBlacklisted && (
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-bold pt-1">
                      <AlertTriangle className="w-4 h-4" />
                      สำนักพิมพ์นี้อยู่ในกลุ่มต้องห้าม ไม่สามารถใช้สิทธิขอยกเว้นได้
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">บทบาทผู้ประพันธ์</label>
                  <div className="flex gap-4">
                    {['First', 'Corresponding', 'Other'].map(role => (
                      <button
                        key={role}
                        onClick={() => setTimeData({...timeData, authorRole: role as any})}
                        className={cn(
                          "flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all",
                          timeData.authorRole === role 
                            ? "border-bu-purple bg-bu-purple/5 text-bu-purple" 
                            : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                        )}
                      >
                        {role === 'First' ? 'ชื่อแรก' : role === 'Corresponding' ? 'ผู้ประสานงาน' : 'อื่นๆ'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {memoType === MemoType.CONFERENCE_SUPPORT && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">ชื่อโครงการประชุมวิชาการ (Conference Name)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-purple/20 focus:border-bu-purple"
                    onChange={(e) => setConfData({...confData, conferenceName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ครั้งที่ขอสิทธิ</label>
                  <select 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-purple/20 focus:border-bu-purple"
                    onChange={(e) => setConfData({...confData, occurence: e.target.value as any})}
                  >
                    <option value="1st">ครั้งที่ 1 (ของปีงบประมาณ)</option>
                    <option value="2nd">ครั้งที่ 2 (ต้องอยู่ใน Scopus/SJR)</option>
                  </select>
                </div>
                {confData.occurence === '2nd' && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl md:col-span-2">
                    <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      <strong>หมายเหตุสำหรับครั้งที่ 2:</strong> ผลงานสําหรับการประชุมครั้งที่ 2 จะต้องมีหลักฐานว่า Papers ใน Proceedings นั้นๆ จะได้รับการจัดทำเป็น Index ใน Scopus หรือ SJR ระดับ Q1-Q3 เท่านั้น
                    </p>
                  </div>
                )}
              </div>
            )}

            {memoType === MemoType.PAGE_CHARGE && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700">ชื่อผลงาน</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-purple/20 focus:border-bu-purple"
                    onChange={(e) => setPageData({...pageData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">จำนวนเงินที่ขออนุมัติเบิกจ่าย (THB)</label>
                  <input 
                    type="number" 
                    placeholder="ระบุตัวเลข..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-bu-purple/20 focus:border-bu-purple font-mono"
                    onChange={(e) => setPageData({...pageData, amountRequested: Number(e.target.value)})}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ExternalLink className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold">แนบหลักฐาน Google Drive</h4>
              <p className="text-sm text-slate-500">โปรดแชร์ลิงก์โฟลเดอร์ที่คุณรวบรวมไฟล์หลักฐานทั้งหมดเอาไว้</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Link โฟลเดอร์งานวิจัย</label>
              <input 
                type="url" 
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-bu-purple/10 focus:border-bu-purple transition-all font-mono text-sm"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
              />
            </div>

            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-800 space-y-1">
                <p className="font-bold uppercase tracking-wider">ข้อควรระวังเรื่องสิทธิ์การเข้าถึง</p>
                <p>โปรดตั้งค่าการแชร์ให้เป็น "Anyone with the link can view" หรือ "ทุกคนที่มีลิงก์สามารถดูได้" เพื่อให้เจ้าหน้าที่สามารถเปิดตรวจสอบเอกสารได้ทันที</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={step === 1 ? onCancel : () => setStep(s => s - 1)}
          className="flex items-center gap-2 px-6 py-2.5 text-slate-500 font-bold hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? 'ยกเลิก' : 'ย้อนกลับ'}
        </button>

        <button
          disabled={step === 2 && memoType === MemoType.TIME_EXEMPTION && isPublisherBlacklisted}
          onClick={() => {
            if (step < 3) setStep(s => s + 1);
            else handleFinalSubmit();
          }}
          className={cn(
            "flex items-center gap-2 px-8 py-3 bg-bu-purple text-white rounded-xl font-bold shadow-lg shadow-bu-purple/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
            step === 3 && "bg-emerald-600 shadow-emerald-500/20"
          )}
        >
          {step < 3 ? 'ถัดไป' : 'ส่งคำขอ'}
          {step < 3 ? <ArrowRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
