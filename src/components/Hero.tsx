import React from 'react';
import { Database, Utensils, ShieldAlert, Award, FileText, ChevronRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (path: string) => void;
  requisitionCount: number;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, requisitionCount }) => {
  return (
    <section className="relative overflow-hidden bg-[#E1D5B8] border-b-3 border-[#2B2625] py-12 md:py-16">
      {/* Halftone Dot Screen Background Overlay */}
      <div className="absolute inset-0 opacity-10 halftone-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Copy (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Classification Stamp */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2B2625] text-[#E5A823] font-mono-code text-xs font-bold uppercase tracking-widest border border-[#2B2625] shadow-ink-sm chamfer-tr">
              <ShieldAlert className="w-4 h-4 text-[#E5A823]" />
              <span>OFFICIAL MANN CO. RATIONS DISPATCH & LOGISTICS</span>
            </div>

            <h1 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-[#2B2625] uppercase tracking-wide leading-[0.95] drop-shadow-[2px_2px_0px_#B8383B]">
              NO MERCENARY FIGHTS ON AN EMPTY STOMACH!
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#584140] font-medium max-w-2xl leading-relaxed">
              Serving the finest irradiated cold cuts, raw buffalo flesh slabs, and tactical confectionery across Badlands, Dustbowl, and 2Fort. Every battlefield ration requested by mercenaries is recorded directly in our persistent <strong className="text-[#B8383B] font-bold">SQL database ledger</strong> for Quartermaster dispatch.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#forum"
                className="px-6 py-3.5 bg-[#B8383B] hover:bg-[#7C2528] text-[#EFE7D3] font-anton text-lg tracking-wider uppercase border-3 border-[#2B2625] shadow-ink chamfer-tr flex items-center gap-2 btn-press transition-transform"
              >
                <Utensils className="w-5 h-5" />
                <span>Fill Forum Requisition</span>
              </a>

              <button
                onClick={() => onNavigate('/admin')}
                className="px-5 py-3.5 bg-[#5885A2] hover:bg-[#2B3D4F] text-[#EFE7D3] font-anton text-lg tracking-wider uppercase border-3 border-[#2B2625] shadow-ink flex items-center gap-2 btn-press transition-transform"
              >
                <Database className="w-5 h-5 text-[#E5A823]" />
                <span>Admin Terminal (/admin)</span>
              </button>
            </div>

            {/* SQL Verification Banner */}
            <div className="p-3.5 bg-[#EFE7D3] border-2 border-[#2B2625] shadow-ink-sm flex items-start sm:items-center gap-3">
              <div className="p-2 bg-[#E5A823] text-[#2B2625] border border-[#2B2625] shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono-code text-[#2B2625]">
                <span className="font-bold uppercase text-[#B8383B]">SQL Data Engine Active: </span>
                User form submissions persist in real-time SQLite database (<code className="bg-[#D1C2A5] px-1 py-0.5 border border-[#2B2625]">requisitions</code> table). Live records loaded: <span className="font-bold underline">{requisitionCount} tactical dispatches</span>.
              </div>
            </div>
          </div>

          {/* Side Graphic / Dossier Card (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-[#EFE7D3] border-3 border-[#2B2625] p-5 shadow-ink-lg relative">
              {/* Corner Screws / Rivets */}
              <div className="absolute top-2 left-2 w-2.5 h-2.5 border border-[#2B2625] bg-[#D1C2A5] rounded-full flex items-center justify-center text-[7px] font-mono leading-none">×</div>
              <div className="absolute top-2 right-2 w-2.5 h-2.5 border border-[#2B2625] bg-[#D1C2A5] rounded-full flex items-center justify-center text-[7px] font-mono leading-none">×</div>
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border border-[#2B2625] bg-[#D1C2A5] rounded-full flex items-center justify-center text-[7px] font-mono leading-none">×</div>
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border border-[#2B2625] bg-[#D1C2A5] rounded-full flex items-center justify-center text-[7px] font-mono leading-none">×</div>

              <div className="border-b-2 border-[#2B2625] pb-2 mb-4 flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold uppercase text-[#B8383B] tracking-wider">
                  CLASSIFIED DOSSIER #88
                </span>
                <span className="text-[10px] font-mono-code px-1.5 py-0.5 bg-[#E5A823] border border-[#2B2625] font-bold">
                  SAXTON APPROVED
                </span>
              </div>

              <div className="space-y-3 font-sans text-xs text-[#2B2625]">
                <div className="font-anton text-2xl uppercase tracking-wide text-[#2B2625] leading-tight">
                  HEAVY'S COMBAT CULINARY DIRECTIVE
                </div>
                <blockquote className="italic border-l-3 border-[#B8383B] pl-3 py-1 font-medium bg-[#E1D5B8] text-[#1f1b1a]">
                  "Some mercenaries think they can outsmart me. Maybe, maybe. I have yet to meet one that can outsmart Sandvich."
                </blockquote>

                <div className="pt-2 border-t border-[#2B2625]/20 space-y-2 font-mono-code text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#584140]">ADMIN PASSCODE:</span>
                    <span className="font-bold bg-[#D1C2A5] px-1.5 border border-[#2B2625]">admin / admin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#584140]">URL ROUTE:</span>
                    <span className="font-bold text-[#B8383B]">/admin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#584140]">STORAGE ENGINE:</span>
                    <span className="font-bold text-[#35637f]">SQLite C-Engine</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-[#2B2625]">
                <button
                  onClick={() => onNavigate('/admin')}
                  className="w-full py-2 bg-[#2B2625] hover:bg-[#B8383B] text-[#EFE7D3] font-anton text-sm uppercase tracking-wider border-2 border-[#2B2625] shadow-ink-sm flex items-center justify-center gap-1.5 btn-press transition-colors"
                >
                  <span>Open Admin Gate</span>
                  <ChevronRight className="w-4 h-4 text-[#E5A823]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
