import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, BookOpen, Clock, Heart, Sparkles } from 'lucide-react';

export default function DailyAzkarView() {
  const { t } = useLanguage();

  const azkarSections = [
    {
      id: 'post-prayer',
      title: 'Post-Prayer Azkar (After every Fard Salah)',
      titleUrdu: 'ہر فرض نماز کے بعد کے اذکار',
      icon: <Clock size={24} style={{ color: '#059669' }} />,
      content: [
        {
          arabic: 'أَسْتَغْفِرُ اللَّهَ (ثلاثاً)',
          transliteration: 'Astaghfirullah (3 times)',
          translation: 'I seek the forgiveness of Allah.',
          urdu: 'میں اللہ سے بخشش مانگتا ہوں۔'
        },
        {
          arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
          transliteration: 'Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram.',
          translation: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.',
          urdu: 'اے اللہ! تو ہی سلامتی والا ہے اور تیری ہی طرف سے سلامتی ہے، تو بہت برکت والا ہے اے جلال اور بزرگی والے۔'
        },
        {
          arabic: 'سُبْحَانَ اللَّهِ (٣٣)، الْحَمْدُ لِلَّهِ (٣٣)، اللَّهُ أَكْبَرُ (٣٤)',
          transliteration: 'Subhanallah (33), Alhamdulillah (33), Allahu Akbar (34)',
          translation: 'Glory is to Allah, praise is to Allah, Allah is the Greatest.',
          urdu: 'اللہ پاک ہے (33 دفعہ)، سب تعریفیں اللہ کے لیے ہیں (33 دفعہ)، اللہ سب سے بڑا ہے (34 دفعہ)۔'
        }
      ],
      fazeelatEn: 'Prophet Muhammad (SAW) said: "Whoever recites these after every obligatory prayer will never be disappointed."',
      fazeelatUr: 'نبی کریم ﷺ نے فرمایا: "جو شخص ہر فرض نماز کے بعد ان کلمات کو پڑھے گا وہ کبھی نامراد نہیں ہوگا۔"'
    },
    {
      id: 'ishraq',
      title: 'Ishraq Prayer (2 Rakaat After Sunrise)',
      titleUrdu: 'نمازِ اشراق (سورج نکلنے کے بعد 2 رکعت)',
      icon: <Sun size={24} style={{ color: '#d97706' }} />,
      content: [],
      fazeelatEn: 'Prophet Muhammad (SAW) said: "Whoever prays Fajr in congregation, then sits remembering Allah until the sun rises, then prays two rak\'ahs, will have a reward like that of Hajj and Umrah, complete, complete, complete." (Tirmidhi)',
      fazeelatUr: 'نبی کریم ﷺ نے فرمایا: "جس نے فجر کی نماز باجماعت پڑھی، پھر سورج نکلنے تک بیٹھ کر اللہ کا ذکر کیا، پھر دو رکعت (اشراق) پڑھی، تو اسے ایک مکمل حج اور عمرہ کا ثواب ملے گا۔" (ترمذی)'
    },
    {
      id: 'kahf',
      title: 'Surah Al-Kahf (Every Friday)',
      titleUrdu: 'سورۃ الکہف (ہر جمعہ کے دن)',
      icon: <BookOpen size={24} style={{ color: '#2563eb' }} />,
      content: [],
      fazeelatEn: 'Prophet Muhammad (SAW) said: "Whoever reads Surah Al-Kahf on the day of Jumu\'ah, will have a light that will shine from him from one Friday to the next." (Al-Hakim)',
      fazeelatUr: 'نبی کریم ﷺ نے فرمایا: "جس نے جمعہ کے دن سورۃ الکہف پڑھی، اس کے لیے دونوں جمعوں کے درمیان ایک نور روشن ہو جاتا ہے۔" (حاکم)'
    },
    {
      id: 'asr-maghrib',
      title: 'Dua from Asr to Maghrib (Golden Hour)',
      titleUrdu: 'عصر سے مغرب کے درمیان کی دعائیں',
      icon: <Sparkles size={24} style={{ color: '#7c3aed' }} />,
      content: [
        {
          arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
          transliteration: 'Ya Hayyu Ya Qayyum, bi-rahmatika astagheeth, ashlih li sha’ni kullahu, wa la takilni ila nafsi tarfata ‘ayn.',
          translation: 'O Ever-Living One, O Sustainer of all that exists, by Your mercy I seek assistance. Rectify all my affairs and do not entrust me to myself for even the blink of an eye.',
          urdu: 'اے ہمیشہ زندہ رہنے والے، اے سب کو قائم رکھنے والے! میں تیری رحمت کے وسیلے سے فریاد کرتا ہوں، میرے تمام کام درست فرما دے اور مجھے پلک جھپکنے کے برابر بھی میرے نفس کے حوالے نہ کر۔'
        }
      ],
      fazeelatEn: 'The time between Asr and Maghrib (especially on Friday) is a highly blessed time where Duas are accepted. Engaging in Istighfar and this comprehensive Dua is highly recommended.',
      fazeelatUr: 'عصر سے مغرب کا وقت (خاص طور پر جمعہ کے دن) نہایت بابرکت ہے جس میں دعائیں قبول ہوتی ہیں۔ اس وقت استغفار اور یہ جامع دعا پڑھنا بہت مستحب ہے۔'
    }
  ];

  return (
    <div style={{ background: 'var(--bg-main, #fdfbf7)', minHeight: '90vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          borderRadius: '24px', padding: '3rem 2rem', color: '#fff',
          textAlign: 'center', marginBottom: '3rem',
          border: '2px solid #34d399', boxShadow: '0 12px 35px rgba(0,0,0,0.15)'
        }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 1rem', color: '#ffffff' }}>
            Daily Reminders & Azkar
          </h1>
          <p style={{ color: '#d1fae5', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Authentic supplications, post-prayer Azkar, and special daily/weekly reminders to keep your tongue moist with the remembrance of Allah.
          </p>
        </div>

        {/* Azkar Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {azkarSections.map((section) => (
            <div key={section.id} id={section.id} style={{
              background: '#ffffff', borderRadius: '20px', padding: '2rem',
              border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                  {section.icon}
                </div>
                <div>
                  <h2 style={{ margin: '0 0 0.3rem', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{section.title}</h2>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Amiri, serif', color: '#059669' }}>{section.titleUrdu}</h3>
                </div>
              </div>

              {section.content.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                  {section.content.map((dua, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <p style={{ margin: '0 0 1rem', fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Amiri, serif', color: '#0f172a', textAlign: 'right', lineHeight: 1.8 }}>
                        {dua.arabic}
                      </p>
                      <p style={{ margin: '0 0 0.75rem', fontSize: '1rem', color: '#059669', fontStyle: 'italic', fontWeight: 600 }}>
                        {dua.transliteration}
                      </p>
                      <p style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
                        <strong>Meaning:</strong> {dua.translation}
                      </p>
                      <p style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontFamily: 'Amiri, serif', textAlign: 'right' }}>
                        {dua.urdu}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)', padding: '1.25rem', borderRadius: '16px', borderLeft: '5px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Heart size={18} style={{ color: '#10b981' }} />
                  <span style={{ fontWeight: 800, color: '#065f46', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Virtue & Fazeelat</span>
                </div>
                <p style={{ margin: '0 0 0.75rem', color: '#047857', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                  {section.fazeelatEn}
                </p>
                <p style={{ margin: 0, color: '#064e3b', fontSize: '1.1rem', fontFamily: 'Amiri, serif', textAlign: 'right' }}>
                  {section.fazeelatUr}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
