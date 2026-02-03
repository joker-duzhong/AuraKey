import React from 'react';
import { MessageSquare, Sparkles, Image as ImageIcon, Briefcase } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-16 border-r border-gray-800 flex flex-col items-center py-6 space-y-8 bg-background h-[calc(100vh-64px)] fixed left-0 top-16">
      <div className="flex flex-col space-y-4">
        <SidebarIcon icon={<MessageSquare className="w-5 h-5" />} active />
        <SidebarIcon icon={<Sparkles className="w-5 h-5" />} />
        <SidebarIcon icon={<ImageIcon className="w-5 h-5" />} />
        <SidebarIcon icon={<Briefcase className="w-5 h-5" />} />
      </div>
    </div>
  );
};

const SidebarIcon = ({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) => (
  <div className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group relative
    ${active ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}>
    {icon}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full" />}
  </div>
);

export default Sidebar;
