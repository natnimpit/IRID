import { Award, CalendarDays, FileBadge, CreditCard, ChevronRight } from 'lucide-react';
import { MemoType } from '../types';
import { cn } from '../lib/utils';

const MODULES = [
  {
    id: MemoType.PUBLICATION_REWARD,
    title: 'รางวัลการตีพิมพ์',
    description: 'บันทึกเสนอเพื่อขออนุมัติค่าตอบแทนเป็นรางวัลในการตีพิมพ์ผลงานวิจัย',
    memo: '1-memo',
    icon: Award,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    accent: 'border-amber-400',
    details: ['คํานวณตามระดับ TCI/Scopus', 'โบนัส Impact Factor', 'ภายใน 4 เดือนหลังตีพิมพ์']
  },
  {
    id: MemoType.TIME_EXEMPTION,
    title: 'การยกเว้นบันทึกเวลา',
    description: 'บันทึกเสนอเพื่อขอยกเว้นการบันทึกเวลาปฏิบัติงาน (Work from Anywhere)',
    memo: '2-memo',
    icon: CalendarDays,
    color: 'bg-sky-50 text-sky-600 border-sky-100',
    accent: 'border-sky-400',
    details: ['เช็คสำนักพิมพ์ต้องห้าม', 'บทบาท First/Corresponding', 'สิทธิประโยชน์ตามระดับวารสาร']
  },
  {
    id: MemoType.CONFERENCE_SUPPORT,
    title: 'งบสนับสนุน Conference',
    description: 'บันทึกเสนอเพื่อขออนุมัติงสนับสนุนการไปนำเสนอผลงานวิจัย',
    memo: '3-memo',
    icon: FileBadge,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    accent: 'border-emerald-400',
    details: ['สนับสนุนค่าลงทะเบียน/ที่พัก', 'เช็คประวัติการไปครั้งที่ 1/2', 'เกณฑ์ Scopus/SJR']
  },
  {
    id: MemoType.PAGE_CHARGE,
    title: 'ค่า Page Charge',
    description: 'บันทึกเสนอเพื่อขออนุมัติเบิกจ่ายค่า Page Charge / APC',
    memo: '7-memo',
    icon: CreditCard,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    accent: 'border-purple-400',
    details: ['เบิกตามจริงในวารสารระดับสากล', 'ขออนุมัติก่อนดําเนินการ', 'ตรวจสอบความคุ้มค่า']
  },
];

interface ModuleSelectorProps {
  onSelect: (memo: MemoType) => void;
}

export default function ModuleSelector({ onSelect }: ModuleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {MODULES.map((module) => (
        <button
          key={module.id}
          onClick={() => onSelect(module.id)}
          className={cn(
            "group relative flex flex-col p-6 rounded-2xl border-2 bg-white text-left transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]",
            module.color
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={cn("p-3 rounded-xl", module.color, "bg-white border")}>
              <module.icon className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-1 bg-white border rounded opacity-70">
              {module.memo}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 group-hover:text-bu-purple transition-colors mb-2">
            {module.title}
          </h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            {module.description}
          </p>

          <div className="space-y-2">
            {module.details.map((detail, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-white/50 px-2 py-1 rounded">
                <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                {detail}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end text-bu-purple text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            เริ่มทำรายการ
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </button>
      ))}
    </div>
  );
}
