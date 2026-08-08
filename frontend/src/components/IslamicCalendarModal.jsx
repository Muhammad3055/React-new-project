import React from 'react';
import { Moon, Calendar, Sparkles, X, Sun, Compass, Clock, Star } from 'lucide-react';

const HIJRI_MONTHS = [
  'Muharram (محرم)', 'Safar (صفر)', 'Rabi al-Awwal (ربيع الأول)', 'Rabi al-Thani (ربيع الثاني)',
  'Jumada al-Awwal (جمادى الأولى)', 'Jumada al-Thani (جمادى الثانية)', 'Rajab (رجب)',
  'Sha\'ban (شعبان)', 'Ramadan (رمضان)', 'Shawwal (شوال)', 'Dhu al-Qi\'dah (ذو القعدة)', 'Dhu al-Hijjah (ذو الحجة)'
];

const ISLAMIC_EVENTS = [
  { name: 'Islamic New Year 1448', hijriDate: '1 Muharram 1448', status: 'Upcoming' },
  { name: 'Day of Ashura', hijriDate: '10 Muharram 1448', status: 'Sunnah Fast' },
  { name: 'Mawlid an-Nabi (ﷺ)', hijriDate: '12 Rabi al-Awwal 1448', status: 'Blessed Day' },
  { name: 'Isra and Mi\'raj', hijriDate: '27 Rajab 1448', status: 'Night Journey' },
  { name: 'Nisfu Sha\'ban', hijriDate: '15 Sha\'ban 1448', status: 'Night of Forgiveness' },
  { name: 'First Day of Ramadan', hijriDate: '1 Ramadan 1448', status: 'Fasting Month' },
  { name: 'Laylat al-Qadr', hijriDate: '27 Ramadan 1448', status: 'Night of Power' },
  { name: 'Eid al-Fitr', hijriDate: '1 Shawwal 1448', status: 'Celebration' },
  { name: 'Day of Arafah', hijriDate: '9 Dhu al-Hijjah 1448', status: 'Hajj Peak Day' },
  { name: 'Eid al-Adha', hijriDate: '10 Dhu al-Hijjah 1448', status: 'Feast of Sacrifice' }
];

export default function IslamicCalendarModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedGregorian = today.toLocaleDateString('en-US', options);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-emerald-500/30 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900/40 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-emerald-100 font-serif">Islamic Hijri Calendar</h3>
              <p className="text-xs text-emerald-400/80">Current Date & Sacred Islamic Events</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Today Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/50 via-teal-900/40 to-slate-900 border border-emerald-500/30 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Gregorian & Hijri Date</span>
              <h4 className="text-2xl font-bold font-serif text-emerald-200 mt-1">Safar 1448 AH</h4>
              <p className="text-sm text-slate-300 mt-0.5">{formattedGregorian}</p>
            </div>
            <div className="text-center p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40">
              <Star className="w-6 h-6 text-amber-400 mx-auto animate-pulse" />
              <span className="text-[10px] text-emerald-300 font-medium mt-1 block">Moon Phase</span>
              <span className="text-xs text-emerald-100 font-bold">Waxing Crescent</span>
            </div>
          </div>

          {/* Hijri Months Grid */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> 12 Sacred Hijri Months
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {HIJRI_MONTHS.map((month, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors">
                  <span className="text-[10px] text-emerald-400 block font-mono">Month {i + 1}</span>
                  <span className="font-medium text-slate-200">{month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Islamic Events */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Important Islamic Events & Fasting Days
            </h5>
            <div className="space-y-2">
              {ISLAMIC_EVENTS.map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-emerald-950/30 transition-all">
                  <div>
                    <h6 className="font-semibold text-slate-200 text-sm font-serif">{event.name}</h6>
                    <span className="text-xs text-emerald-400/80">{event.hijriDate}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
