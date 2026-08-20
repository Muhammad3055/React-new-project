import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Scale, DollarSign, Users, Sparkles, Info, CheckCircle2 } from 'lucide-react';

export default function InheritanceView() {
  const { t } = useLanguage();
  const [estateValue, setEstateValue] = useState('1000000');
  const [deceasedGender, setDeceasedGender] = useState('male'); // 'male' or 'female'

  // Heirs Presence Count
  const [spouseCount, setSpouseCount] = useState(1); // Wife (if male) or Husband (if female)
  const [sonsCount, setSonsCount] = useState(2);
  const [daughtersCount, setDaughtersCount] = useState(1);
  const [fatherPresent, setFatherPresent] = useState(true);
  const [motherPresent, setMotherPresent] = useState(true);

  const netEstate = parseFloat(estateValue) || 0;

  // Calculate Quranic Fixed Shares (Fara'id)
  let spouseShareFrac = 0;
  const hasChildren = (sonsCount > 0 || daughtersCount > 0);

  if (deceasedGender === 'male') {
    // Wife Share: 1/8 if children present, 1/4 if no children
    spouseShareFrac = hasChildren ? (1/8) : (1/4);
  } else {
    // Husband Share: 1/4 if children present, 1/2 if no children
    spouseShareFrac = hasChildren ? (1/4) : (1/2);
  }

  const motherShareFrac = motherPresent ? (hasChildren ? (1/6) : (1/3)) : 0;
  const fatherShareFrac = fatherPresent ? (1/6) : 0;

  const totalFixedFrac = spouseShareFrac + motherShareFrac + fatherShareFrac;
  const spouseVal = netEstate * spouseShareFrac;
  const motherVal = netEstate * motherShareFrac;
  const fatherVal = netEstate * fatherShareFrac;

  // Remaining Residue (Asabah) for Children
  const residueVal = Math.max(0, netEstate - (spouseVal + motherVal + fatherVal));

  // Children Share: Male gets twice the share of female (2:1 ratio)
  const totalChildUnits = (sonsCount * 2) + daughtersCount;
  const unitVal = totalChildUnits > 0 ? (residueVal / totalChildUnits) : 0;

  const eachSonVal = unitVal * 2;
  const totalSonsVal = eachSonVal * sonsCount;

  const eachDaughterVal = unitVal * 1;
  const totalDaughtersVal = eachDaughterVal * daughtersCount;

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #022c22 0%, #1e1b4b 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Scale size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Sharia Mirath Jurisprudence
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Islamic Inheritance Shares Calculator
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Calculate legal Quranic inheritance shares (*Fara'id &amp; Asabah*) based on Surah An-Nisa (Verses 11, 12, 176) for heirs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

          {/* Left Column: Heirs Input Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Estate Value & Deceased Gender */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>1. Net Estate &amp; Deceased Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Net Estate Value (Cash + Assets - Debts):</label>
                  <input type="number" value={estateValue} onChange={e => setEstateValue(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Deceased Gender:</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setDeceasedGender('male')}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                        background: deceasedGender === 'male' ? '#059669' : '#f1f5f9',
                        color: deceasedGender === 'male' ? '#fff' : '#475569', border: 'none'
                      }}
                    >
                      Male (Deceased Husband/Father)
                    </button>
                    <button
                      onClick={() => setDeceasedGender('female')}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                        background: deceasedGender === 'female' ? '#059669' : '#f1f5f9',
                        color: deceasedGender === 'female' ? '#fff' : '#475569', border: 'none'
                      }}
                    >
                      Female (Deceased Wife/Mother)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Surviving Family Heirs */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>2. Surviving Legal Heirs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={heirRowStyle}>
                  <span>{deceasedGender === 'male' ? 'Wife / Wives' : 'Husband'}:</span>
                  <input type="number" min="0" max="4" value={spouseCount} onChange={e => setSpouseCount(parseInt(e.target.value)||0)} style={{ width: '70px', ...inputStyle }} />
                </div>
                <div style={heirRowStyle}>
                  <span>Sons:</span>
                  <input type="number" min="0" value={sonsCount} onChange={e => setSonsCount(parseInt(e.target.value)||0)} style={{ width: '70px', ...inputStyle }} />
                </div>
                <div style={heirRowStyle}>
                  <span>Daughters:</span>
                  <input type="number" min="0" value={daughtersCount} onChange={e => setDaughtersCount(parseInt(e.target.value)||0)} style={{ width: '70px', ...inputStyle }} />
                </div>
                <div style={heirRowStyle}>
                  <span>Father Alive?</span>
                  <input type="checkbox" checked={fatherPresent} onChange={e => setFatherPresent(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
                <div style={heirRowStyle}>
                  <span>Mother Alive?</span>
                  <input type="checkbox" checked={motherPresent} onChange={e => setMotherPresent(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Inheritance Share Results */}
          <div>
            <div style={{
              position: 'sticky', top: '100px', background: '#0f172a', borderRadius: '24px',
              padding: '2rem', color: '#ffffff', border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fcd34d', margin: '0 0 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                Legal Shares Breakdown
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {spouseCount > 0 && (
                  <div style={resultRowStyle}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>{deceasedGender === 'male' ? `Wife (${spouseCount})` : 'Husband'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#93c5fd' }}>Quranic Share: {(spouseShareFrac * 100).toFixed(1)}%</div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#fcd34d', fontSize: '1.1rem' }}>Rs. {spouseVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                  </div>
                )}

                {motherPresent && (
                  <div style={resultRowStyle}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>Mother</div>
                      <div style={{ fontSize: '0.78rem', color: '#93c5fd' }}>Quranic Share: {(motherShareFrac * 100).toFixed(1)}%</div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#fcd34d', fontSize: '1.1rem' }}>Rs. {motherVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                  </div>
                )}

                {fatherPresent && (
                  <div style={resultRowStyle}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>Father</div>
                      <div style={{ fontSize: '0.78rem', color: '#93c5fd' }}>Quranic Share: {(fatherShareFrac * 100).toFixed(1)}%</div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#fcd34d', fontSize: '1.1rem' }}>Rs. {fatherVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                  </div>
                )}

                {sonsCount > 0 && (
                  <div style={resultRowStyle}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>Sons ({sonsCount} total)</div>
                      <div style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>Rs. {eachSonVal.toLocaleString('en-US', { maximumFractionDigits: 0 })} per son (2x ratio)</div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#34d399', fontSize: '1.1rem' }}>Rs. {totalSonsVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                  </div>
                )}

                {daughtersCount > 0 && (
                  <div style={resultRowStyle}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>Daughters ({daughtersCount} total)</div>
                      <div style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>Rs. {eachDaughterVal.toLocaleString('en-US', { maximumFractionDigits: 0 })} per daughter</div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#34d399', fontSize: '1.1rem' }}>Rs. {totalDaughtersVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.65rem 0.9rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.9rem'
};
const heirRowStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, color: '#334155', fontSize: '0.92rem'
};
const resultRowStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)'
};
