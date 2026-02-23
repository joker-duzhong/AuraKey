import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Database, Users, Palette, Menu, Search, Bell, HelpCircle, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { title: "主要功能", path: "/", icon: <LayoutDashboard size={20} /> },
    { title: "提示词库", path: "/categories", icon: <Database size={20} /> },
    { title: "艺术家", path: "/artists", icon: <Users size={20} /> },
    { title: "MJ风格码", path: "/srefs", icon: <Palette size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          {isSidebarOpen && <span className="ml-3 font-bold text-xl tracking-tight">AuraKey</span>}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2.5 rounded-xl transition-all ${location.pathname === item.path ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="ml-3 truncate">{item.title}</span>}
              {isSidebarOpen && location.pathname === item.path && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3">退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <span className="text-gray-400 mr-2">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="搜索内容..."
                className="bg-transparent border-none outline-none text-sm w-48 focus:w-64 transition-all"
              />
            </div>

            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <HelpCircle size={20} />
            </button>

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-9 h-9 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <span className="text-xs font-bold uppercase">{user?.username?.[0] || "A"}</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold">{user?.username || "管理员"}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">{user?.role || "Admin"}</div>
              </div>
              <ChevronDown
                size={14}
                className="text-gray-400"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
