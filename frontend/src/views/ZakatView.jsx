import React, { useState, useEffect } from 'react';

export default function ZakatView({ user, openAuthModal, navigateToTab }) {
  const [activeSubTab, setActiveSubTab] = useState('calculator'); // 'calculator' | 'history' | 'rules' | 'virtues'
  const [currency, setCurrency] = useState('PKR');

  // Rates per gram (Defaults)
  const [goldRateG, setGoldRateG] = useState(25000); // PKR per gram gold approx
  const [silverRateG, setSilverRateG] = useState(300); // PKR per gram silver approx

  // Calculator Form State
  const [goldGrams, setGoldGrams] = useState('');
  const [silverGrams, setSilverGrams] = useState('');
  const [cashBank, setCashBank] = useState('');
  const [cashHand, setCashHand] = useState('');
  const [investments, setInvestments] = useState('');
  const [businessStock, setBusinessStock] = useState('');
  const [receivables, setReceivables] = useState('');
  const [debts, setDebts] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Saved Zakat History
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Currency Symbols map
  const currencySymbols = {
    PKR: '₨',
    USD: '$',
    EUR: '€',
    SAR: '﷼',
    AED: 'AED',
    INR: '₹'
  };

  const currentSymbol = currencySymbols[currency] || '₨';

  // Calculations
  const goldValue = (parseFloat(goldGrams) || 0) * (parseFloat(goldRateG) || 0);
  const silverValue = (parseFloat(silverGrams) || 0) * (parseFloat(silverRateG) || 0);
  const totalGrossAssets =
    goldValue +
    silverValue +
    (parseFloat(cashBank) || 0) +
    (parseFloat(cashHand) || 0) +
    (parseFloat(investments) || 0) +
    (parseFloat(businessStock) || 0) +
    (parseFloat(receivables) || 0);

  const totalDebts = parseFloat(debts) || 0;
  const netWealth = Math.max(0, totalGrossAssets - totalDebts);

  // Silver Nisab: 612.36 grams of silver
  const silverNisabValue = 612.36 * (parseFloat(silverRateG) || 0);
  // Gold Nisab: 87.48 grams of gold
  const goldNisabValue = 87.48 * (parseFloat(goldRateG) || 0);

  const isEligibleForZakat = netWealth >= silverNisabValue;
  const zakatPayable = isEligibleForZakat ? netWealth * 0.025 : 0;

  // Fetch Zakat history from dashboard API when tab/user changes
  useEffect(() => {
    if (user) {
      setLoadingHistory(true);
      fetch('/api/user/dashboard/')
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success' && data.zakat_history) {
            setHistoryRecords(data.zakat_history);
          }
          setLoadingHistory(false);
        })
        .catch(() => setLoadingHistory(false));
    }
  }, [user]);

  const handleSaveRecord = () => {
    if (!user) {
      if (openAuthModal) openAuthModal('login');
      return;
    }

    setSaveStatus({ type: 'info', message: 'Saving Zakat record...' });
    fetch('/api/user/zakat/save/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year: parseInt(selectedYear, 10),
        total_assets: totalGrossAssets,
        zakat_payable: zakatPayable
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setSaveStatus({ type: 'success', message: data.message });
          // Refresh local history list
          setHistoryRecords(prev => {
            const existingIdx = prev.findIndex(r => r.year === parseInt(selectedYear, 10));
            const newEntry = {
              year: parseInt(selectedYear, 10),
              total_assets: totalGrossAssets,
              zakat_payable: zakatPayable
            };
            if (existingIdx >= 0) {
              const updated = [...prev];
              updated[existingIdx] = newEntry;
              return updated;
            }
            return [newEntry, ...prev];
          });
        } else {
          setSaveStatus({ type: 'error', message: data.message || 'Error saving record.' });
        }
      })
      .catch(err => {
        setSaveStatus({ type: 'error', message: 'Server error saving record.' });
      });
  };

  const recipients = [
    { title: 'Al-Fuqara (The Poor)', titleAr: 'الْفُقَرَاءِ', desc: 'Those who do not have enough wealth or basic means to meet their daily essential needs.' },
    { title: 'Al-Masakeen (The Needy)', titleAr: 'الْمَسَاكِينِ', desc: 'People in extreme hardship or poverty who cannot cover minimum living costs.' },
    { title: 'Al-Amilina Aleyha (Zakat Administrators)', titleAr: 'الْعَامِلِينَ عَلَيْهَا', desc: 'Appointed individuals responsible for collecting, auditing, and distributing Zakat.' },
    { title: 'Al-Muallafatu Qulubuhum (Reconciling Hearts)', titleAr: 'الْمُؤَلَّفَةِ قُلُوبُهُمْ', desc: 'New Muslims or those whose hearts are being inclined toward Islam and unity.' },
    { title: 'Fir-Riqab (Freeing Captives)', titleAr: 'فِي الرِّقَابِ', desc: 'Assisting in freeing slaves, captives, or victims of forced labor & human trafficking.' },
    { title: 'Al-Gharimina (Debtors in Distress)', titleAr: 'الْغَارِمِينَ', desc: 'People overwhelmed by genuine, non-sinful debts who cannot repay them.' },
    { title: 'Fi Sabilillah (In the Cause of Allah)', titleAr: 'فِي سَبِيلِ اللَّهِ', desc: 'Striving in Islamic education, community welfare, and defending faith/justice.' },
    { title: 'Ibn Al-Sabil (Stranded Travelers)', titleAr: 'وَابْنِ السَّبِيلِ', desc: 'Travelers stranded far from home without access to financial funds.' }
  ];

  const faqs = [
    {
      q: 'What is Nisab and how is it determined?',
      a: 'Nisab is the minimum threshold of net wealth a Muslim must own for one full lunar year (Hawl) before Zakat becomes obligatory. The Silver Nisab is equivalent to 612.36 grams (52.5 Tolas) of silver, while the Gold Nisab is 87.48 grams (7.5 Tolas) of gold.'
    },
    {
      q: 'What is the rate of Zakat payable?',
      a: 'Zakat is calculated at 2.5% (1/40th) of your net zakat-eligible wealth above the Nisab threshold held for a full lunar year.'
    },
    {
      q: 'Do I pay Zakat on gold/silver personal jewelry?',
      a: 'According to the majority of scholars, Zakat is due on all gold and silver held, whether in bars, coins, or jewelry, if it meets or exceeds the Nisab value.'
    },
    {
      q: 'Is Zakat due on personal house or vehicle?',
      a: 'No. Primary residences, personal vehicles, everyday clothes, household furniture, and personal items are exempt from Zakat.'
    },
    {
      q: 'How is Zakat calculated on business inventory?',
      a: 'Zakat is due at 2.5% on the net wholesale value of unsold inventory and goods intended for resale on your Zakat due date.'
    }
  ];

  return (
    <div className="view-container page-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Hero Banner Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(2, 44, 34, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '1.6rem', color: '#f59e0b', fontFamily: 'serif', marginBottom: '0.5rem' }}>
            خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا
          </p>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', marginBottom: '1.25rem' }}>
            "Take from their wealth a charity by which you purify them and cause them increase..." (Surah At-Tawbah 9:103)
          </p>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
            Zakat Calculator & Activity Hub
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
            Calculate your 2.5% annual Zakat accurately, keep history records, and explore authentic guidelines.
          </p>
        </div>
      </section>

      {/* Main Tab Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}
      >
        <button
          onClick={() => setActiveSubTab('calculator')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            background: activeSubTab === 'calculator' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.08)',
            color: activeSubTab === 'calculator' ? '#ffffff' : 'var(--text-main)',
            boxShadow: activeSubTab === 'calculator' ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none'
          }}
        >
          <i className="fas fa-calculator"></i> Zakat Calculator
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            background: activeSubTab === 'history' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.08)',
            color: activeSubTab === 'history' ? '#ffffff' : 'var(--text-main)',
            boxShadow: activeSubTab === 'history' ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none'
          }}
        >
          <i className="fas fa-history"></i> My Zakat History {historyRecords.length > 0 && `(${historyRecords.length})`}
        </button>

        <button
          onClick={() => setActiveSubTab('rules')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            background: activeSubTab === 'rules' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.08)',
            color: activeSubTab === 'rules' ? '#ffffff' : 'var(--text-main)',
            boxShadow: activeSubTab === 'rules' ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none'
          }}
        >
          <i className="fas fa-hands-helping"></i> 8 Eligible Recipients
        </button>

        <button
          onClick={() => setActiveSubTab('virtues')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            background: activeSubTab === 'virtues' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.08)',
            color: activeSubTab === 'virtues' ? '#ffffff' : 'var(--text-main)',
            boxShadow: activeSubTab === 'virtues' ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none'
          }}
        >
          <i className="fas fa-book-open"></i> Virtues & FAQs
        </button>
      </div>

      {/* SECTION 1: ZAKAT CALCULATOR */}
      {activeSubTab === 'calculator' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Inputs Column */}
          <div
            style={{
              background: 'var(--card-bg, rgba(255,255,255,0.04))',
              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              borderRadius: '20px',
              padding: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                <i className="fas fa-coins" style={{ marginRight: '0.5rem' }}></i> Asset Breakdown
              </h3>
              {/* Currency selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--accent-gold)',
                    background: '#022c22',
                    color: 'var(--accent-gold)',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="PKR">PKR (₨)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="SAR">SAR (﷼)</option>
                  <option value="AED">AED</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            {/* Rates settings */}
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '12px',
                padding: '0.85rem',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Gold Rate ({currentSymbol}/gram):
                </label>
                <input
                  type="number"
                  value={goldRateG}
                  onChange={(e) => setGoldRateG(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.2)',
                    color: 'inherit',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Silver Rate ({currentSymbol}/gram):
                </label>
                <input
                  type="number"
                  value={silverRateG}
                  onChange={(e) => setSilverRateG(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.2)',
                    color: 'inherit',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            {/* Input Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Gold Weight (Grams):
                </label>
                <input
                  type="number"
                  placeholder="e.g. 87.5"
                  value={goldGrams}
                  onChange={(e) => setGoldGrams(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                    background: 'rgba(0,0,0,0.15)',
                    color: 'inherit'
                  }}
                />
                {goldValue > 0 && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', marginTop: '2px', display: 'block' }}>
                    Valued at {currentSymbol} {goldValue.toLocaleString()}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Silver Weight (Grams):
                </label>
                <input
                  type="number"
                  placeholder="e.g. 612.5"
                  value={silverGrams}
                  onChange={(e) => setSilverGrams(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                    background: 'rgba(0,0,0,0.15)',
                    color: 'inherit'
                  }}
                />
                {silverValue > 0 && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', marginTop: '2px', display: 'block' }}>
                    Valued at {currentSymbol} {silverValue.toLocaleString()}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Cash in Bank Accounts ({currentSymbol}):
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={cashBank}
                  onChange={(e) => setCashBank(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                    background: 'rgba(0,0,0,0.15)',
                    color: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Cash in Hand ({currentSymbol}):
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={cashHand}
                  onChange={(e) => setCashHand(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                    background: 'rgba(0,0,0,0.15)',
                    color: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Stocks, Shares & Mutual Funds ({currentSymbol}):
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={investments}
                  onChange={(e) => setInvestments(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                    background: 'rgba(0,0,0,0.15)',
                    color: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Business Goods & Inventory ({currentSymbol}):
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={businessStock}
                  onChange={(e) => setBusinessStock(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                    background: 'rgba(0,0,0,0.15)',
                    color: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Receivables / Money Owed to You ({currentSymbol}):
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={receivables}
                  onChange={(e) => setReceivables(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                    background: 'rgba(0,0,0,0.15)',
                    color: 'inherit'
                  }}
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#f87171', marginBottom: '0.35rem' }}>
                  Deductions (Debts & Immediate Liabilities) ({currentSymbol}):
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={debts}
                  onChange={(e) => setDebts(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(239,68,68,0.4)',
                    background: 'rgba(239,68,68,0.05)',
                    color: 'inherit'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
                color: '#ffffff',
                borderRadius: '20px',
                padding: '1.75rem',
                border: '1.5px solid var(--accent-gold)',
                boxShadow: '0 8px 25px rgba(2, 44, 34, 0.3)'
              }}
            >
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', color: 'var(--accent-gold)' }}>
                <i className="fas fa-calculator" style={{ marginRight: '0.5rem' }}></i> Calculation Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>Gross Assets:</span>
                  <span style={{ fontWeight: 700 }}>{currentSymbol} {totalGrossAssets.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                  <span style={{ color: 'rgba(239,68,68,0.9)' }}>Less Debts:</span>
                  <span style={{ fontWeight: 700, color: '#f87171' }}>- {currentSymbol} {totalDebts.toLocaleString()}</span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px dashed rgba(255,255,255,0.2)', margin: '0.2rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800 }}>
                  <span>Net Zakatable Wealth:</span>
                  <span style={{ color: '#34d399' }}>{currentSymbol} {netWealth.toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
                  <span>Silver Nisab Threshold:</span>
                  <span>{currentSymbol} {silverNisabValue.toLocaleString()} (612.36g)</span>
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  background: isEligibleForZakat ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                  border: isEligibleForZakat ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {isEligibleForZakat ? (
                  <>
                    <p style={{ margin: '0 0 0.35rem 0', fontWeight: 800, color: '#34d399', fontSize: '1rem' }}>
                      <i className="fas fa-check-circle"></i> Wealth Exceeds Nisab Threshold
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>
                      Zakat is obligatory (2.5% of net wealth).
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ margin: '0 0 0.35rem 0', fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                      <i className="fas fa-info-circle"></i> Below Silver Nisab Threshold
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
                      Zakat is not mandatory, but voluntary charity (Sadaqah) is rewarded.
                    </p>
                  </>
                )}
              </div>

              {/* Total Payable Box */}
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid var(--accent-gold)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  Total Zakat Due (2.5%)
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', margin: '0.3rem 0' }}>
                  {currentSymbol} {zakatPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Save Record Box */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Record Year:</label>
                  <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                      width: '90px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(0,0,0,0.3)',
                      color: '#ffffff',
                      fontWeight: 700,
                      textAlign: 'center'
                    }}
                  />
                </div>

                <button
                  onClick={handleSaveRecord}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <i className="fas fa-save"></i> Save Record to Zakat History
                </button>

                {saveStatus && (
                  <p
                    style={{
                      marginTop: '0.75rem',
                      marginBottom: 0,
                      fontSize: '0.82rem',
                      textAlign: 'center',
                      color: saveStatus.type === 'error' ? '#f87171' : saveStatus.type === 'success' ? '#34d399' : 'var(--accent-gold)'
                    }}
                  >
                    {saveStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ZAKAT HISTORY */}
      {activeSubTab === 'history' && (
        <div
          style={{
            background: 'var(--card-bg, rgba(255,255,255,0.04))',
            border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
            borderRadius: '20px',
            padding: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--accent-gold)' }}>
              <i className="fas fa-history" style={{ marginRight: '0.5rem' }}></i> My Saved Zakat Records
            </h3>
            {user && (
              <button
                onClick={() => setActiveSubTab('calculator')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '20px',
                  border: '1px solid var(--accent-gold)',
                  background: 'rgba(245,158,11,0.15)',
                  color: 'var(--accent-gold)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                + Calculate New Entry
              </button>
            )}
          </div>

          {!user ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <i className="fas fa-user-lock" style={{ fontSize: '3rem', color: 'var(--accent-gold)', marginBottom: '1rem' }}></i>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Log In to View & Save History</h4>
              <p style={{ color: 'var(--text-muted, rgba(255,255,255,0.7))', maxWidth: '450px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
                Create a free account or log in to keep a private record of your annual Zakat payments across past years.
              </p>
              <button
                onClick={() => openAuthModal && openAuthModal('login')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#ffffff',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Sign In Now
              </button>
            </div>
          ) : loadingHistory ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.7)' }}>Loading your Zakat records...</p>
          ) : historyRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '16px' }}>
              <i className="fas fa-folder-open" style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}></i>
              <p style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>No saved Zakat records yet.</p>
              <button
                onClick={() => setActiveSubTab('calculator')}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'var(--accent-gold)',
                  color: '#000000',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Calculate & Save Year {selectedYear} Zakat
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(245,158,11,0.3)', color: 'var(--accent-gold)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Year</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Assets</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Zakat Payable (2.5%)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRecords.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>{item.year}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{currentSymbol} {parseFloat(item.total_assets || 0).toLocaleString()}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#34d399' }}>
                        {currentSymbol} {parseFloat(item.zakat_payable || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontSize: '0.78rem', fontWeight: 700 }}>
                          Saved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: 8 ELIGIBLE RECIPIENTS */}
      {activeSubTab === 'rules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #022c22, #064e3b)',
              padding: '1.5rem',
              borderRadius: '20px',
              color: '#ffffff',
              border: '1px solid rgba(245,158,11,0.3)'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-gold)', fontSize: '1.3rem' }}>
              The 8 Categories of Zakat Recipients (Masroof-e-Zakat)
            </h3>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              The Holy Quran explicitly specifies eight categories of people eligible to receive Zakat in Surah At-Tawbah (9:60):
            </p>
            <p style={{ margin: '0.75rem 0 0 0', fontStyle: 'italic', fontSize: '0.9rem', color: '#f59e0b', fontFamily: 'serif' }}>
              إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ ۖ فَرِيضَةً مِّنَ اللَّهِ ۗ وَاللَّهُ عَلِيمٌ حَكِيمٌ
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {recipients.map((r, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--card-bg, rgba(255,255,255,0.04))',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(245,158,11,0.2)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontFamily: 'serif', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    {r.titleAr}
                  </span>
                </div>
                <h4 style={{ margin: '0.2rem 0', fontSize: '1.05rem', fontWeight: 800 }}>{r.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, rgba(255,255,255,0.75))', lineHeight: 1.5 }}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: VIRTUES & FAQS */}
      {activeSubTab === 'virtues' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Qur'an & Hadith Verses */}
          <div
            style={{
              background: 'var(--card-bg, rgba(255,255,255,0.04))',
              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              borderRadius: '20px',
              padding: '1.75rem'
            }}
          >
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--accent-gold)', fontSize: '1.25rem' }}>
              <i className="fas fa-book-open" style={{ marginRight: '0.5rem' }}></i> Virtues of Zakat in Islam
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem' }}>
                <p style={{ margin: '0 0 0.35rem 0', fontWeight: 700, fontSize: '0.95rem' }}>
                  Surah Al-Baqarah (2:277)
                </p>
                <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
                  "Indeed, those who believe and do righteous deeds and establish prayer and give Zakat will have their reward with their Lord, and there will be no fear concerning them, nor will they grieve."
                </p>
              </div>

              <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem' }}>
                <p style={{ margin: '0 0 0.35rem 0', fontWeight: 700, fontSize: '0.95rem' }}>
                  Sahih al-Bukhari #1403
                </p>
                <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
                  The Prophet ﷺ said: "Charity does not decrease wealth." Zakat cleanses your remaining wealth, invites Divine blessings (Barakah), and protects from distress.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div
            style={{
              background: 'var(--card-bg, rgba(255,255,255,0.04))',
              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              borderRadius: '20px',
              padding: '1.75rem'
            }}
          >
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--accent-gold)', fontSize: '1.25rem' }}>
              <i className="fas fa-question-circle" style={{ marginRight: '0.5rem' }}></i> Frequently Asked Questions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((f, idx) => (
                <details
                  key={idx}
                  style={{
                    background: 'rgba(0,0,0,0.15)',
                    borderRadius: '12px',
                    padding: '0.85rem 1.1rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer'
                  }}
                >
                  <summary style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', outline: 'none' }}>
                    {f.q}
                  </summary>
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
