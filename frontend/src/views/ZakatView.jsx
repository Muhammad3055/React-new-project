import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calculator, DollarSign, Coins, Landmark, Building2, TrendingUp, CreditCard, Sparkles, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export default function ZakatView() {
  const { t } = useLanguage();
  const [currency, setCurrency] = useState('PKR');
  const [nisabStandard, setNisabStandard] = useState('silver'); // 'silver' or 'gold'
  
  // Asset Inputs
  const [cashOnHand, setCashOnHand] = useState('');
  const [bankBalance, setBankBalance] = useState('');
  const [goldGrams, setGoldGrams] = useState('');
  const [silverGrams, setSilverGrams] = useState('');
  const [goldRatePerGram, setGoldRatePerGram] = useState('24000'); // PKR default estimate
  const [silverRatePerGram, setSilverRatePerGram] = useState('300');
  const [investments, setInvestments] = useState('');
  const [businessInventory, setBusinessInventory] = useState('');
  const [owedToYou, setOwedToYou] = useState('');
  
  // Liabilities
  const [debtsOwed, setDebtsOwed] = useState('');
  const [immediateExpenses, setImmediateExpenses] = useState('');

  // Currency Symbols & Nisab Constants
  const currencySymbols = { PKR: 'Rs.', USD: '$', SAR: 'SR', AED: 'AED', INR: '₹' };
  const symbol = currencySymbols[currency] || 'Rs.';

  // Nisab Values in Grams: Gold = 87.48g (7.5 Tolas), Silver = 612.36g (52.5 Tolas)
  const GOLD_NISAB_GRAMS = 87.48;
  const SILVER_NISAB_GRAMS = 612.36;

  const goldRate = parseFloat(goldRatePerGram) || 0;
  const silverRate = parseFloat(silverRatePerGram) || 0;

  const nisabThreshold = nisabStandard === 'silver' 
    ? SILVER_NISAB_GRAMS * silverRate 
    : GOLD_NISAB_GRAMS * goldRate;

  // Total Assets Calculation
  const totalCash = (parseFloat(cashOnHand) || 0) + (parseFloat(bankBalance) || 0);
  const totalGoldVal = (parseFloat(goldGrams) || 0) * goldRate;
  const totalSilverVal = (parseFloat(silverGrams) || 0) * silverRate;
  const totalInvestmentsVal = parseFloat(investments) || 0;
  const totalBusinessVal = parseFloat(businessInventory) || 0;
  const totalReceivables = parseFloat(owedToYou) || 0;

  const totalGrossAssets = totalCash + totalGoldVal + totalSilverVal + totalInvestmentsVal + totalBusinessVal + totalReceivables;

  // Total Liabilities Calculation
  const totalLiabilities = (parseFloat(debtsOwed) || 0) + (parseFloat(immediateExpenses) || 0);

  // Net Wealth & Zakat Calculation
  const netWealth = Math.max(0, totalGrossAssets - totalLiabilities);
  const isEligible = netWealth >= nisabThreshold && nisabThreshold > 0;
  const zakatPayable = isEligible ? netWealth * 0.025 : 0;

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '2.5rem',
          border: '2px solid #f59e0b', boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.4)', marginBottom: '1rem' }}>
            <Sparkles size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Sharia Compliant Zakat Engine
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
            Zakat &amp; Nisab Calculator
          </h1>
          <p style={{ color: '#a7f3d0', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Accurately calculate your annual Zakat (2.5%) based on authentic Islamic jurisprudence for cash, gold, silver, investments, and business assets.
          </p>
        </div>

        {/* ── Settings Bar: Currency & Nisab Threshold Selector ── */}
        <div style={{
          background: '#ffffff', borderRadius: '20px', padding: '1.5rem',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center'
        }}>
          {/* Currency Choice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: '#334155', fontSize: '0.92rem' }}>Select Currency:</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['PKR', 'USD', 'SAR', 'AED', 'INR'].map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  style={{
                    padding: '6px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                    background: currency === cur ? '#059669' : '#f1f5f9',
                    color: currency === cur ? '#ffffff' : '#475569',
                    border: 'none', transition: 'all 0.2s'
                  }}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          {/* Nisab Basis Standard Choice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: '#334155', fontSize: '0.92rem' }}>Nisab Standard:</span>
            <button
              onClick={() => setNisabStandard('silver')}
              style={{
                padding: '6px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                background: nisabStandard === 'silver' ? '#d97706' : '#f1f5f9',
                color: nisabStandard === 'silver' ? '#ffffff' : '#475569',
                border: 'none', transition: 'all 0.2s'
              }}
            >
              Silver Nisab (612.36g / Recommended)
            </button>
            <button
              onClick={() => setNisabStandard('gold')}
              style={{
                padding: '6px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                background: nisabStandard === 'gold' ? '#d97706' : '#f1f5f9',
                color: nisabStandard === 'gold' ? '#ffffff' : '#475569',
                border: 'none', transition: 'all 0.2s'
              }}
            >
              Gold Nisab (87.48g)
            </button>
          </div>
        </div>

        {/* ── Main Inputs Grid & Live Results Panel ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

          {/* Left Column: Assets & Liabilities Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* 1. Cash & Bank */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: '#059669' }}>
                <DollarSign size={20} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Cash &amp; Liquid Funds</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Cash on Hand ({symbol}):</label>
                  <input type="number" placeholder="0" value={cashOnHand} onChange={(e) => setCashOnHand(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Bank Accounts &amp; Savings ({symbol}):</label>
                  <input type="number" placeholder="0" value={bankBalance} onChange={(e) => setBankBalance(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* 2. Gold & Silver */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: '#d97706' }}>
                <Coins size={20} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Gold &amp; Silver Assets</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Gold (Grams):</label>
                  <input type="number" placeholder="0" value={goldGrams} onChange={(e) => setGoldGrams(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Gold Rate ({symbol}/gram):</label>
                  <input type="number" value={goldRatePerGram} onChange={(e) => setGoldRatePerGram(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Silver (Grams):</label>
                  <input type="number" placeholder="0" value={silverGrams} onChange={(e) => setSilverGrams(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Silver Rate ({symbol}/gram):</label>
                  <input type="number" value={silverRatePerGram} onChange={(e) => setSilverRatePerGram(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* 3. Investments & Business */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: '#2563eb' }}>
                <TrendingUp size={20} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Investments &amp; Business Stock</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Stocks / Mutual Funds / Crypto ({symbol}):</label>
                  <input type="number" placeholder="0" value={investments} onChange={(e) => setInvestments(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Business Trade Stock &amp; Goods ({symbol}):</label>
                  <input type="number" placeholder="0" value={businessInventory} onChange={(e) => setBusinessInventory(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Money Owed To You ({symbol}):</label>
                  <input type="number" placeholder="0" value={owedToYou} onChange={(e) => setOwedToYou(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* 4. Deductible Liabilities */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: '#dc2626' }}>
                <CreditCard size={20} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Deductible Debts &amp; Expenses</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Debts You Owe ({symbol}):</label>
                  <input type="number" placeholder="0" value={debtsOwed} onChange={(e) => setDebtsOwed(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Immediate Due Bills/Expenses ({symbol}):</label>
                  <input type="number" placeholder="0" value={immediateExpenses} onChange={(e) => setImmediateExpenses(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Zakat Summary Card */}
          <div>
            <div style={{
              position: 'sticky', top: '100px', background: '#022c22', borderRadius: '24px',
              padding: '2rem', color: '#ffffff', border: '2px solid #f59e0b',
              boxShadow: '0 12px 35px rgba(2,44,34,0.3)'
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1.25rem', color: '#fcd34d', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                Zakat Calculation Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                <div style={rowStyle}>
                  <span style={{ color: '#a7f3d0' }}>Gross Wealth:</span>
                  <span style={{ fontWeight: 700 }}>{symbol} {totalGrossAssets.toLocaleString()}</span>
                </div>
                <div style={rowStyle}>
                  <span style={{ color: '#fca5a5' }}>Deductible Liabilities:</span>
                  <span style={{ fontWeight: 700 }}>- {symbol} {totalLiabilities.toLocaleString()}</span>
                </div>
                <div style={{ ...rowStyle, paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)', fontSize: '1.05rem', fontWeight: 800 }}>
                  <span style={{ color: '#ffffff' }}>Net Zakatable Wealth:</span>
                  <span style={{ color: '#fcd34d' }}>{symbol} {netWealth.toLocaleString()}</span>
                </div>
                <div style={rowStyle}>
                  <span style={{ color: '#cbd5e1' }}>Nisab Threshold ({nisabStandard}):</span>
                  <span style={{ fontWeight: 700, color: '#93c5fd' }}>{symbol} {nisabThreshold.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                background: isEligible ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: isEligible ? '1px solid #10b981' : '1px solid #ef4444',
                borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center'
              }}>
                {isEligible ? (
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
                      <CheckCircle2 size={18} /> Zakat is Obligatory (Fard)
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#a7f3d0' }}>
                      Your net wealth meets or exceeds the Nisab threshold.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
                      <Info size={18} /> Below Nisab Threshold
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#fca5a5' }}>
                      Zakat is not obligatory at this time as net wealth is below Nisab.
                    </p>
                  </div>
                )}
              </div>

              {/* Final Amount Box */}
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '18px', padding: '1.5rem', textAlign: 'center', color: '#ffffff',
                boxShadow: '0 8px 20px rgba(245,158,11,0.3)'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
                  Total Zakat Payable (2.5%)
                </span>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '4px' }}>
                  {symbol} {zakatPayable.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '0.65rem 0.9rem', borderRadius: '12px',
  border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.9rem',
  color: '#1e293b', background: '#f8fafc'
};

const rowStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};
