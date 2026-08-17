import React, { useState, useRef, useEffect } from 'react';

const THEMES = [
  { id: 'emerald', name: 'Emerald & Gold', bg1: '#022c22', bg2: '#064e3b', textCol: '#fef3c7', goldCol: '#f59e0b', borderCol: 'rgba(245, 158, 11, 0.4)' },
  { id: 'velvet', name: 'Royal Velvet', bg1: '#2e1065', bg2: '#4c1d95', textCol: '#faf5ff', goldCol: '#fbbf24', borderCol: 'rgba(251, 191, 36, 0.4)' },
  { id: 'midnight', name: 'Midnight Sapphire', bg1: '#0f172a', bg2: '#1e293b', textCol: '#f8fafc', goldCol: '#38bdf8', borderCol: 'rgba(56, 189, 248, 0.4)' },
  { id: 'amber', name: 'Sunset Amber', bg1: '#451a03', bg2: '#78350f', textCol: '#fffbeb', goldCol: '#f59e0b', borderCol: 'rgba(245, 158, 11, 0.4)' }
];

export default function SocialCardModal({ isOpen, onClose, initialData }) {
  const [theme, setTheme] = useState(THEMES[0]);
  const [arabicText, setArabicText] = useState(initialData?.textArabic || 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
  const [transText, setTransText] = useState(initialData?.textEnglish || 'In the name of Allah, the Entirely Merciful, the Especially Merciful.');
  const [reference, setReference] = useState(initialData?.reference || 'Surah Al-Fatiha [1:1] • Maktaba tul Muslim');
  const [showArabic, setShowArabic] = useState(true);
  const [showTrans, setShowTrans] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      if (initialData.textArabic) setArabicText(initialData.textArabic);
      if (initialData.textEnglish || initialData.textUrdu || initialData.textBrahui) {
        setTransText(initialData.textEnglish || initialData.textUrdu || initialData.textBrahui);
      }
      if (initialData.reference) setReference(initialData.reference);
    }
  }, [initialData]);

  // Draw on Canvas whenever state changes
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, theme.bg1);
    grad.addColorStop(1, theme.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Islamic Geometric Frame / Border
    ctx.strokeStyle = theme.goldCol;
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // Corner Ornaments
    const drawCorner = (x, y) => {
      ctx.fillStyle = theme.goldCol;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(40, 40);
    drawCorner(width - 40, 40);
    drawCorner(40, height - 40);
    drawCorner(width - 40, height - 40);

    // Top Bismillah Calligraphy Banner
    ctx.fillStyle = theme.goldCol;
    ctx.font = '700 36px "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.fillText('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', width / 2, 120);

    let currentY = 240;

    // Render Arabic Text
    if (showArabic && arabicText) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 48px "Amiri", serif';
      ctx.direction = 'rtl';
      
      const words = arabicText.split(' ');
      let line = '';
      const lines = [];
      const maxWidth = 900;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      lines.forEach((l) => {
        ctx.fillText(l.trim(), width / 2, currentY);
        currentY += 75;
      });
      currentY += 30;
    }

    // Divider Line
    ctx.strokeStyle = theme.goldCol;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 150, currentY);
    ctx.lineTo(width / 2 + 150, currentY);
    ctx.stroke();
    currentY += 70;

    // Render Translation Text
    if (showTrans && transText) {
      ctx.fillStyle = theme.textCol;
      ctx.font = '400 32px "Outfit", sans-serif';
      ctx.direction = 'ltr';

      const words = transText.split(' ');
      let line = '';
      const lines = [];
      const maxWidth = 880;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      lines.forEach((l) => {
        ctx.fillText(l.trim(), width / 2, currentY);
        currentY += 50;
      });
    }

    // Footer Watermark & Reference
    ctx.fillStyle = theme.goldCol;
    ctx.font = '600 28px "Outfit", sans-serif';
    ctx.direction = 'ltr';
    ctx.fillText(reference || 'Maktaba tul Muslim • maktabatulmuslim.com', width / 2, height - 100);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '400 22px "Outfit", sans-serif';
    ctx.fillText('maktabatulmuslim.com', width / 2, height - 60);

  }, [isOpen, theme, arabicText, transText, reference, showArabic, showTrans]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `maktaba_card_${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'maktaba_card.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Maktaba tul Muslim Card',
            text: reference,
            files: [file]
          });
        } else {
          handleDownload();
        }
      });
    } catch (e) {
      handleDownload();
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: '#09090b', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '20px',
        maxWidth: '1000px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)', color: '#fff'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
          <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '1.4rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-[#f59e0b] fa-palette"></i> Create Social Media Image Card
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Controls Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: '600' }}>Select Color Theme:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t)}
                    style={{
                      padding: '0.6rem', borderRadius: '10px', border: theme.id === t.id ? `2px solid ${t.goldCol}` : '1px solid rgba(255,255,255,0.1)',
                      background: `linear-gradient(135deg, ${t.bg1}, ${t.bg2})`, color: t.textCol, fontWeight: '600', cursor: 'pointer',
                      fontSize: '0.82rem', textAlign: 'center', boxShadow: theme.id === t.id ? `0 0 10px ${t.goldCol}` : 'none'
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: '600' }}>Arabic Verse / Text:</label>
              <textarea
                value={arabicText}
                onChange={(e) => setArabicText(e.target.value)}
                rows={3}
                style={{ width: '100%', background: '#18181b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff', padding: '0.6rem', fontFamily: 'Amiri, serif', fontSize: '1.1rem', direction: 'rtl' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: '600' }}>Translation Text:</label>
              <textarea
                value={transText}
                onChange={(e) => setTransText(e.target.value)}
                rows={3}
                style={{ width: '100%', background: '#18181b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff', padding: '0.6rem', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: '600' }}>Reference / Watermark:</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                style={{ width: '100%', background: '#18181b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff', padding: '0.6rem', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <input type="checkbox" checked={showArabic} onChange={(e) => setShowArabic(e.target.checked)} /> Arabic
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <input type="checkbox" checked={showTrans} onChange={(e) => setShowTrans(e.target.checked)} /> Translation
              </label>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={handleDownload}
                style={{
                  flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000',
                  fontWeight: '700', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(245,158,11,0.3)'
                }}
              >
                <i className="fas fa-download"></i> Download HD Image
              </button>
              <button
                onClick={handleShare}
                style={{
                  padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.1)', color: '#fff',
                  fontWeight: '600', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <i className="fas fa-share-alt"></i> Share
              </button>
            </div>
          </div>

          {/* Canvas Preview Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '600' }}>Live 1080x1080 Preview:</label>
            <canvas
              ref={canvasRef}
              style={{
                width: '100%', maxWidth: '400px', height: 'auto', aspectRatio: '1/1',
                borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
