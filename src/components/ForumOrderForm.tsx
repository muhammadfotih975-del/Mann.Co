import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertTriangle, Shield, Utensils, MessageSquare, Database } from 'lucide-react';
import { RationItem } from '../types.ts';

interface ForumOrderFormProps {
  rationItems: RationItem[];
  selectedRationName?: string;
  defaultFaction: 'RED' | 'BLU';
  onPostCreated: () => void;
}

const TF2_CLASSES = [
  'Heavy Weapons Guy',
  'Soldier',
  'Demoman',
  'Scout',
  'Pyro',
  'Engineer',
  'Medic',
  'Sniper',
  'Spy'
];

const SECTOR_PRESETS = [
  'Dustbowl - Sector 3 Bunker',
  'Badlands - Spire Ridge',
  '2Fort - Intel Courtyard',
  'Gravel Pit - Outpost C',
  'Granary - Central Silo',
  'Hydro - Generator Substation',
  'Upward - Final Payload Rail'
];

export const ForumOrderForm: React.FC<ForumOrderFormProps> = ({
  rationItems,
  selectedRationName,
  defaultFaction,
  onPostCreated,
}) => {
  const [mercenaryName, setMercenaryName] = useState('');
  const [mercenaryClass, setMercenaryClass] = useState('Heavy Weapons Guy');
  const [faction, setFaction] = useState<'RED' | 'BLU'>(defaultFaction);
  const [rationItem, setRationItem] = useState(selectedRationName || 'The Sandvich');
  const [rationQuantity, setRationQuantity] = useState(1);
  const [frontlineSector, setFrontlineSector] = useState(SECTOR_PRESETS[0]);
  const [customSector, setCustomSector] = useState('');
  const [priority, setPriority] = useState<'ROUTINE' | 'STANDARD' | 'URGENT' | 'DEFCON 1'>('STANDARD');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    if (selectedRationName) {
      setRationItem(selectedRationName);
    }
  }, [selectedRationName]);

  useEffect(() => {
    setFaction(defaultFaction);
  }, [defaultFaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessData(null);

    const finalSector = customSector.trim() ? customSector.trim() : frontlineSector;

    if (!mercenaryName.trim()) {
      setErrorMsg('Iltimos, jangchi ismini yoki kodini kiriting (Mercenary Name is required).');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Iltimos, forum xabari va taktik izohingizni yozing (Tactical Message is required).');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mercenary_name: mercenaryName,
          mercenary_class: mercenaryClass,
          faction,
          ration_item: rationItem,
          ration_quantity: rationQuantity,
          frontline_sector: finalSector,
          priority,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Serverga saqlashda xatolik yuz berdi');
      }

      setSuccessData({
        id: data.post?.id || 0,
        message: 'Requisition muvaffaqiyatli SQL bazasiga saqlandi!'
      });

      // Clear input text
      setMessage('');
      setCustomSector('');

      // Refresh list
      onPostCreated();
    } catch (err: any) {
      setErrorMsg(err.message || 'SQL bazasiga yozishda xato.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="forum" className="py-12 bg-[#E1D5B8] border-b-3 border-[#2B2625] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Main Manila Dossier Envelope */}
        <div className="bg-[#EFE7D3] border-3 border-[#2B2625] shadow-ink-lg p-6 sm:p-8 relative">
          {/* Header Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-[#2B2625] pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 font-mono-code text-xs font-bold uppercase text-[#B8383B]">
                <Database className="w-4 h-4 text-[#B8383B]" />
                <span>OFFICIAL SQL FORM / FORUM REQUISITION TELEGRAPH</span>
              </div>
              <h2 className="font-anton text-3xl sm:text-4xl text-[#2B2625] uppercase tracking-wide">
                TACTICAL RATION DISPATCH FORUM
              </h2>
            </div>
            <div className="stamp-classified px-3 py-1 bg-[#fff8f6] font-bold text-xs uppercase self-start sm:self-center">
              SQL SAVED · CLASSIFIED
            </div>
          </div>

          <p className="font-sans text-sm text-[#584140] mb-6">
            To'ldirilgan buyurtma va izohlaringiz to'g'ridan-to'g'ri <strong className="text-[#B8383B] font-bold">SQL bazasiga</strong> saqlanadi. Admin uni <code className="bg-[#D1C2A5] px-1 py-0.5 border border-[#2B2625] text-xs">/admin</code> sahifasida ko'rib chiqadi, tasdiqlaydi yoki yuboradi.
          </p>

          {/* Success Banner */}
          {successData && (
            <div className="mb-6 p-4 bg-[#d8f3dc] border-2 border-[#2d6a4f] text-[#1b4332] shadow-ink-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5" />
              <div>
                <div className="font-anton text-base uppercase tracking-wider">
                  Muvaffaqiyatli saqlandi! (Requisition #{successData.id})
                </div>
                <div className="font-sans text-xs">
                  {successData.message} Ushbu ma'lumot SQL jadvaliga yozildi va pastdagi ro'yxatda darhol aks ettirildi.
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-[#ffdad6] border-2 border-[#ba1a1a] text-[#93000a] shadow-ink-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
              <div>
                <div className="font-anton text-base uppercase tracking-wider">
                  Xatolik yuz berdi
                </div>
                <div className="font-sans text-xs">{errorMsg}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid 1: Name & Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-1.5">
                  Mercenary Callsign / Ismi <span className="text-[#B8383B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Misha (Heavy), Jane Doe..."
                  value={mercenaryName}
                  onChange={(e) => setMercenaryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#E1D5B8] focus:bg-[#fff8f6] border-2 border-[#2B2625] focus:outline-none focus:border-[#E5A823] font-mono-code text-sm text-[#2B2625] placeholder:text-[#8c716f] shadow-ink-sm"
                />
              </div>

              <div>
                <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-1.5">
                  Mercenary Class (Jangchi sinfi) <span className="text-[#B8383B]">*</span>
                </label>
                <select
                  value={mercenaryClass}
                  onChange={(e) => setMercenaryClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#E1D5B8] focus:bg-[#fff8f6] border-2 border-[#2B2625] focus:outline-none font-mono-code text-sm text-[#2B2625] shadow-ink-sm"
                >
                  {TF2_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid 2: Faction & Ration Item & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-1.5">
                  Faction (Jamoa)
                </label>
                <div className="flex border-2 border-[#2B2625] shadow-ink-sm">
                  <button
                    type="button"
                    onClick={() => setFaction('RED')}
                    className={`flex-1 py-2 font-mono-code text-xs font-bold uppercase transition-colors ${
                      faction === 'RED'
                        ? 'bg-[#B8383B] text-[#EFE7D3]'
                        : 'bg-[#D1C2A5] text-[#2B2625] hover:bg-[#E1D5B8]'
                    }`}
                  >
                    RED (Reliable)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFaction('BLU')}
                    className={`flex-1 py-2 font-mono-code text-xs font-bold uppercase transition-colors ${
                      faction === 'BLU'
                        ? 'bg-[#5885A2] text-[#EFE7D3]'
                        : 'bg-[#D1C2A5] text-[#2B2625] hover:bg-[#E1D5B8]'
                    }`}
                  >
                    BLU (Builders)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-1.5">
                  Ration Munition (Oziq-ovqat turi) <span className="text-[#B8383B]">*</span>
                </label>
                <select
                  value={rationItem}
                  onChange={(e) => setRationItem(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#E1D5B8] focus:bg-[#fff8f6] border-2 border-[#2B2625] focus:outline-none font-mono-code text-sm text-[#2B2625] shadow-ink-sm"
                >
                  {rationItems.map((r) => (
                    <option key={r.code} value={r.name}>
                      {r.name} ({r.hp_restore})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-1.5">
                  Crates / Soni
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={rationQuantity}
                    onChange={(e) => setRationQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 bg-[#E1D5B8] focus:bg-[#fff8f6] border-2 border-[#2B2625] focus:outline-none font-mono-code text-sm text-[#2B2625] shadow-ink-sm"
                  />
                  <span className="font-mono-code text-xs font-bold text-[#584140] whitespace-nowrap">
                    CRATES
                  </span>
                </div>
              </div>
            </div>

            {/* Grid 3: Sector & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-1.5">
                  Frontline Sector (Front sektori) <span className="text-[#B8383B]">*</span>
                </label>
                <select
                  value={frontlineSector}
                  onChange={(e) => setFrontlineSector(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#E1D5B8] focus:bg-[#fff8f6] border-2 border-[#2B2625] focus:outline-none font-mono-code text-sm text-[#2B2625] shadow-ink-sm mb-2"
                >
                  {SECTOR_PRESETS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Yoki o'z sektoringizni yozing..."
                  value={customSector}
                  onChange={(e) => setCustomSector(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#E1D5B8] focus:bg-[#fff8f6] border border-[#2B2625] focus:outline-none font-mono-code text-xs text-[#2B2625] placeholder:text-[#8c716f]"
                />
              </div>

              <div>
                <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-1.5">
                  Urgency / Priority (Shoshilinchlik darajasi)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['ROUTINE', 'STANDARD', 'URGENT', 'DEFCON 1'] as const).map((lvl) => {
                    const isSelected = priority === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setPriority(lvl)}
                        className={`py-2 px-2 text-xs font-mono-code font-bold uppercase border-2 border-[#2B2625] shadow-ink-sm transition-all ${
                          isSelected
                            ? lvl === 'DEFCON 1'
                              ? 'bg-[#B8383B] text-[#EFE7D3]'
                              : lvl === 'URGENT'
                              ? 'bg-[#E5A823] text-[#2B2625]'
                              : 'bg-[#2B2625] text-[#EFE7D3]'
                            : 'bg-[#E1D5B8] text-[#584140] hover:bg-[#D1C2A5]'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tactical Notes / Forum Message */}
            <div>
              <label className="block font-mono-code text-xs font-bold uppercase text-[#2B2625] mb-1.5 flex items-center justify-between">
                <span>
                  Tactical Notes & Forum Reason (Taktik izoh va sabab) <span className="text-[#B8383B]">*</span>
                </span>
                <span className="text-[10px] text-[#584140] font-normal">
                  Saves to SQL <code className="font-mono">message</code> column
                </span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe combat situation, urgent medical need, or mess hall requisition justification..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3.5 bg-[#E1D5B8] focus:bg-[#fff8f6] border-2 border-[#2B2625] focus:outline-none focus:border-[#E5A823] font-mono-code text-sm text-[#2B2625] placeholder:text-[#8c716f] shadow-ink-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-[#2B2625]">
              <div className="font-mono-code text-xs text-[#584140] flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#B8383B]" />
                <span>SQL Server table: <strong className="text-[#2B2625]">requisitions</strong></span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#B8383B] hover:bg-[#7C2528] disabled:bg-[#8c716f] text-[#EFE7D3] font-anton text-lg tracking-wider uppercase border-3 border-[#2B2625] shadow-ink flex items-center justify-center gap-2 btn-press transition-all chamfer-tr"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    <span>SQL bazasiga saqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-[#E5A823]" />
                    <span>Save to SQL & Dispatch Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
