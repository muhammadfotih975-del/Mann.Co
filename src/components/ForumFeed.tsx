import React, { useState } from 'react';
import { Requisition } from '../types.ts';
import { Shield, ThumbsUp, MapPin, Clock, Search, Filter, AlertCircle, CheckCircle, Database } from 'lucide-react';

interface ForumFeedProps {
  requisitions: Requisition[];
  isLoading: boolean;
  onLike: (id: number) => void;
  onRefresh: () => void;
}

export const ForumFeed: React.FC<ForumFeedProps> = ({
  requisitions,
  isLoading,
  onLike,
  onRefresh,
}) => {
  const [factionFilter, setFactionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRequisitions = requisitions.filter((req) => {
    if (factionFilter !== 'ALL' && req.faction !== factionFilter) return false;
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        req.mercenary_name.toLowerCase().includes(q) ||
        req.message.toLowerCase().includes(q) ||
        req.frontline_sector.toLowerCase().includes(q) ||
        req.ration_item.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <section className="py-12 bg-[#EFE7D3] border-b-3 border-[#2B2625]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Controls */}
        <div className="border-b-3 border-[#2B2625] pb-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="font-mono-code text-xs font-bold uppercase text-[#B8383B] tracking-widest flex items-center gap-2">
                <Database className="w-3.5 h-3.5" />
                <span>LIVE SQL REQUISITION BOARD · TABLE: REQUISITIONS</span>
              </div>
              <h2 className="font-anton text-3xl sm:text-4xl text-[#2B2625] uppercase tracking-wide">
                FRONTLINE DISPATCH TELEGRAPH & FORUM
              </h2>
            </div>
            <div className="font-mono-code text-xs text-[#584140] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#2d6a4f] rounded-full inline-block animate-pulse" />
              <span>LIVE SQL STREAM: <strong>{requisitions.length}</strong> ENTRIES RECORDED</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#E1D5B8] p-3 border-2 border-[#2B2625] shadow-ink-sm">
            {/* Search */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-[#584140] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search soldier, sector, ration or text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#EFE7D3] border border-[#2B2625] font-mono-code text-xs text-[#2B2625] placeholder:text-[#8c716f] focus:outline-none"
              />
            </div>

            {/* Faction Filter */}
            <div className="sm:col-span-3 flex items-center gap-1">
              {(['ALL', 'RED', 'BLU'] as const).map((fac) => (
                <button
                  key={fac}
                  onClick={() => setFactionFilter(fac)}
                  className={`flex-1 py-1.5 text-xs font-mono-code font-bold uppercase border border-[#2B2625] transition-colors ${
                    factionFilter === fac
                      ? fac === 'RED'
                        ? 'bg-[#B8383B] text-[#EFE7D3]'
                        : fac === 'BLU'
                        ? 'bg-[#5885A2] text-[#EFE7D3]'
                        : 'bg-[#2B2625] text-[#EFE7D3]'
                      : 'bg-[#EFE7D3] text-[#2B2625] hover:bg-[#D1C2A5]'
                  }`}
                >
                  {fac}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 bg-[#EFE7D3] border border-[#2B2625] font-mono-code text-xs text-[#2B2625] focus:outline-none"
              >
                <option value="ALL">ALL STATUSES (BARCHA HOLATLAR)</option>
                <option value="PENDING">PENDING APPROVAL</option>
                <option value="APPROVED">APPROVED BY QUARTERMASTER</option>
                <option value="DISPATCHED">DISPATCHED TO FRONT</option>
                <option value="CONSUMED">CONSUMED IN COMBAT</option>
                <option value="DENIED">DENIED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="p-8 text-center bg-[#E1D5B8] border-2 border-[#2B2625] shadow-ink-sm font-mono-code">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[#B8383B] border-t-transparent mb-3" />
            <div className="font-bold text-sm text-[#2B2625] uppercase">
              QUERYING SQL DATABASE...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRequisitions.length === 0 && (
          <div className="p-12 text-center bg-[#E1D5B8] border-3 border-dashed border-[#2B2625] font-mono-code">
            <AlertCircle className="w-10 h-10 text-[#584140] mx-auto mb-3" />
            <div className="font-anton text-xl uppercase tracking-wider text-[#2B2625]">
              HECH QANDAY BUYURTMA TOPILMADI
            </div>
            <p className="text-xs text-[#584140] mt-1">
              Yuqoridagi formani to'ldirib, birinchi buyurtmani SQL bazasiga yozing!
            </p>
          </div>
        )}

        {/* Feed Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequisitions.map((req) => {
            const isRed = req.faction === 'RED';
            const isDefcon = req.priority === 'DEFCON 1';
            const isUrgent = req.priority === 'URGENT';

            return (
              <div
                key={req.id}
                className="bg-[#E1D5B8] border-3 border-[#2B2625] shadow-ink flex flex-col justify-between relative"
              >
                {/* Docket Header */}
                <div className="bg-[#D1C2A5] border-b-2 border-[#2B2625] p-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 font-mono-code font-bold text-xs uppercase border border-[#2B2625] ${
                        isRed
                          ? 'bg-[#B8383B] text-[#EFE7D3]'
                          : 'bg-[#5885A2] text-[#EFE7D3]'
                      }`}
                    >
                      {req.faction}
                    </span>
                    <span className="font-anton text-lg uppercase tracking-wide text-[#2B2625]">
                      {req.mercenary_name}
                    </span>
                    <span className="text-xs font-mono-code text-[#584140]">
                      ({req.mercenary_class})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 font-mono-code font-bold text-[10px] uppercase border border-[#2B2625] ${
                        isDefcon
                          ? 'bg-[#B8383B] text-[#EFE7D3] animate-pulse'
                          : isUrgent
                          ? 'bg-[#E5A823] text-[#2B2625]'
                          : 'bg-[#EFE7D3] text-[#2B2625]'
                      }`}
                    >
                      {req.priority}
                    </span>
                    <span className="font-mono-code text-[11px] font-bold text-[#584140]">
                      #{req.id}
                    </span>
                  </div>
                </div>

                {/* Docket Body */}
                <div className="p-4 flex-1 space-y-3">
                  {/* Order Spec */}
                  <div className="bg-[#EFE7D3] border-2 border-[#2B2625] p-2.5 shadow-ink-sm flex items-center justify-between">
                    <div>
                      <div className="font-mono-code text-[10px] text-[#584140] uppercase">
                        REQUISITION ITEM:
                      </div>
                      <div className="font-anton text-base uppercase text-[#B8383B] tracking-wider">
                        {req.ration_quantity}× {req.ration_item}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-code text-[10px] text-[#584140] uppercase flex items-center gap-1 justify-end">
                        <MapPin className="w-3 h-3 text-[#B8383B]" /> SECTOR:
                      </div>
                      <div className="font-mono-code text-xs font-bold text-[#2B2625]">
                        {req.frontline_sector}
                      </div>
                    </div>
                  </div>

                  {/* Mercenary's Message */}
                  <div className="font-sans text-xs text-[#2B2625] leading-relaxed bg-[#fff8f6] p-3 border border-[#2B2625] relative">
                    <div className="font-mono-code text-[9px] text-[#8c716f] uppercase mb-1">
                      TACTICAL DISPATCH TRANSMISSION:
                    </div>
                    "{req.message}"
                  </div>

                  {/* Admin Notes if provided */}
                  {req.admin_notes && (
                    <div className="p-2.5 bg-[#ffe1b0] border-2 border-[#865f00] text-[#674800] text-xs font-mono-code">
                      <span className="font-bold uppercase">QUARTERMASTER NOTE: </span>
                      {req.admin_notes}
                    </div>
                  )}

                  {/* Status Stamp */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code text-[10px] text-[#584140] uppercase">STATUS:</span>
                      <span
                        className={`px-2.5 py-0.5 font-mono-code font-bold text-xs uppercase border border-[#2B2625] ${
                          req.status === 'APPROVED'
                            ? 'bg-[#2d6a4f] text-[#EFE7D3]'
                            : req.status === 'DISPATCHED'
                            ? 'bg-[#5885A2] text-[#EFE7D3]'
                            : req.status === 'DENIED'
                            ? 'bg-[#ba1a1a] text-[#EFE7D3]'
                            : req.status === 'CONSUMED'
                            ? 'bg-[#2B2625] text-[#EFE7D3]'
                            : 'bg-[#E5A823] text-[#2B2625]'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="font-mono-code text-[10px] text-[#584140] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="bg-[#D1C2A5] border-t-2 border-[#2B2625] px-4 py-2 flex items-center justify-between">
                  <span className="font-mono-code text-[10px] text-[#584140]">
                    SQL RECORD ID: #{req.id}
                  </span>

                  <button
                    onClick={() => onLike(req.id)}
                    className="px-3 py-1 bg-[#EFE7D3] hover:bg-[#fff8f6] border border-[#2B2625] text-xs font-mono-code font-bold text-[#2B2625] flex items-center gap-1.5 shadow-ink-sm btn-press transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-[#B8383B]" />
                    <span>OORAH! ({req.likes_count})</span>
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
