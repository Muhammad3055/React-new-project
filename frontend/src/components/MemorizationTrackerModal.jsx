import React, { useState, useEffect } from 'react';
import { Award, X } from 'lucide-react';


const SURAHS_LIST = [
  { number: 1, name: 'Al-Fatiha', ayahs: 7, juz: 1 },
  { number: 2, name: 'Al-Baqarah', ayahs: 286, juz: 1 },
  { number: 3, name: 'Ali \'Imran', ayahs: 200, juz: 3 },
  { number: 36, name: 'Ya-Sin', ayahs: 83, juz: 22 },
  { number: 55, name: 'Ar-Rahman', ayahs: 78, juz: 27 },
  { number: 56, name: 'Al-Waqi\'ah', ayahs: 96, juz: 27 },
  { number: 67, name: 'Al-Mulk', ayahs: 30, juz: 29 },
  { number: 78, name: 'An-Naba\'', ayahs: 40, juz: 30 },
  { number: 112, name: 'Al-Ikhlas', ayahs: 4, juz: 30 },
  { number: 113, name: 'Al-Falaq', ayahs: 5, juz: 30 },
  { number: 114, name: 'An-Nas', ayahs: 6, juz: 30 },
];

export default function MemorizationTrackerModal({ isOpen, onClose }) {
  const [hifzData, setHifzData] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchHifzRecords();
    }
  }, [isOpen]);

  const fetchHifzRecords = async () => {
    try {
      const res = await fetch('/api/hifz/');
      const data = await res.json();
      if (data.records) {
        const map = {};
        data.records.forEach(r => { map[r.surah_number] = r.status; });
        setHifzData(map);
      }
    } catch (e) {
      console.log('Using local hifz data fallback');
    }
  };

  const updateStatus = async (surahNumber, surahName, newStatus) => {
    setHifzData(prev => ({ ...prev, [surahNumber]: newStatus }));
    try {
      await fetch('/api/hifz/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surah_number: surahNumber, surah_name: surahName, status: newStatus })
      });
    } catch (e) {
      console.log('Error updating hifz status');
    }
  };

  if (!isOpen) return null;

  const countMemorized = Object.values(hifzData).filter(s => s === 'memorized').length;
  const countInProgress = Object.values(hifzData).filter(s => s === 'in_progress').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-emerald-500/30 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900/40 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-emerald-100 font-serif">Hifz Quran Memorization Tracker</h3>
              <p className="text-xs text-emerald-400/80">Track Memorized Surahs & Revision Schedules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30">
            <span className="text-2xl font-bold text-emerald-400 font-serif">{countMemorized}</span>
            <span className="text-[11px] text-slate-300 block">Memorized</span>
          </div>
          <div className="p-3 rounded-2xl bg-teal-950/60 border border-teal-500/30">
            <span className="text-2xl font-bold text-teal-300 font-serif">{countInProgress}</span>
            <span className="text-[11px] text-slate-300 block">In Progress</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-2xl font-bold text-slate-200 font-serif">114</span>
            <span className="text-[11px] text-slate-300 block">Total Surahs</span>
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {SURAHS_LIST.map((surah) => {
            const status = hifzData[surah.number] || 'not_started';
            return (
              <div 
                key={surah.number}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs font-mono">
                    {surah.number}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-100 text-sm font-serif">{surah.name}</h5>
                    <span className="text-xs text-slate-400">{surah.ayahs} Ayahs • Juz {surah.juz}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={status}
                    onChange={(e) => updateStatus(surah.number, surah.name, e.target.value)}
                    className="bg-slate-950 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 px-3 py-1.5 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="not_started">⚪ Not Started</option>
                    <option value="in_progress">🟡 In Progress</option>
                    <option value="revision">🟠 Needs Revision</option>
                    <option value="memorized">🟢 Memorized</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
