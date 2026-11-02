import React from 'react';
import { Shield, ShieldAlert, UtensilsCrossed, Terminal, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isAdminLoggedIn: boolean;
  selectedFaction: 'RED' | 'BLU';
  onToggleFaction: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  isAdminLoggedIn,
  selectedFaction,
  onToggleFaction,
}) => {
  const isAdminView = currentPath === '/admin';

  return (
    <header className="border-b-3 border-[#2B2625] bg-[#E1D5B8] sticky top-0 z-50 shadow-ink-sm">
      {/* Top Warning Strip */}
      <div className="h-1.5 hazard-stripes w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="text-left group flex items-center gap-3 focus:outline-none"
          >
            <div className="w-10 h-10 bg-[#B8383B] border-2 border-[#2B2625] flex items-center justify-center text-[#EFE7D3] shadow-ink-sm chamfer-tr">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-anton text-2xl tracking-wider text-[#2B2625] leading-none uppercase group-hover:text-[#B8383B] transition-colors">
                MANN CO. MESS HALL
              </div>
              <div className="font-mono-code text-[11px] text-[#584140] tracking-widest uppercase font-bold">
                DIVISION OF COMBAT RATIONS · DEPOT #402
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono-code text-xs font-bold uppercase tracking-wider text-[#2B2625]">
          <a
            href="#rations"
            onClick={(e) => {
              if (isAdminView) {
                e.preventDefault();
                onNavigate('/');
                setTimeout(() => {
                  document.getElementById('rations')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#B8383B] transition-colors pb-1 border-b-2 border-transparent hover:border-[#B8383B]"
          >
            Rations Catalog
          </a>
          <a
            href="#forum"
            onClick={(e) => {
              if (isAdminView) {
                e.preventDefault();
                onNavigate('/');
                setTimeout(() => {
                  document.getElementById('forum')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#B8383B] transition-colors pb-1 border-b-2 border-transparent hover:border-[#B8383B]"
          >
            Combat Forum & Requisitions
          </a>
          <a
            href="#schedule"
            onClick={(e) => {
              if (isAdminView) {
                e.preventDefault();
                onNavigate('/');
                setTimeout(() => {
                  document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#B8383B] transition-colors pb-1 border-b-2 border-transparent hover:border-[#B8383B]"
          >
            Mess Schedule
          </a>
        </nav>

        {/* Zone 3: Actions & Admin Gate Switch */}
        <div className="flex items-center gap-3">
          {/* Faction Switcher */}
          <button
            onClick={onToggleFaction}
            title="Switch Faction Alignment"
            className={`px-3 py-1.5 text-xs font-mono-code font-bold uppercase border-2 border-[#2B2625] shadow-ink-sm flex items-center gap-1.5 transition-all ${
              selectedFaction === 'RED'
                ? 'bg-[#B8383B] text-[#EFE7D3]'
                : 'bg-[#5885A2] text-[#EFE7D3]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 fill-current" />
            <span>{selectedFaction} TEAM</span>
          </button>

          {/* Admin Page Link */}
          {isAdminView ? (
            <button
              onClick={() => onNavigate('/')}
              className="px-3 py-1.5 bg-[#D1C2A5] hover:bg-[#EFE7D3] text-[#2B2625] text-xs font-anton tracking-wider uppercase border-2 border-[#2B2625] shadow-ink-sm flex items-center gap-1.5 transition-all btn-press"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Mess Hall</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/admin')}
              className="px-3.5 py-1.5 bg-[#2B2625] hover:bg-[#B8383B] text-[#EFE7D3] text-xs font-anton tracking-wider uppercase border-2 border-[#2B2625] shadow-ink-sm flex items-center gap-1.5 transition-all btn-press chamfer-tr"
            >
              <Terminal className="w-3.5 h-3.5 text-[#E5A823]" />
              <span>
                {isAdminLoggedIn ? 'ADMIN PANEL (/admin)' : 'ADMIN LOGIN (/admin)'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
