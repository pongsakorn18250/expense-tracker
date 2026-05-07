import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Expense Tracker',
  description: 'แอปพลิเคชันบันทึกรายรับรายจ่าย',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      {/* เปลี่ยนโครงสร้าง: มือถือเรียงบนลงล่าง (flex-col) จอคอมเรียงซ้ายไปขวา (flex-row) */}
      <body className="flex flex-col md:flex-row h-screen bg-slate-50 text-slate-800 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}