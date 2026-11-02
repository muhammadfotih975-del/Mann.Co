import React from 'react';
import { RationItem } from '../types.ts';
import { Shield, Clock, Weight, PackageCheck, Zap, ArrowDown } from 'lucide-react';

interface RationsCatalogProps {
  items: RationItem[];
  onSelectRation: (rationName: string) => void;
  isLoading: boolean;
}

export const RationsCatalog: React.FC<RationsCatalogProps> = ({
  items,
  onSelectRation,
  isLoading,
}) => {
  return (
    <section id="rations" className="py-12 bg-[#EFE7D3] border-b-3 border-[#2B2625]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b-3 border-[#2B2625] pb-4">
          <div>
            <div className="font-mono-code text-xs font-bold uppercase text-[#B8383B] tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-[#B8383B] inline-block" />
              <span>CLASSIFIED ORDNANCE & EDIBLE MUNITIONS</span>
            </div>
            <h2 className="font-anton text-3xl sm:text-4xl text-[#2B2625] uppercase tracking-wide">
              STANDARD ISSUE BATTLEFIELD RATIONS
            </h2>
          </div>
          <p className="font-sans text-sm text-[#584140] max-w-md">
            All rations engineered and tested under live high-explosive conditions. Select an item to initiate a field requisition into our SQL system.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center bg-[#E1D5B8] border-2 border-[#2B2625] shadow-ink-sm font-mono-code">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[#B8383B] border-t-transparent mb-3" />
            <div className="font-bold text-sm text-[#2B2625] uppercase">
              DE-CRYPTING RATION INVENTORY FROM SQL LEDGER...
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isRed = item.faction_alignment === 'RED';
            const isBlu = item.faction_alignment === 'BLU';

            return (
              <div
                key={item.id}
                className="bg-[#E1D5B8] border-3 border-[#2B2625] shadow-ink flex flex-col justify-between relative group hover:-translate-y-1 transition-transform"
              >
                {/* Manila Top Tab Header */}
                <div className="bg-[#D1C2A5] border-b-2 border-[#2B2625] px-4 py-2 flex items-center justify-between font-mono-code text-xs">
                  <span className="font-bold tracking-wider text-[#2B2625]">
                    [{item.code}]
                  </span>
                  <span
                    className={`px-2 py-0.5 font-bold uppercase border border-[#2B2625] text-[10px] ${
                      isRed
                        ? 'bg-[#B8383B] text-[#EFE7D3]'
                        : isBlu
                        ? 'bg-[#5885A2] text-[#EFE7D3]'
                        : 'bg-[#E5A823] text-[#2B2625]'
                    }`}
                  >
                    {item.faction_alignment} ISSUE
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-anton text-2xl uppercase tracking-wide text-[#2B2625] leading-tight group-hover:text-[#B8383B] transition-colors">
                      {item.name}
                    </h3>
                    <div className="font-sans text-xs text-[#584140] font-semibold italic mt-0.5">
                      {item.tagline}
                    </div>

                    {/* Halftone / Highlighted Stat Ribbon */}
                    <div className="mt-3 p-2 bg-[#EFE7D3] border-2 border-[#2B2625] shadow-ink-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#B8383B] shrink-0 fill-current" />
                      <div className="font-anton text-sm tracking-wide uppercase text-[#B8383B] truncate">
                        {item.hp_restore}
                      </div>
                    </div>

                    <p className="mt-3 font-sans text-xs text-[#2B2625] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Technical Specs Strip */}
                  <div className="pt-3 border-t-2 border-[#2B2625]/20 font-mono-code text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between text-[#584140]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> RECHARGE:
                      </span>
                      <span className="font-bold text-[#2B2625]">{item.recharge_seconds} SECONDS</span>
                    </div>

                    <div className="flex items-center justify-between text-[#584140]">
                      <span className="flex items-center gap-1">
                        <Weight className="w-3.5 h-3.5" /> WEIGHT:
                      </span>
                      <span className="font-bold text-[#2B2625]">{item.weight_oz} OZ</span>
                    </div>

                    <div className="flex items-center justify-between text-[#584140]">
                      <span className="flex items-center gap-1">
                        <PackageCheck className="w-3.5 h-3.5" /> SQL STOCK:
                      </span>
                      <span className="font-bold text-[#2B2625] bg-[#EFE7D3] px-1.5 border border-[#2B2625]">
                        {item.stock_units} UNITS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="p-3 bg-[#D1C2A5] border-t-2 border-[#2B2625]">
                  <button
                    onClick={() => onSelectRation(item.name)}
                    className="w-full py-2.5 bg-[#B8383B] hover:bg-[#7C2528] text-[#EFE7D3] font-anton text-sm tracking-wider uppercase border-2 border-[#2B2625] shadow-ink-sm flex items-center justify-center gap-2 btn-press transition-all chamfer-tr"
                  >
                    <span>Request This Ration</span>
                    <ArrowDown className="w-4 h-4 text-[#E5A823]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
