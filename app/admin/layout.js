import './admin.css';

export const metadata = { title: { default: 'Admin Panel', template: '%s · Admin' }, robots: { index: false, follow: false } };

export default function AdminRoot({ children }) {
  return <div className="admin-root">{children}</div>;
}
