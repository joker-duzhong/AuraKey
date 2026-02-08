import React from 'react';
import SvgIcon from '../ui/SvgIcon';
import { svgIconMessage } from '../../assets/svgs';
import { Sparkles, Image as ImageIcon, Folder } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-[#1e202b]/90 backdrop-blur-xl border border-white/5 w-12 py-4 rounded-2xl flex flex-col items-center space-y-4 shadow-2xl">
        <SidebarLink 
          to="/"
          icon={<SvgIcon svgContent={svgIconMessage} size={20} />} 
        />
        <SidebarLink 
          to="/sparkles"
          icon={<Sparkles className="w-5 h-5" />} 
        />
        <SidebarLink 
          to="/gallery"
          icon={<ImageIcon className="w-5 h-5" />} 
        />
        <SidebarLink 
          to="/folder"
          icon={<Folder className="w-5 h-5" />} 
        />
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon }: { to: string; icon: React.ReactNode }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `
      w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200 group relative
      ${isActive 
        ? 'bg-[#3b82f6] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
        : 'text-gray-500 hover:text-white hover:bg-white/5'}
    `}
  >
    {icon}
  </NavLink>
);

export default Sidebar;
