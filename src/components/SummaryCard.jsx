import { TrendingUp, TrendingDown } from 'lucide-react';

export default function SummaryCard({ title, amount, trend, trendValue, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
      {/* หัวข้อและไอคอน */}
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-sm font-medium">{title}</span>
        {Icon && <Icon className="w-5 h-5 text-blue-500" />}
      </div>
      
     {/* ตัวเลขจำนวนเงิน */}
      <div className="text-2xl md:text-3xl font-bold text-slate-800">
       
        ฿{amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      {/* ตัวบอกแนวโน้ม (ขึ้น/ลง) */}
      {trend && (
        <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-red-500' : 'text-emerald-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-medium">{trendValue}</span>
          <span className="text-slate-400 ml-1">เทียบกับเดือนที่แล้ว</span>
        </div>
      )}
    </div>
  );
}