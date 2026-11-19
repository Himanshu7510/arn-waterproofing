import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { ToastProvider } from '@/components/admin/Toast';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function PanelLayout({ children }) {
  const admin = await getSession();
  if (!admin) redirect('/admin/login');
  const sql = await db();
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM enquiries WHERE status = 'new'`;
  return (
    <ToastProvider>
      <div className="a-shell">
        <Sidebar admin={admin} newCount={n} />
        <main className="a-main">{children}</main>
      </div>
    </ToastProvider>
  );
}
