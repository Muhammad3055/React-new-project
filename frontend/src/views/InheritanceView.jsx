import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Scale, Users, FileText, Printer, CheckCircle2, AlertCircle, RotateCcw, HeartHandshake, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function InheritanceView() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('mirath'); // 'mirath' | 'wasiyyah'

  // ==========================================
  // 1. MIRATH CALCULATOR STATE
  // ==========================================
  const [estateValue, setEstateValue] = useState('1000000');
  const [deceasedGender, setDeceasedGender] = useState('male'); // 'male' or 'female'

  // Heirs Presence Count
  const [spouseCount, setSpouseCount] = useState(1);
  const [sonsCount, setSonsCount] = useState(2);
  const [daughtersCount, setDaughtersCount] = useState(1);
  const [fatherPresent, setFatherPresent] = useState(true);
  const [motherPresent, setMotherPresent] = useState(true);

  const netEstate = parseFloat(estateValue) || 0;

  // Calculate Quranic Fixed Shares (Fara'id)
  let spouseShareFrac = 0;
  const hasChildren = (sonsCount > 0 || daughtersCount > 0);

  if (deceasedGender === 'male') {
    spouseShareFrac = hasChildren ? (1 / 8) : (1 / 4);
  } else {
    spouseShareFrac = hasChildren ? (1 / 4) : (1 / 2);
  }

  const motherShareFrac = motherPresent ? (hasChildren ? (1 / 6) : (1 / 3)) : 0;
  const fatherShareFrac = fatherPresent ? (1 / 6) : 0;

  const spouseVal = netEstate * spouseShareFrac;
  const motherVal = netEstate * motherShareFrac;
  const fatherVal = netEstate * fatherShareFrac;

  // Remaining Residue (Asabah) for Children
  const residueVal = Math.max(0, netEstate - (spouseVal + motherVal + fatherVal));

  const totalChildUnits = (sonsCount * 2) + daughtersCount;
  const unitVal = totalChildUnits > 0 ? (residueVal / totalChildUnits) : 0;

  const eachSonVal = unitVal * 2;
  const totalSonsVal = eachSonVal * sonsCount;

  const eachDaughterVal = unitVal * 1;
  const totalDaughtersVal = eachDaughterVal * daughtersCount;

  // ==========================================
  // 2. WASIYYAH (ISLAMIC WILL) STATE
  // ==========================================
  const [testator, setTestator] = useState({
    fullName: '',
    fatherName: '',
    nationalId: '',
    gender: 'male',
    maritalStatus: 'married',
    address: '',
    city: '',
    phone: '',
    willDate: new Date().toISOString().split('T')[0]
  });

  const [burialDirectives, setBurialDirectives] = useState({
    sunnahBurial: true,
    noLoudMourning: true,
    immediateBurial: true,
    muslimCemetery: true,
    specialNotes: 'I request that only righteous practicing Muslims administer my Ghusl, and that my funeral prayer (Salat al-Janazah) be led by a pious Imam who avoids innovations.'
  });

  const [liabilities, setLiabilities] = useState({
    personalDebts: 'None / To be settled from cash accounts immediately',
    unpaidMahr: '',
    unperformedHajj: false,
    hajjBadalCost: '',
    fidyahSalahRoza: '',
    unpaidZakat: ''
  });

  const [bequest, setBequest] = useState({
    enabled: true,
    percentage: 10, // Max 33.3%
    beneficiaryName: 'Maktaba tul Muslim Quranic Welfare & Education Trust',
    purpose: 'Perpetual Sadaqah Jariyah for Quranic literacy, publication of Islamic manuscripts, and education of orphan students.'
  });

  const [executor, setExecutor] = useState({
    fullName: '',
    nationalId: '',
    relationship: 'Brother / Eldest Son',
    phone: '',
    altExecutor: '',
    altPhone: ''
  });

  const [guardian, setGuardian] = useState({
    fullName: '',
    relationship: 'Spouse / Brother',
    phone: ''
  });

  const [witnesses, setWitnesses] = useState({
    witness1Name: '',
    witness1Id: '',
    witness1Phone: '',
    witness2Name: '',
    witness2Id: '',
    witness2Phone: ''
  });

  const fillSampleWill = () => {
    setTestator({
      fullName: 'Muhammad Usman Khan',
      fatherName: 'Abdul Rashid Khan',
      nationalId: '42101-1234567-1',
      gender: 'male',
      maritalStatus: 'married',
      address: 'House # 45, Street 12, Gulshan-e-Iqbal Block 5',
      city: 'Karachi, Pakistan',
      phone: '+92 300 1234567',
      willDate: new Date().toISOString().split('T')[0]
    });
    setExecutor({
      fullName: 'Tariq Mehmood Khan',
      nationalId: '42101-7654321-3',
      relationship: 'Brother',
      phone: '+92 321 9876543',
      altExecutor: 'Zubair Usman Khan',
      altPhone: '+92 333 4567890'
    });
    setGuardian({
      fullName: 'Ayesha Bibi',
      relationship: 'Wife / Mother of Minors',
      phone: '+92 300 7654321'
    });
    setWitnesses({
      witness1Name: 'Hafiz Bilal Ahmed',
      witness1Id: '42201-5544332-1',
      witness1Phone: '+92 345 1122334',
      witness2Name: 'Sajid Ali Farooqi',
      witness2Id: '42101-9988776-5',
      witness2Phone: '+92 312 9988776'
    });
    setLiabilities(prev => ({
      ...prev,
      unpaidMahr: '0 (Fully Paid)',
      unpaidZakat: 'Calculated and paid annually prior to passing'
    }));
  };

  const resetWill = () => {
    if (window.confirm('Are you sure you want to reset all Wasiyyah form fields?')) {
      setTestator({
        fullName: '',
        fatherName: '',
        nationalId: '',
        gender: 'male',
        maritalStatus: 'married',
        address: '',
        city: '',
        phone: '',
        willDate: new Date().toISOString().split('T')[0]
      });
      setExecutor({ fullName: '', nationalId: '', relationship: '', phone: '', altExecutor: '', altPhone: '' });
      setGuardian({ fullName: '', relationship: '', phone: '' });
      setWitnesses({ witness1Name: '', witness1Id: '', witness1Phone: '', witness2Name: '', witness2Id: '', witness2Phone: '' });
    }
  };

  const handlePrintWill = () => {
    window.print();
  };

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #022c22 0%, #1e1b4b 100%)',
          borderRadius: '24px', padding: '2.75rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Scale size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Shariah Estate &amp; Legal Succession Hub
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Islamic Mirath &amp; Wasiyyah (Will) Portal
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.02rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            Accurately divide inheritance according to the Quranic verses of Surah An-Nisa (4:11-12) or draft a legally binding, authentic Islamic Last Will &amp; Testament (الوصية الشرعية).
          </p>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('mirath')}
              style={{
                padding: '10px 22px', borderRadius: '16px', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none',
                background: activeTab === 'mirath' ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'mirath' ? '#000' : '#ffffff',
                boxShadow: activeTab === 'mirath' ? '0 4px 14px rgba(245,158,11,0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Scale size={18} />
              <span>{t('wasiyyahTabInheritance', '1. Mirath Estate Calculator (علم المواريث)')}</span>
            </button>

            <button
              onClick={() => setActiveTab('wasiyyah')}
              style={{
                padding: '10px 22px', borderRadius: '16px', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none',
                background: activeTab === 'wasiyyah' ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'wasiyyah' ? '#000' : '#ffffff',
                boxShadow: activeTab === 'wasiyyah' ? '0 4px 14px rgba(245,158,11,0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <FileText size={18} />
              <span>{t('wasiyyahTabDeclaration', '2. Islamic Will (Wasiyyah) Generator (الوصية الشرعية)')}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: MIRATH CALCULATOR                                  */}
        {/* ========================================================= */}
        {activeTab === 'mirath' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

            {/* Left Column: Heirs Input Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Estate Value & Deceased Gender */}
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{t('netEstateDeceasedInfo', 'Net Estate & Deceased Details')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>{t('netEstateValue', 'Total Distributable Estate Value (Cash, Property, Gold)')}</label>
                    <input type="number" value={estateValue} onChange={e => setEstateValue(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>{t('deceasedGender', 'Deceased Gender')}</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setDeceasedGender('male')}
                        style={{
                          flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                          background: deceasedGender === 'male' ? '#059669' : '#f1f5f9',
                          color: deceasedGender === 'male' ? '#fff' : '#475569', border: 'none'
                        }}
                      >
                        {t('maleDeceased', 'Male (Husband / Father)')}
                      </button>
                      <button
                        onClick={() => setDeceasedGender('female')}
                        style={{
                          flex: 1, padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                          background: deceasedGender === 'female' ? '#059669' : '#f1f5f9',
                          color: deceasedGender === 'female' ? '#fff' : '#475569', border: 'none'
                        }}
                      >
                        {t('femaleDeceased', 'Female (Wife / Mother)')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Surviving Family Heirs */}
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{t('survivingLegalHeirs', 'Surviving Primary Legal Heirs')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={heirRowStyle}>
                    <span>{deceasedGender === 'male' ? t('wifeWives', 'Surviving Wife (Wives)') : t('husband', 'Surviving Husband')}:</span>
                    <input type="number" min="0" max="4" value={spouseCount} onChange={e => setSpouseCount(parseInt(e.target.value) || 0)} style={{ width: '70px', ...inputStyle }} />
                  </div>
                  <div style={heirRowStyle}>
                    <span>{t('sons', 'Number of Living Sons')}:</span>
                    <input type="number" min="0" value={sonsCount} onChange={e => setSonsCount(parseInt(e.target.value) || 0)} style={{ width: '70px', ...inputStyle }} />
                  </div>
                  <div style={heirRowStyle}>
                    <span>{t('daughters', 'Number of Living Daughters')}:</span>
                    <input type="number" min="0" value={daughtersCount} onChange={e => setDaughtersCount(parseInt(e.target.value) || 0)} style={{ width: '70px', ...inputStyle }} />
                  </div>
                  <div style={heirRowStyle}>
                    <span>{t('fatherAlive', 'Father is Alive')}</span>
                    <input type="checkbox" checked={fatherPresent} onChange={e => setFatherPresent(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                  </div>
                  <div style={heirRowStyle}>
                    <span>{t('motherAlive', 'Mother is Alive')}</span>
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
                  {t('legalSharesBreakdown', 'Quranic Fara\'id Distribution Breakdown')}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {spouseCount > 0 && (
                    <div style={resultRowStyle}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>{deceasedGender === 'male' ? `${t('wifeWives', 'Wife / Wives')} (${spouseCount})` : t('husband', 'Husband')}</div>
                        <div style={{ fontSize: '0.78rem', color: '#93c5fd' }}>Quranic Share: {(spouseShareFrac * 100).toFixed(1)}% ({hasChildren ? '1/8 due to children' : '1/4 without children'})</div>
                      </div>
                      <div style={{ fontWeight: 900, color: '#fcd34d', fontSize: '1.1rem' }}>Rs. {spouseVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                    </div>
                  )}

                  {motherPresent && (
                    <div style={resultRowStyle}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>Mother</div>
                        <div style={{ fontSize: '0.78rem', color: '#93c5fd' }}>Quranic Share: {(motherShareFrac * 100).toFixed(1)}% ({hasChildren ? '1/6' : '1/3'})</div>
                      </div>
                      <div style={{ fontWeight: 900, color: '#fcd34d', fontSize: '1.1rem' }}>Rs. {motherVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                    </div>
                  )}

                  {fatherPresent && (
                    <div style={resultRowStyle}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>Father</div>
                        <div style={{ fontSize: '0.78rem', color: '#93c5fd' }}>Quranic Share: {(fatherShareFrac * 100).toFixed(1)}% (1/6 as fixed sharer)</div>
                      </div>
                      <div style={{ fontWeight: 900, color: '#fcd34d', fontSize: '1.1rem' }}>Rs. {fatherVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                    </div>
                  )}

                  {sonsCount > 0 && (
                    <div style={resultRowStyle}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>{t('sons', 'Sons')} ({sonsCount} total)</div>
                        <div style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>Rs. {eachSonVal.toLocaleString('en-US', { maximumFractionDigits: 0 })} per son (2x ratio)</div>
                      </div>
                      <div style={{ fontWeight: 900, color: '#34d399', fontSize: '1.1rem' }}>Rs. {totalSonsVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                    </div>
                  )}

                  {daughtersCount > 0 && (
                    <div style={resultRowStyle}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>{t('daughters', 'Daughters')} ({daughtersCount} total)</div>
                        <div style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>Rs. {eachDaughterVal.toLocaleString('en-US', { maximumFractionDigits: 0 })} per daughter</div>
                      </div>
                      <div style={{ fontWeight: 900, color: '#34d399', fontSize: '1.1rem' }}>Rs. {totalDaughtersVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                    </div>
                  )}
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.82rem', color: '#fef3c7', lineHeight: 1.5 }}>
                  <i className="fas fa-info-circle" style={{ color: '#f59e0b', marginRight: '6px' }}></i>
                  <strong>Quranic Reference:</strong> "Allah commands you regarding your children: for the male, what is equal to the share of two females..." (Surah An-Nisa 4:11).
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: WASIYYAH (ISLAMIC WILL) GENERATOR                  */}
        {/* ========================================================= */}
        {activeTab === 'wasiyyah' && (
          <div>
            {/* Hadith Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.08) 100%)',
              border: '1.5px solid #f59e0b', borderRadius: '18px', padding: '1.25rem 1.5rem', marginBottom: '2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#b45309', background: '#fef3c7', padding: '2px 10px', borderRadius: '12px' }}>
                  Prophetic Injunction (حديث نبوي شريف)
                </span>
                <p style={{ margin: '0.5rem 0 0', fontStyle: 'italic', color: '#451a03', fontSize: '0.94rem', lineHeight: 1.5 }}>
                  "It is not permissible for any Muslim who has something to bequeath to stay for two nights without having his last will and testament written and kept ready with him." (Sahih al-Bukhari 2738, Sahih Muslim 1627)
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={fillSampleWill}
                  style={{ background: '#064e3b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={16} /> Fill Sample
                </button>
                <button
                  type="button"
                  onClick={resetWill}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '2rem' }}>

              {/* Form Input Columns */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* 1. Testator Personal Information */}
                <div style={cardStyle}>
                  <h3 style={sectionTitleStyle}>
                    <Users size={18} style={{ color: '#059669' }} /> 1. Testator Information (الموصي)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={labelStyle}>Full Legal Name *</label>
                      <input type="text" placeholder="e.g. Muhammad Usman Khan" value={testator.fullName} onChange={e => setTestator({ ...testator, fullName: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>Father's / Husband's Name *</label>
                        <input type="text" placeholder="e.g. Abdul Rashid Khan" value={testator.fatherName} onChange={e => setTestator({ ...testator, fatherName: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>CNIC / National ID / Passport *</label>
                        <input type="text" placeholder="e.g. 42101-1234567-1" value={testator.nationalId} onChange={e => setTestator({ ...testator, nationalId: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Permanent Residential Address</label>
                      <input type="text" placeholder="Street, Sector, City" value={testator.address} onChange={e => setTestator({ ...testator, address: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>City &amp; Country</label>
                        <input type="text" placeholder="e.g. Karachi, Pakistan" value={testator.city} onChange={e => setTestator({ ...testator, city: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Contact Phone</label>
                        <input type="text" placeholder="+92 300 0000000" value={testator.phone} onChange={e => setTestator({ ...testator, phone: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Islamic Burial & Funeral Directives */}
                <div style={cardStyle}>
                  <h3 style={sectionTitleStyle}>
                    <ShieldCheck size={18} style={{ color: '#059669' }} /> 2. Islamic Funeral Directives (توجيهات الجنازة)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#334155' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={burialDirectives.sunnahBurial} onChange={e => setBurialDirectives({ ...burialDirectives, sunnahBurial: e.target.checked })} />
                      <span>Perform Ghusl and simple shroud (Kafan) strictly according to Sunnah.</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={burialDirectives.immediateBurial} onChange={e => setBurialDirectives({ ...burialDirectives, immediateBurial: e.target.checked })} />
                      <span>Burial without unjustified delay in the nearest Muslim cemetery.</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={burialDirectives.noLoudMourning} onChange={e => setBurialDirectives({ ...burialDirectives, noLoudMourning: e.target.checked })} />
                      <span>Strictly prohibit wailing, loud crying, non-Islamic rituals, or flowers.</span>
                    </label>
                    <div>
                      <label style={labelStyle}>Special Burial Wishes &amp; Imam Directives</label>
                      <textarea rows="2" value={burialDirectives.specialNotes} onChange={e => setBurialDirectives({ ...burialDirectives, specialNotes: e.target.value })} style={{ ...inputStyle, width: '100%', resize: 'vertical' }} />
                    </div>
                  </div>
                </div>

                {/* 3. Debts & Religious Liabilities */}
                <div style={cardStyle}>
                  <h3 style={sectionTitleStyle}>
                    <Scale size={18} style={{ color: '#059669' }} /> 3. Debts &amp; Liabilities (قضاء الديون)
                  </h3>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#64748b' }}>
                    In Shariah, all outstanding debts and funeral costs MUST be cleared before any inheritance or voluntary bequest is distributed.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>Debts Owed to People / Institutions</label>
                      <input type="text" placeholder="List creditor names and amounts" value={liabilities.personalDebts} onChange={e => setLiabilities({ ...liabilities, personalDebts: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>Unpaid Mahr to Wife</label>
                        <input type="text" placeholder="e.g. 50,000 PKR / Paid" value={liabilities.unpaidMahr} onChange={e => setLiabilities({ ...liabilities, unpaidMahr: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Unpaid Zakat / Fidyah (Fasts &amp; Salah)</label>
                        <input type="text" placeholder="e.g. Fidyah for 10 missed fasts" value={liabilities.fidyahSalahRoza} onChange={e => setLiabilities({ ...liabilities, fidyahSalahRoza: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Voluntary Bequest (Wasiyyah - Max 1/3) */}
                <div style={cardStyle}>
                  <h3 style={sectionTitleStyle}>
                    <HeartHandshake size={18} style={{ color: '#059669' }} /> 4. Voluntary Bequest (الوصية بالثلث فما دون)
                  </h3>
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '0.85rem', fontSize: '0.82rem', color: '#475569' }}>
                    <strong>Shariah Rule:</strong> The voluntary bequest cannot exceed <strong>one-third (1/3 or 33.3%)</strong> of the net estate and <strong>cannot</strong> be granted to any legal heir who already inherits by right of Quranic share.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>Charity / Non-Heir Beneficiary Name</label>
                      <input type="text" placeholder="e.g. Mosque construction, orphan fund, etc." value={bequest.beneficiaryName} onChange={e => setBequest({ ...bequest, beneficiaryName: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Bequest Share Percentage (Max 33.3%): <strong style={{ color: '#059669' }}>{bequest.percentage}%</strong></label>
                      <input
                        type="range"
                        min="1"
                        max="33"
                        value={bequest.percentage}
                        onChange={e => setBequest({ ...bequest, percentage: parseInt(e.target.value, 10) })}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Intended Cause / Sadaqah Jariyah Objective</label>
                      <input type="text" value={bequest.purpose} onChange={e => setBequest({ ...bequest, purpose: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* 5. Executor & Witnesses */}
                <div style={cardStyle}>
                  <h3 style={sectionTitleStyle}>
                    <CheckCircle2 size={18} style={{ color: '#059669' }} /> 5. Executor (Wasi) &amp; Witnesses
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>Primary Executor Name *</label>
                        <input type="text" placeholder="e.g. Tariq Khan" value={executor.fullName} onChange={e => setExecutor({ ...executor, fullName: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Executor CNIC / Phone</label>
                        <input type="text" placeholder="e.g. +92 300 0000000" value={executor.phone} onChange={e => setExecutor({ ...executor, phone: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>Witness 1 (Adult Muslim Male)</label>
                        <input type="text" placeholder="Name & CNIC" value={witnesses.witness1Name} onChange={e => setWitnesses({ ...witnesses, witness1Name: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Witness 2 (Adult Muslim Male)</label>
                        <input type="text" placeholder="Name & CNIC" value={witnesses.witness2Name} onChange={e => setWitnesses({ ...witnesses, witness2Name: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Formal Document Preview & Print */}
              <div>
                <div style={{ position: 'sticky', top: '90px' }}>

                  {/* Print Action Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#022c22', padding: '12px 18px', borderRadius: '16px', color: '#fff' }}>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: '#fcd34d', fontWeight: 800 }}>OFFICIAL DOCUMENT PREVIEW</span>
                      <h4 style={{ margin: '2px 0 0', fontSize: '1.05rem', color: '#ffffff' }}>Islamic Legal Will &amp; Testament</h4>
                    </div>
                    <button
                      type="button"
                      onClick={handlePrintWill}
                      style={{
                        background: '#f59e0b', color: '#000000', border: 'none',
                        padding: '10px 20px', borderRadius: '12px', fontWeight: 800,
                        fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex',
                        alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
                      }}
                    >
                      <Printer size={18} />
                      <span>Print / Save PDF Will</span>
                    </button>
                  </div>

                  {/* Document Card (Rendered for Screen & Print) */}
                  <div
                    id="printable-wasiyyah-document"
                    style={{
                      background: '#ffffff', borderRadius: '18px', padding: '2.5rem 2rem',
                      border: '3px double #d97706', boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                      color: '#0f172a', fontFamily: 'serif', lineHeight: 1.6, maxHeight: '80vh', overflowY: 'auto'
                    }}
                  >
                    {/* Islamic Calligraphy Header */}
                    <div style={{ textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#064e3b', fontFamily: "'Amiri', 'Traditional Arabic', serif", marginBottom: '6px' }}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic', marginBottom: '4px' }}>
                        "In the name of Allah, the Entirely Merciful, the Especially Merciful"
                      </div>
                      <h2 style={{ margin: '8px 0 4px', fontSize: '1.45rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a' }}>
                        Last Will &amp; Testament (الوصية الشرعية)
                      </h2>
                      <div style={{ fontSize: '0.85rem', color: '#78716c' }}>
                        Conforming to Islamic Shariah Law &amp; Sunnah of Prophet Muhammad (PBUH)
                      </div>
                    </div>

                    {/* Declaration of Faith */}
                    <div style={{ marginBottom: '1.25rem', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #059669', fontSize: '0.88rem' }}>
                      <strong>Preamble &amp; Shahadah:</strong><br />
                      I, <strong>{testator.fullName || '[Your Full Name]'}</strong>, son/daughter of <strong>{testator.fatherName || '[Father\'s Name]'}</strong>, holder of National ID/Passport <strong>{testator.nationalId || '[ID/Passport No.]'}</strong>, resident of <strong>{testator.address || '[Address]'}</strong>, being of sound mind and sound memory, hereby declare that this is my Last Will and Testament, revoking all previous wills.
                      <p style={{ margin: '6px 0 0', fontStyle: 'italic', color: '#064e3b' }}>
                        "I testify that there is no deity worthy of worship except Allah, Alone without partner, and that Muhammad (PBUH) is His servant and final Messenger. I believe in the Day of Judgement, Heaven, Hell, and the final resurrection."
                      </p>
                    </div>

                    {/* Article 1: Funeral & Burial */}
                    <div style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 800, color: '#064e3b' }}>
                        Article 1: Islamic Funeral &amp; Burial Directives
                      </h4>
                      <p style={{ margin: 0 }}>
                        I order and direct my executor and family that upon my demise, my body shall be washed (Ghusl) and shrouded (Kafan) according to the orthodox Sunnah of the Prophet (PBUH). I must be buried without unnecessary delay in a Muslim cemetery. Under no circumstances shall my body be subjected to cremation, autopsy (unless mandated by public law), un-Islamic wailing, mourning beyond the prescribed three days (except for a widow's Iddah), or superstitious celebrations.
                      </p>
                      {burialDirectives.specialNotes && (
                        <p style={{ margin: '4px 0 0', fontStyle: 'italic', color: '#475569' }}>
                          Special Directive: {burialDirectives.specialNotes}
                        </p>
                      )}
                    </div>

                    {/* Article 2: Settlement of Debts */}
                    <div style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 800, color: '#064e3b' }}>
                        Article 2: Liquidation of Debts &amp; Religious Duties
                      </h4>
                      <p style={{ margin: 0 }}>
                        I direct that all my outstanding debts, mortgages, medical and funeral expenses, unpaid dower (Mahr), unpaid Zakat, and unperformed Hajj/Fidyah commitments be paid in full from the gross estate prior to any further distribution.
                      </p>
                      <ul style={{ margin: '4px 0 0', paddingLeft: '20px', color: '#475569' }}>
                        <li>Personal Debts: {liabilities.personalDebts || 'None listed'}</li>
                        {liabilities.unpaidMahr && <li>Unpaid Mahr: {liabilities.unpaidMahr}</li>}
                        {liabilities.fidyahSalahRoza && <li>Missed Fasting/Salah Fidyah: {liabilities.fidyahSalahRoza}</li>}
                      </ul>
                    </div>

                    {/* Article 3: Voluntary Bequest */}
                    <div style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 800, color: '#064e3b' }}>
                        Article 3: Voluntary Bequest (Wasiyyah)
                      </h4>
                      <p style={{ margin: 0 }}>
                        In accordance with the ruling of Prophet Muhammad (PBUH) restricting voluntary bequests to a maximum of one-third (1/3) of the net remaining estate, I bequeath:
                      </p>
                      <div style={{ padding: '8px 12px', background: '#fdfbf7', border: '1px dashed #d97706', borderRadius: '8px', margin: '6px 0' }}>
                        <strong>{bequest.percentage}%</strong> of my net estate to: <strong>{bequest.beneficiaryName}</strong>.<br />
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Purpose: {bequest.purpose}</span>
                      </div>
                    </div>

                    {/* Article 4: Distribution of Remaining Estate */}
                    <div style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 800, color: '#064e3b' }}>
                        Article 4: Shariah Distribution of Residue
                      </h4>
                      <p style={{ margin: 0 }}>
                        All the residue and remainder of my estate after debts, funeral costs, and the aforesaid voluntary bequest shall be distributed strictly in accordance with the Quranic laws of Mirath (Surah An-Nisa 4:11-12) under the guidance of recognized Islamic scholars. No heir shall take more or less than their ordained Quranic share.
                      </p>
                    </div>

                    {/* Article 5: Appointment of Executor */}
                    <div style={{ marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 800, color: '#064e3b' }}>
                        Article 5: Executor &amp; Guardian
                      </h4>
                      <p style={{ margin: 0 }}>
                        I nominate and appoint <strong>{executor.fullName || '[Executor Name]'}</strong> ({executor.relationship || 'Relative'}, Phone: {executor.phone || 'N/A'}) as the primary Executor of this will. If unable or unwilling to serve, I appoint <strong>{executor.altExecutor || '[Alternate Executor]'}</strong>.
                      </p>
                    </div>

                    {/* Signature Blocks */}
                    <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                          <div style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '4px' }}></div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Signature of Testator (الموصي)</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Name: {testator.fullName || '______________________'}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Date: {testator.willDate}</div>
                        </div>
                        <div>
                          <div style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '4px' }}></div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Signature of Executor (الوصي)</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Name: {executor.fullName || '______________________'}</div>
                        </div>
                      </div>

                      {/* Witnesses Signatures */}
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#064e3b', marginBottom: '0.5rem' }}>
                        Attestation of Two Sane Adult Muslim Witnesses (الشاهدان العدلان):
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem' }}>
                          <div style={{ fontWeight: 800 }}>Witness 1:</div>
                          <div>Name: {witnesses.witness1Name || '______________________'}</div>
                          <div>CNIC: {witnesses.witness1Id || '______________________'}</div>
                          <div style={{ borderBottom: '1px dashed #64748b', height: '30px', marginTop: '4px' }}></div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Signature &amp; Date</div>
                        </div>
                        <div style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem' }}>
                          <div style={{ fontWeight: 800 }}>Witness 2:</div>
                          <div>Name: {witnesses.witness2Name || '______________________'}</div>
                          <div>CNIC: {witnesses.witness2Id || '______________________'}</div>
                          <div style={{ borderBottom: '1px dashed #64748b', height: '30px', marginTop: '4px' }}></div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Signature &amp; Date</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  borderRadius: '12px',
  border: '1.5px solid #cbd5e1',
  outline: 'none',
  fontSize: '0.9rem',
  background: '#ffffff',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 700,
  color: '#475569',
  marginBottom: '4px'
};

const sectionTitleStyle = {
  margin: '0 0 1rem',
  fontSize: '1.05rem',
  fontWeight: 800,
  color: '#0f172a',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const cardStyle = {
  background: '#ffffff',
  borderRadius: '20px',
  padding: '1.5rem',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
};

const heirRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 700,
  color: '#334155',
  fontSize: '0.92rem'
};

const resultRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.1)'
};
