"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Loader2 } from 'lucide-react';

export default function AddExpenseModal({ isOpen, onClose, onSuccess }) {
  // State สำหรับเก็บค่าในฟอร์ม
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('อาหารและเครื่องดื่ม');
  // ตั้งค่าเริ่มต้นวันที่เป็นวันปัจจุบัน
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ถ้า Modal ไม่ได้ถูกสั่งให้เปิด ก็ไม่ต้องแสดงผล (return null)
  if (!isOpen) return null;

  // ฟังก์ชันตอนกดปุ่ม "บันทึก"
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช
    setIsSubmitting(true);

    // ส่งข้อมูลเข้า Supabase
    const { error } = await supabase
      .from('expenses')
      .insert([
        {
          title: title,
          amount: parseFloat(amount),
          category: category,
          expense_date: expenseDate,
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
    } else {
      // ถ้าสำเร็จ: ล้างค่าในฟอร์ม -> รีเฟรชตาราง -> ปิดป๊อปอัป
      setTitle('');
      setAmount('');
      setCategory('อาหารและเครื่องดื่ม');
      setExpenseDate(new Date().toISOString().split('T')[0]);
      onSuccess(); // เรียกฟังก์ชัน fetchExpenses ที่ส่งมาจากหน้าหลัก
      onClose(); // ปิด Modal
    }
  };

  return (
    // พื้นหลังสีดำโปร่งใส
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 transition-opacity">
      {/* ตัวกล่องป๊อปอัป */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header ของ Modal */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">เพิ่มค่าใช้จ่ายใหม่</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* ฟอร์มกรอกข้อมูล */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียด (ชื่อรายการ)</label>
            <input 
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
              placeholder="เช่น กินชาบู, ค่าเน็ตมือถือ" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">จำนวนเงิน (บาท)</label>
            <input 
              type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
              placeholder="0.00" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">หมวดหมู่</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition bg-white"
            >
              <option value="อาหารและเครื่องดื่ม">อาหารและเครื่องดื่ม</option>
              <option value="การเดินทาง">การเดินทาง</option>
              <option value="เทคโนโลยี">เทคโนโลยี</option>
              <option value="การศึกษา">การศึกษา</option>
              <option value="บันเทิง">บันเทิง</option>
              <option value="ทั่วไป">ทั่วไป</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">วันที่</label>
            <input 
              type="date" required value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" 
            />
          </div>

          {/* ปุ่มกดยกเลิก/บันทึก */}
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium">
              ยกเลิก
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex justify-center items-center gap-2 disabled:bg-blue-400">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'บันทึกข้อมูล'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}