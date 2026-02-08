import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children, sidebar, header }) => {
  return (
    <div className="flex h-screen text-white">
      {sidebar && (
        <aside className="w-72 min-h-screen bg-[#071227] border-r border-[#0f2336] flex-shrink-0">
          {sidebar}
        </aside>
      )}

      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        {header && (
          <header className="glass border-b border-[#121827]">
            {header}
          </header>
        )}

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
