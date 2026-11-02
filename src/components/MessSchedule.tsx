import React from 'react';
import { Clock, Shield, AlertTriangle, Crosshair, Award } from 'lucide-react';

export const MessSchedule: React.FC = () => {
  const scheduleData = [
    {
      time: '06:00 - 08:30 HOURS',
      shift: 'DAWN SIEGE BREAKFAST',
      menu: 'Double-Decker Toast & Titanium Fortified Oatmeal',
      sectors: 'Badlands Spire & Dustbowl Perimeter',
      officer: 'Quartermaster Hale'
    },
    {
      time: '12:00 - 14:00 HOURS',
      shift: 'HIGH-NOON PAYLOAD CHOW',
      menu: 'Standard Red Munitions Sandviches & Cold Cuts',
      sectors: '2Fort Courtyard & Gravel Pit Outposts',
      officer: 'Chef Misha (Heavy)'
    },
    {
      time: '18:00 - 21:00 HOURS',
      shift: 'EVENING CRIT DISPATCH',
      menu: 'Rare Buffalo Ribeye Slabs & Dalokohs Chocolate',
      sectors: 'Upward Final Point & Granary Silos',
      officer: 'Dr. Ludwig (Field Medic)'
    },
    {
      time: '23:00 - 04:00 HOURS',
      shift: 'NIGHT RAID RATIONS',
      menu: 'Second Bananas & Emergency Potassium Cylinders',
      sectors: 'Covert Recon & Spy Infiltration Zones',
      officer: 'Dell Conagher (Engineer)'
    }
  ];

  return (
    <section id="schedule" className="py-12 bg-[#E1D5B8] border-b-3 border-[#2B2625]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b-3 border-[#2B2625] pb-4">
          <div>
            <div className="font-mono-code text-xs font-bold uppercase text-[#B8383B] tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>OFFICIAL MANN CO. COMBAT LOGISTICS ROSTER</span>
            </div>
            <h2 className="font-anton text-3xl sm:text-4xl text-[#2B2625] uppercase tracking-wide">
              FRONTLINE MESS HALL DISPATCH TIMETABLE
            </h2>
          </div>
          <p className="font-sans text-sm text-[#584140] max-w-md">
            Chow is served strictly according to high-command tactical priorities. Deserters and sappers will be fed to the mascot yeti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scheduleData.map((slot, idx) => (
            <div
              key={idx}
              className="bg-[#EFE7D3] border-3 border-[#2B2625] shadow-ink p-5 flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-2">
                <div className="font-mono-code text-[11px] font-bold bg-[#2B2625] text-[#E5A823] px-2 py-1 inline-block border border-[#2B2625]">
                  {slot.time}
                </div>
                <h3 className="font-anton text-xl uppercase tracking-wide text-[#2B2625] leading-tight group-hover:text-[#B8383B] transition-colors">
                  {slot.shift}
                </h3>
                <div className="font-sans text-xs text-[#584140] font-semibold">
                  {slot.menu}
                </div>
              </div>

              <div className="pt-3 border-t-2 border-[#2B2625]/20 font-mono-code text-[11px] space-y-1 text-[#2B2625]">
                <div className="flex justify-between">
                  <span className="text-[#584140]">PRIMARY SECTORS:</span>
                </div>
                <div className="font-bold text-[#B8383B]">{slot.sectors}</div>
                <div className="flex justify-between pt-1 text-[10px] text-[#584140]">
                  <span>OFFICER IN CHARGE:</span>
                  <span className="font-bold text-[#2B2625]">{slot.officer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
