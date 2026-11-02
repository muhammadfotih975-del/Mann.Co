import React from 'react';
import { Shield, Utensils, Database, Terminal } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2B2625] text-[#EFE7D3] border-t-4 border-[#2B2625]">
      {/* Hazard Caution Bar */}
      <div className="h-2 hazard-stripes w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Info (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#B8383B] border-2 border-[#EFE7D3] flex items-center justify-center text-[#EFE7D3] shadow-ink-sm chamfer-tr">
                <Utensils className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="font-anton text-2xl uppercase tracking-wider text-[#EFE7D3]">
                  MANN CO. MESS HALL
                </div>
                <div className="font-mono-code text-[11px] text-[#E5A823] tracking-widest uppercase font-bold">
                  TACTICAL SUPPLY & COMBAT SUBSISTENCE
                </div>
              </div>
            </div>

            <p className="font-sans text-xs text-[#E1D5B8] max-w-md leading-relaxed">
              We sell products and deliver battlefield nutrition. If you do not like our rations, Saxton Hale will personally arrive via rocket to challenge you to fist combat.
            </p>

            <div className="inline-flex items-center gap-2 p-2 bg-[#1f1b1a] border border-[#584140] font-mono-code text-[11px] text-[#E5A823]">
              <Database className="w-4 h-4 text-[#B8383B]" />
              <span>PERSISTENCE: Real-time SQLite Engine active. Forum data saved to SQL.</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-anton text-base uppercase tracking-wider text-[#E5A823] border-b border-[#584140] pb-1 mb-2">
              QUICK SECTORS
            </div>
            <ul className="space-y-1.5 font-mono-code text-xs text-[#E1D5B8]">
              <li>
                <a href="#rations" className="hover:text-[#B8383B] transition-colors">
                  • Rations Catalog
                </a>
              </li>
              <li>
                <a href="#forum" className="hover:text-[#B8383B] transition-colors">
                  • Requisition Forum
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-[#B8383B] transition-colors">
                  • Mess Timetable
                </a>
              </li>
            </ul>
          </div>

          {/* Admin Terminal Access (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-anton text-base uppercase tracking-wider text-[#B8383B] border-b border-[#584140] pb-1 mb-2">
              ADMINISTRATIVE ACCESS
            </div>
            <p className="font-sans text-xs text-[#E1D5B8]">
              Admin boshqaruv sahifasiga o'tish uchun:
            </p>
            <div className="font-mono-code text-xs bg-[#1f1b1a] p-2 border border-[#584140] text-[#EFE7D3]">
              <div>URL: <span className="text-[#E5A823] font-bold">/admin</span></div>
              <div>Login: <span className="text-white font-bold">admin</span></div>
              <div>Parol: <span className="text-white font-bold">admin</span></div>
            </div>

            <button
              onClick={() => onNavigate('/admin')}
              className="w-full py-2 bg-[#B8383B] hover:bg-[#7C2528] text-[#EFE7D3] font-anton text-xs uppercase tracking-wider border border-[#EFE7D3] shadow-ink-sm flex items-center justify-center gap-1.5 btn-press transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-[#E5A823]" />
              <span>Open Admin Panel (/admin)</span>
            </button>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="mt-8 pt-4 border-t border-[#584140] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono-code text-[11px] text-[#8c716f]">
          <div>
            © 1968 MANN CO. RATIONS DIVISION · ALL RIGHTS RESERVED · TF INDUSTRIES
          </div>
          <div className="flex items-center gap-3">
            <span>CLASSIFIED DOCUMENT #MC-402</span>
            <span>·</span>
            <span>RESTOCK INTERVAL: 30s</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
