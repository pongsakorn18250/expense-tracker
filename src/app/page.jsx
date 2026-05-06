"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import SummaryCard from '@/components/SummaryCard';
import { Wallet, CreditCard, PieChart as PieChartIcon, Loader2 , Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌟 1. เพิ่ม State สำหรับเก็บช่วงเวลา (เริ่มต้น - สิ้นสุด)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data } = await supabase.from('expenses').select('*');
      if (data) setExpenses(data);
      setLoading(false);
    };
    fetchExpenses();
  }, []);

  // 🌟 2. ลอจิกกรองข้อมูล (Filter) ตามช่วงเวลาที่เลือก
  const filteredExpenses = expenses.filter((item) => {
    if (!startDate && !endDate) return true; // ถ้าไม่เลือกวันที่เลย ให้โชว์ทั้งหมด
    
    const expenseDate = new Date(item.expense_date);
    // เซ็ตเวลาเริ่มต้นเป็น 00:00:00 และเวลาสิ้นสุดเป็น 23:59:59
    const start = startDate ? new Date(`${startDate}T00:00:00`) : new Date('2000-01-01');
    const end = endDate ? new Date(`${endDate}T23:59:59`) : new Date('2100-01-01');
    
    return expenseDate >= start && expenseDate <= end;
  });

  // 🧠 3. เปลี่ยนมาใช้ filteredExpenses ในการคำนวณแทน expenses ตัวเต็ม
  const totalAmount = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  
  const categoryTotals = filteredExpenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});
  
  const topCategory = Object.keys(categoryTotals).length > 0 
    ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b) 
    : 'ไม่มีข้อมูล';

  const pieData = Object.keys(categoryTotals).map(key => ({
    name: key,
    value: categoryTotals[key]
  }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

  // 📊 เตรียมข้อมูลสำหรับกราฟแท่ง (Bar Chart - รวมยอดตามวัน และเรียงวันที่ให้ถูกต้อง)
  const dailyTotals = filteredExpenses.reduce((acc, item) => {
    // ใช้รูปแบบ YYYY-MM-DD เป็น Key ไว้ก่อน เพื่อให้คอมพิวเตอร์เรียงลำดับง่าย
    const dateKey = item.expense_date; 
    acc[dateKey] = (acc[dateKey] || 0) + item.amount;
    return acc;
  }, {});
  
  const barData = Object.keys(dailyTotals)
    .sort((a, b) => new Date(a) - new Date(b)) // 🌟 พระเอกอยู่ตรงนี้ สั่งเรียงจากวันที่เก่าไปใหม่
    .map(dateKey => ({
      date: new Date(dateKey).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }), // ค่อยมาแปลงเป็นภาษาไทยตอนจบ
      amount: dailyTotals[dateKey]
    }));

  // 🌟 4. ฟังก์ชันเคลียร์ตัวกรอง (ล้างค่าวันที่)
  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-2" />
        กำลังโหลดข้อมูล Dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* ส่วนหัว และ กล่อง Filter */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">ภาพรวมบัญชี</h2>
          <p className="text-slate-500 text-sm mt-1">สรุปข้อมูลค่าใช้จ่ายทั้งหมดของคุณ</p>
        </div>
        
       {/* 🌟 5. UI สำหรับเลือกช่วงเวลา (ฉบับอัปเกรด Pro UI) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto">
          
          {/* กล่องเลือกวันที่แบบ Input Group */}
          <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm text-sm overflow-hidden w-full sm:w-auto focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            
            {/* ส่วนหัวไอคอน */}
            <div className="flex items-center px-3 py-2.5 border-r border-slate-200 bg-slate-50 text-slate-600">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium hidden sm:inline">ช่วงเวลา</span>
            </div>
            
            {/* ช่องกรอกวันที่ เริ่มต้น-สิ้นสุด */}
            <div className="flex items-center px-3 py-1 bg-white w-full sm:w-auto">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="outline-none text-slate-700 bg-transparent cursor-pointer w-full sm:w-[120px]"
              />
              <span className="mx-2 text-slate-300">-</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="outline-none text-slate-700 bg-transparent cursor-pointer w-full sm:w-[120px]"
              />
            </div>
          </div>
          
          {/* ปุ่มล้างตัวกรอง ปรับให้อยู่ในปุ่ม Hover สวยๆ */}
          {(startDate || endDate) && (
            <button 
              onClick={clearFilter}
              className="text-sm px-3 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition w-full sm:w-auto text-center font-medium"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {/* กล่อง Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="รายจ่ายรวมทั้งหมด" 
          amount={totalAmount} 
          icon={Wallet} 
        />
        <SummaryCard 
          title="หมวดหมู่ที่จ่ายหนักสุด" 
          amount={categoryTotals[topCategory] || 0} 
          trendValue={topCategory}
          icon={PieChartIcon} 
        />
        <SummaryCard 
          title="ค่าเฉลี่ยต่อรายการ" 
          amount={filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0} 
          icon={CreditCard} 
        />
      </div>

      {/* กราฟ Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* กราฟวงกลม */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-700 mb-4">สัดส่วนค่าใช้จ่ายตามหมวดหมู่</h3>
          {filteredExpenses.length === 0 ? (
            <div className="h-72 w-full flex items-center justify-center text-slate-400">ไม่พบข้อมูลในช่องเวลานี้</div>
          ) : (
            <>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value) => `฿${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-sm text-slate-600">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* กราฟแท่ง */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-700 mb-4">แนวโน้มค่าใช้จ่ายรายวัน</h3>
          {filteredExpenses.length === 0 ? (
            <div className="h-72 w-full flex items-center justify-center text-slate-400">ไม่พบข้อมูลในช่องเวลานี้</div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => [`฿${value.toLocaleString()}`, 'ยอดจ่าย']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}