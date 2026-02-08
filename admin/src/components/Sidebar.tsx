import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

interface SidebarProps {
  items?: Array<{
    label: string;
    icon?: string;
    path?: string;
    onClick?: () => void;
  }>;
}

const Sidebar: FC<SidebarProps> = ({ items = [] }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const defaultItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Users', path: '/users' },
    { label: 'Settings', path: '/settings' },
  ];

  const menuItems = items.length > 0 ? items : defaultItems;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 flex items-center border-b border-[#0f2336]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6a4ef0] to-[#7c5cff] flex items-center justify-center shadow-md logo-spin">
            <span className="font-bold">A</span>
          </div>
          <div>
            <div className="text-lg font-semibold">HORIZON</div>
            <div className="text-xs text-[var(--muted)]">ADMIN</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path ? navigate(item.path) : item.onClick?.()}
            className="block w-full text-left px-4 py-3 rounded-xl hover:bg-[#071c33] transition mb-2 text-sm text-[var(--muted)] flex items-center gap-3"
          >
            <span className="w-6 text-center">•</span>
            <span className="flex-1">{item.label}</span>
            <span className="text-xs text-[var(--muted)]">›</span>
          </button>
        ))}
      </nav>

      <div className="p-4">
        <div className="sidebar-upgrade bg-gradient-to-br from-[#6a4ef0] to-[#7c5cff] shadow-lg flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2v6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 8l6 6 6-6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold">Upgrade to PRO</div>
            <div className="text-xs text-white/80">Unlock all features</div>
          </div>
        </div>

        <div className="mt-4 border-t border-[#0f2336] pt-4">
          <div className="text-xs text-[var(--muted)]">Signed in as</div>
          <div className="font-medium truncate">{user?.username || '—'}</div>
          <button onClick={handleLogout} className="mt-3 w-full px-3 py-2 bg-[#101827] hover:bg-[#132133] rounded-lg text-sm">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
