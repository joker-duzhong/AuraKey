import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Diamond, User as UserIcon } from 'lucide-react';
import logoText from '../../assets/logo-text.png';

const Navbar: React.FC = () => {
  const { user, login, isAuthenticated } = useAuth();

  return (
    <nav className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-background sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <div className="flex items-center gap-2">
           <img src={logoText} alt="AuraKey Logo" className="h-8" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-400 text-sm hover:text-white flex items-center gap-1">
          最新词条
          <span className="text-[10px]">▼</span>
        </button>

        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-blue-900/30 border border-blue-800/50 px-3 py-1.5 rounded-full">
              <Diamond className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-100">{user?.points}</span>
            </div>
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-gray-700 bg-gray-800 cursor-pointer"
            />
          </div>
        ) : (
          <button 
            onClick={login}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm transition-all"
          >
            <UserIcon className="w-4 h-4" />
            <span>登录</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
