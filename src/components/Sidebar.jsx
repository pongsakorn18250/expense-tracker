"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Plus, ChevronLeft, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleQuickAdd = () => {
    router.push('/transactions?new=true');
    setIsMobileOpen(false);
  };

  const navItems = [
    { name: 'หน้าหลัก', href: '/', icon: LayoutDashboard },
    { name: 'รายการธุรกรรม', href: '/transactions', icon: ReceiptText },
  ];

  return (
    <>
      {/* 📱 Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 shrink-0">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-bold text-slate-800">Expense Tracker</h1>
        </div>
        <button onClick={() => setIsMobileOpen(true)} className="p-2 -mr-2 bg-slate-50 rounded-md text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* 📱 Overlay สีดำ */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 💻 Sidebar หลัก */}
      <div 
        className={`fixed md:relative z-50 h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out md:flex-none
          ${isCollapsed ? 'md:w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* 🌟 1. คืนชีพโลโก้และชื่อแอป */}
        <div className="flex items-center justify-between p-4 mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <LayoutDashboard className="w-8 h-8 text-blue-600 shrink-0" />
            {!isCollapsed && <h1 className="text-xl font-bold text-slate-800 whitespace-nowrap">Expense Tracker</h1>}
          </div>
          <button className="md:hidden p-2 bg-slate-50 rounded-md text-slate-500" onClick={() => setIsMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 🌟 2. ซ่อนปุ่ม Quick Add ถ้ายืนอยู่บนหน้า Transactions */}
        {pathname !== '/transactions' && (
          <div className="px-4 mb-6 mt-2">
            <button 
              onClick={handleQuickAdd}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all shadow-sm ${isCollapsed ? 'px-0' : 'px-4'}`}
            >
              <Plus className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">เพิ่มรายการใหม่</span>}
            </button>
          </div>
        )}

        {/* เมนูนำทาง */}
        <nav className="flex flex-col gap-2 px-3 flex-1 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 py-2.5 rounded-lg transition-all
                  ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-100 font-medium'
                  }
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* ปุ่มพับ Sidebar */}
        <div className="p-4 border-t border-slate-200 hidden md:flex">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full py-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </>
  );
}