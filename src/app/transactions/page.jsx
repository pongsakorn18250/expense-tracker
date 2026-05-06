"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, ArrowUpDown, Search, Loader2 } from 'lucide-react';
import AddExpenseModal from '@/components/AddExpenseModal';

export default function TransactionsPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'expense_date', direction: 'desc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 🌟 1. เพิ่ม State สำหรับเก็บข้อความค้นหา
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExpenses();

    // 🌟 2. ลอจิกสำหรับ Quick Add: เช็กว่ามีคำสั่ง ?new=true ต่อท้าย URL ไหม
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === 'true') {
      setIsModalOpen(true); // สั่งเปิด Modal ทันที
      window.history.replaceState(null, '', '/transactions'); // ลบคำสั่งออกจาก URL เพื่อความคลีน
    }
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false });
    
    if (data) setExpenses(data);
    setLoading(false);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // 🌟 3. นำข้อมูลมา "ค้นหา (Filter)" ก่อน แล้วค่อยนำไป "เรียงลำดับ (Sort)"
  const processedExpenses = [...expenses]
    .filter((expense) => {
      // ค้นหาได้ทั้งจาก ชื่อรายการ หรือ หมวดหมู่
      const searchLower = searchTerm.toLowerCase();
      return expense.title.toLowerCase().includes(searchLower) || 
             expense.category.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">ธุรกรรม</h2>
          <p className="text-slate-500 text-sm mt-1">จัดการและตรวจสอบรายการทางการเงินของคุณ</p>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm w-full md:w-auto justify-center">
          <Plus className="w-5 h-5" />
          <span>เพิ่มค่าใช้จ่าย</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* 🌟 4. ผูก State เข้ากับช่อง Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อรายการ หรือ หมวดหมู่..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* ตารางข้อมูล */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('expense_date')}>
                  <div className="flex items-center gap-1">วันที่ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-4 font-medium cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-1">รายละเอียด <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-4 font-medium cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-1">หมวดหมู่ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-4 font-medium cursor-pointer hover:bg-slate-100 transition text-right" onClick={() => handleSort('amount')}>
                  <div className="flex items-center justify-end gap-1">จำนวนเงิน <ArrowUpDown className="w-3 h-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : processedExpenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    {searchTerm ? 'ไม่พบรายการที่ค้นหา' : 'ยังไม่มีรายการค่าใช้จ่าย'}
                  </td>
                </tr>
              ) : (
                processedExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-600">
                      {new Date(expense.expense_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 font-medium text-slate-800">{expense.title}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-800">
                      - ฿{expense.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchExpenses} />
    </div>
  );
}