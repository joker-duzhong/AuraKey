import { FC } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: FC<HeaderProps> = ({ title = 'Dashboard', subtitle }) => {
  return (
    <div className="px-6 py-3 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {subtitle && <p className="text-xs text-[var(--muted)] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            placeholder="Search"
            className="bg-[#071827] border border-[#102433] px-3 py-2 rounded-lg text-sm w-64 text-[var(--muted)] focus:outline-none"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)]">⌕</div>
        </div>

        <button className="p-2 rounded-md bg-transparent hover:bg-[#071a2b]">
          🔔
        </button>
        <button className="p-2 rounded-md bg-transparent hover:bg-[#071a2b]">
          ⚙️
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6a4ef0] to-[#7c5cff] flex items-center justify-center text-sm">JD</div>
      </div>
    </div>
  );
};

export default Header;
