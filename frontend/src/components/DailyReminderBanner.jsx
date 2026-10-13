import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Authentic Post-Prayer Duas with Complete Arabic, Urdu/English Meanings, and Fazeelat (Benefits)
const PRAYER_DUAS = {
  fajr: {
    id: 'dua_fajr',
    prayerKey: 'fajr',
    prayerName: 'Fajr (نمازِ فجر)',
    titleUrdu: 'نمازِ فجر کے بعد کی مسنون دعا اور اذکار',
    titleEn: 'Post-Fajr Prayer Sunnah Dua & Azkar',
    timingDesc: 'فجر کے 40 منٹ بعد سے 1 گھنٹے تک کے لیے مخصوص',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    translationUrdu: 'اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ اور حلال رزق، اور قبول ہونے والے عمل کا سوال کرتا ہوں۔',
    translationEn: 'O Allah, I ask You for beneficial knowledge, good (lawful) sustenance, and deeds that are accepted.',
    fazeelatUrdu: 'حضرت ام سلمہ رضی اللہ عنہا بیان فرماتی ہیں کہ رسول اللہ ﷺ فجر کی نماز کے سلام پھیرنے کے بعد روزانہ یہ دعا پڑھا کرتے تھے۔ (سنن ابن ماجہ: 925، مسند احمد: 26521 - صحیح)',
    whyReciteUrdu: 'کیوں پڑھیں؟ صبح سویرے دن کا آغاز اگر نفع بخش علم، حلال روزی اور مقبول اعمال کی دعا سے ہو تو پورا دن اللہ کی حفاظت، خیر و برکت اور رزق میں وسعت میں گزرتا ہے۔',
    fazeelatEn: 'The Prophet ﷺ used to recite this supplication every morning after the Taslim of Fajr prayer (Sunan Ibn Majah: 925). It seeks divine blessing for beneficial knowledge, halal livelihood, and accepted righteous deeds at the dawn of the day.',
    hadithRef: 'سنن ابن ماجہ: 925 • مسند احمد: 26521'
  },
  zuhr: {
    id: 'dua_zuhr',
    prayerKey: 'zuhr',
    prayerName: 'Zuhr (نمازِ ظہر)',
    titleUrdu: 'نمازِ ظہر کے بعد کی مسنون دعا اور استقامت کے کلمات',
    titleEn: 'Post-Zuhr Prayer Sunnah Dua & Steadfastness',
    timingDesc: 'ظہر کے 40 منٹ بعد سے 1 گھنٹہ 30 منٹ تک کے لیے مخصوص',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    translationUrdu: 'اے اللہ! اپنے ذکر، اپنے شکر، اور اپنی بہترین عبادت کرنے پر میری مدد فرما۔',
    translationEn: 'O Allah, assist me in remembering You, expressing gratitude to You, and performing Your worship in the best manner.',
    fazeelatUrdu: 'رسول اللہ ﷺ نے حضرت معاذ بن جبل رضی اللہ عنہ کا ہاتھ پکڑ کر فرمایا: "اے معاذ! واللہ میں تم سے محبت کرتا ہوں، لہٰذا ہر نماز کے بعد یہ دعا پڑھنا کبھی نہ چھوڑنا۔" (سنن ابو داؤد: 1522، سنن نسائی: 1303 - صحیح)',
    whyReciteUrdu: 'کیوں پڑھیں؟ دن کے درمیانی حصے میں جب انسان روزمرہ کے کام کاج، کاروبار اور مصروفیات میں تھک جاتا ہے، یہ دعا انسان کو غفلت سے بیدار رکھتی ہے اور شکر و عبادت پر ثابت قدم بناتی ہے۔',
    fazeelatEn: 'The Messenger of Allah ﷺ took Mu\'adh ibn Jabal (RA) by the hand and said: "O Mu\'adh, by Allah I love you, so never forget to recite this after every obligatory prayer" (Sunan Abi Dawud: 1522). It grants steadfastness in divine remembrance and gratefulness.',
    hadithRef: 'سنن ابو داؤد: 1522 • سنن نسائی: 1303'
  },
  asr: {
    id: 'dua_asr',
    prayerKey: 'asr',
    prayerName: 'Asr (نمازِ عصر)',
    titleUrdu: 'نمازِ عصر کے بعد کی مسنون دعا اور توحید کے کلمات',
    titleEn: 'Post-Asr Prayer Sunnah Dua & Affirmation of Tawheed',
    timingDesc: 'عصر کے 1 گھنٹے بعد سے 1 گھنٹے تک کے لیے مخصوص',
    arabic: 'لَا إِلَـٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    translationUrdu: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کے لیے سب تعریف ہے اور وہ ہر چیز پر کامل قدرت رکھتا ہے۔ اے اللہ! جو تو عطا فرمائے اسے کوئی روکنے والا نہیں، اور جسے تو روک لے اسے کوئی دینے والا نہیں، اور کسی صاحبِ حیثیت کو اس کی حیثیت تیرے سامنے کچھ نفع نہیں دے سکتی۔',
    translationEn: 'None has the right to be worshipped but Allah alone, Who has no partner. His is the dominion and His is the praise, and He has power over all things. O Allah, none can prevent what You give, and none can give what You prevent, and no fortune can benefit its possessor against You.',
    fazeelatUrdu: 'صحیح بخاری (844) اور صحیح مسلم (593) میں حضرت مغیرہ بن شعبہ رضی اللہ عنہ سے مروی ہے کہ نبی کریم ﷺ ہر فرض نماز کے سلام کے بعد یہ کلمات باقاعدگی سے فرماتے تھے۔',
    whyReciteUrdu: 'کیوں پڑھیں؟ نمازِ عصر کے بعد دن کی محنت و مشقت کا اختتام ہوتا ہے۔ اس دعا میں خالص توحید کا اقرار، اللہ کے فیصلوں پر راضی رہنے اور دل سے لالچ و تکبر کو مٹانے کی بے پایاں برکت ہے۔',
    fazeelatEn: 'Narrated by Al-Mughira bin Shu\'ba (RA) in Sahih Al-Bukhari (844) and Sahih Muslim (593) that the Prophet ﷺ regularly supplicated with these words after finishing Fard Salah. It instills absolute trust in Allah\'s decrees and sovereignty.',
    hadithRef: 'صحیح بخاری: 844 • صحیح مسلم: 593'
  },
  asr_to_maghrib: {
    id: 'dua_asr_maghrib',
    prayerKey: 'asr_to_maghrib',
    prayerName: 'Asr to Maghrib (عصر تا مغرب)',
    titleUrdu: 'عصر تا مغرب خصوصی مسنون دعا (غروبِ آفتاب کا قبولیت والا وقت)',
    titleEn: 'Golden Hour Supplication (Asr to Maghrib — Prime Acceptance Hour)',
    timingDesc: 'عصر کی دعا کے وقت سے لے کر غروبِ آفتاب (مغرب کی اذان) تک جاری رہنے والی دعا',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ',
    translationUrdu: 'اے ہمیشہ زندہ رہنے والے، اے کائنات کو سنبھالنے اور قائم رکھنے والے! میں تیری ہی رحمت کے وسیلے سے فریاد کرتا ہوں، میرے تمام احوال و معاملات درست فرما دے اور مجھے پلک جھپکنے کے برابر بھی میرے نفس کے حوالے نہ فرما۔',
    translationEn: 'O Ever-Living One, O Self-Existing Sustainer of all! By Your mercy I seek assistance. Rectify for me all of my affairs and do not leave me to myself even for the blink of an eye.',
    fazeelatUrdu: 'نبی کریم ﷺ نے اپنی چہیتی بیٹی سیدہ فاطمۃ الزہراء رضی اللہ عنہا کو وصیت فرمائی کہ صبح اور شام اس دعا کو کبھی نہ چھوڑیں (سنن نسائی: 10405، مستدرک حاکم: 1/545 - صحیح)۔',
    whyReciteUrdu: 'کیوں پڑھیں؟ عصر سے مغرب تک کا وقت شام کا مبارک وقت اور روزانہ قبولیتِ دعا کی گھڑی ہے۔ اس دعا سے ہر قسم کی پریشانی، بے چینی، گھریلو و مالی الجھنیں دور ہوتی ہیں اور اللہ تعالیٰ کی فوری مدد حاصل ہوتی ہے۔',
    fazeelatEn: 'The Prophet ﷺ advised his daughter Sayyidah Fatimah (RA) to never leave this dua in the morning and evening (Sunan An-Nasa\'i: 10405). The period before sunset is the prime time of accepted prayers and divine protection against distress.',
    hadithRef: 'سنن نسائی: 10405 • مستدرک حاکم: 1/545'
  },
  maghrib: {
    id: 'dua_maghrib',
    prayerKey: 'maghrib',
    prayerName: 'Maghrib (نمازِ مغرب)',
    titleUrdu: 'نمازِ مغرب کے بعد کی مسنون دعا (جہنم کی آگ سے نجات)',
    titleEn: 'Post-Maghrib Prayer Sunnah Dua (Protection from the Fire)',
    timingDesc: 'مغرب کے وقت شروع ہو کر 30 منٹ تک کے لیے مخصوص',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ (۷ مرتبه) • اللَّهُمَّ هَـٰذَا إِقْبَالُ لَيْلِكَ وَإِدْبَارُ نَهَارِكَ وَأَصْوَاتُ دُعَاتِكَ فَاغْفِرْ لِي',
    translationUrdu: 'اے اللہ! مجھے جہنم کی آگ سے پناہ عطا فرما (7 مرتبہ)۔ اے اللہ! یہ تیری رات کی آمد ہے، تیرے دن کی رخصتی ہے، اور تجھے پکارنے والوں کی صدائیں ہیں، پس میری مغفرت فرما دے۔',
    translationEn: 'O Allah, save me from the Fire of Hell (7 times). O Allah, this is the arrival of Your night, the departure of Your day, and the voices of those calling upon You, so forgive me.',
    fazeelatUrdu: 'نبی کریم ﷺ نے حضرت حارث بن مسلم رضی اللہ عنہ سے فرمایا: "جب تم مغرب کی نماز پڑھ چکو تو کسی سے بات کرنے سے پہلے 7 مرتبہ \'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ\' پڑھو۔ اگر اس رات تمہاری وفات ہو جائے تو تمہارے لیے جہنم سے خلاصی کا پروانہ لکھ دیا جائے گا۔" (سنن ابو داؤد: 5079، مسند احمد: 18054)',
    whyReciteUrdu: 'کیوں پڑھیں؟ مغرب کے وقت رات کا آغاز ہوتا ہے۔ سلام کے فوراً بعد یہ دعا پڑھنے سے انسان رات کے فتنوں، شیطانی شر اور دوزخ کے عذاب سے اللہ تعالیٰ کی مستقل امان میں آ جاتا ہے۔',
    fazeelatEn: 'The Messenger of Allah ﷺ instructed: "When you finish Maghrib prayer, say 7 times before talking to anyone: \'Allahumma ajirni min an-nar\'. If you die that night, protection from the Fire is decreed for you" (Sunan Abi Dawud: 5079).',
    hadithRef: 'سنن ابو داؤد: 5079 • مسند احمد: 18054'
  },
  isha: {
    id: 'dua_isha',
    prayerKey: 'isha',
    prayerName: 'Isha (نمازِ عشاء)',
    titleUrdu: 'نمازِ عشاء کے بعد اور رات کی مسنون دعا (عافیت و سلامتی)',
    titleEn: 'Post-Isha Prayer & Nighttime Sunnah Supplication',
    timingDesc: 'عشاء کے 35 منٹ بعد سے 1 گھنٹے تک کے لیے مخصوص',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، وَاحْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي',
    translationUrdu: 'اے اللہ! میں تجھ سے دنیا اور آخرت میں معافی اور عافیت کا سوال کرتا ہوں۔ اے اللہ! میری پردہ پوشی فرما اور میرے خوف و گھبراہٹ کو امن و سلامتی میں بدل دے، اور میری حفاظت فرما میرے آگے سے اور میرے پیچھے سے۔',
    translationEn: 'O Allah, I ask You for pardon and well-being in this world and the Hereafter. O Allah, conceal my faults and calm my fears, and protect me from in front of me and from behind me.',
    fazeelatUrdu: 'حضرت عبداللہ بن عمر رضی اللہ عنہما بیان کرتے ہیں کہ رسول اللہ ﷺ شام کو اور رات کو یہ دعائیہ کلمات کبھی ترک نہیں فرماتے تھے۔ (سنن ابو داؤد: 5074، سنن ابن ماجہ: 3871 - صحیح)',
    whyReciteUrdu: 'کیوں پڑھیں؟ عشاء کے بعد جب انسان بستر پر سونے کی تیاری کرتا ہے، یہ دعا انسان کے جسم، جان، ایمان اور اہل و عیال کے لیے رات بھر کے لیے ایک مستحکم الٰہی قلعہ بن جاتی ہے۔',
    fazeelatEn: 'Ibn Umar (RA) reported that the Prophet ﷺ never failed to recite these words in the evening and before sleep (Sunan Abi Dawud: 5074, Ibn Majah: 3871). It provides a comprehensive spiritual and physical shield for the entire night.',
    hadithRef: 'سنن ابو داؤد: 5074 • سنن ابن ماجہ: 3871'
  }
};

export default function DailyReminderBanner({ timings, navigateToTab }) {
  const { t } = useLanguage();
  const [activeReminders, setActiveReminders] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [previewPrayer, setPreviewPrayer] = useState(null); // Allows user/admin to preview any prayer's Dua

  useEffect(() => {
    // Resolve prayer timings (from prop, localStorage cache, or default)
    const resolveTimings = () => {
      if (timings && timings.Fajr) return timings;
      try {
        const cached = localStorage.getItem('user_prayer_timings');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
      // Fallback timings for Pakistan (Karachi Hanafi school=1: Asr 16:30)
      return {
        Fajr: '05:13',
        Sunrise: '06:29',
        Dhuhr: '12:18',
        Asr: '16:30',
        Maghrib: '18:07',
        Isha: '19:23'
      };
    };

    const checkReminders = () => {
      const prayerTimings = resolveTimings();
      if (!prayerTimings) return;

      const now = new Date();
      const active = [];

      const parseTime = (timeStr) => {
        if (!timeStr) return null;
        const cleanTime = timeStr.split(' ')[0];
        const [hours, minutes] = cleanTime.split(':').map(Number);
        const d = new Date(now);
        d.setHours(hours, minutes, 0, 0);
        return d;
      };

      const fajr = parseTime(prayerTimings.Fajr);
      const dhuhr = parseTime(prayerTimings.Dhuhr);
      const asr = parseTime(prayerTimings.Asr);
      const maghrib = parseTime(prayerTimings.Maghrib);
      const isha = parseTime(prayerTimings.Isha);

      // =========================================================================
      // 1. FAJR TIMING RULE:
      // Appears after 40 mins of Fajr, visible for 1 hour (60 mins), then hides.
      // Window: [Fajr + 40m] to [Fajr + 100m]
      // =========================================================================
      if (fajr) {
        const fajrStart = new Date(fajr.getTime() + 40 * 60000);
        const fajrEnd = new Date(fajr.getTime() + 100 * 60000);
        if (now >= fajrStart && now < fajrEnd) {
          active.push(PRAYER_DUAS.fajr);
        }
      }

      // =========================================================================
      // 2. ZUHR TIMING RULE:
      // When Zuhr starts, after 40 mins of Zuhr time, visible for 1 hr 30 mins (90 mins), then hides.
      // Window: [Zuhr + 40m] to [Zuhr + 130m]
      // =========================================================================
      if (dhuhr) {
        const zuhrStart = new Date(dhuhr.getTime() + 40 * 60000);
        const zuhrEnd = new Date(dhuhr.getTime() + 130 * 60000);
        if (now >= zuhrStart && now < zuhrEnd) {
          active.push(PRAYER_DUAS.zuhr);
        }
      }

      // =========================================================================
      // 3. ASR TIMING RULE:
      // When Asr time comes, after 1 hour (60 mins), visible for 1 hour (60 mins), then hides.
      // Window: [Asr + 60m] to [Asr + 120m]
      // =========================================================================
      if (asr) {
        const asrStart = new Date(asr.getTime() + 60 * 60000);
        const asrEnd = new Date(asr.getTime() + 120 * 60000);
        if (now >= asrStart && now < asrEnd) {
          active.push(PRAYER_DUAS.asr);
        }
      }

      // =========================================================================
      // 4. SPECIAL DUA BETWEEN ASR & MAGHRIB (GOLDEN HOUR):
      // Visible after Asr timings when Asr dua starts, valid till Maghrib timings only.
      // When Maghrib comes, it hides! Next day duration repeats.
      // Window: [Asr + 60m] to [Maghrib]
      // =========================================================================
      if (asr && maghrib) {
        const asrDuaStart = new Date(asr.getTime() + 60 * 60000);
        if (now >= asrDuaStart && now < maghrib) {
          active.push(PRAYER_DUAS.asr_to_maghrib);
        }
      }

      // =========================================================================
      // 5. MAGHRIB TIMING RULE:
      // When Maghrib time comes, immediately appears on home page, visible for 30 mins, then hides.
      // Window: [Maghrib] to [Maghrib + 30m]
      // =========================================================================
      if (maghrib) {
        const maghribStart = maghrib;
        const maghribEnd = new Date(maghrib.getTime() + 30 * 60000);
        if (now >= maghribStart && now < maghribEnd) {
          active.push(PRAYER_DUAS.maghrib);
        }
      }

      // =========================================================================
      // 6. ISHA TIMING RULE:
      // When Isha time comes, after 35 mins of Isha time, visible for 1 hour (60 mins), then hides.
      // Window: [Isha + 35m] to [Isha + 95m]
      // =========================================================================
      if (isha) {
        const ishaStart = new Date(isha.getTime() + 35 * 60000);
        const ishaEnd = new Date(isha.getTime() + 95 * 60000);
        if (now >= ishaStart && now < ishaEnd) {
          active.push(PRAYER_DUAS.isha);
        }
      }

      setActiveReminders(active);
    };

    checkReminders();
    const interval = setInterval(checkReminders, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [timings]);

  // Copy Dua to Clipboard
  const handleCopyDua = (dua) => {
    const textToCopy = `${dua.prayerName} - ${dua.titleUrdu}\n\n` +
      `عربی دعا:\n${dua.arabic}\n\n` +
      `اردو ترجمہ:\n${dua.translationUrdu}\n\n` +
      `English:\n${dua.translationEn}\n\n` +
      `فضیلت و مسنون وجہ:\n${dua.fazeelatUrdu}\n${dua.whyReciteUrdu}\n\n` +
      `مکتبۃ المسلم • maktabatulmuslim.com`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  // Determine which reminders to show:
  // If previewPrayer is selected, show that preview; otherwise show real-time active reminders
  const displayList = previewPrayer
    ? [PRAYER_DUAS[previewPrayer]]
    : activeReminders;

  // IMPORTANT: If no prayer window is currently active and no preview selected,
  // the banner is COMPLETELY INVISIBLE / HIDDEN so the normal website is visible!
  if (displayList.length === 0) {
    return null;
  }

  return (
    <div style={{ padding: '0 1rem', marginBottom: '2rem', marginTop: '1.25rem' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Active Prayer Dua Cards */}
        {displayList.map(dua => (
          <div
            key={dua.id}
            style={{
              background: '#ffffff',
              border: '2px solid #059669',
              borderRadius: '24px',
              padding: '1.75rem 2rem',
              boxShadow: '0 12px 36px rgba(5,150,105,0.12)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Top decorative accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #059669 100%)' }} />

            {/* Header: Prayer Badge + Active Window Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ background: '#ecfdf5', color: '#065f46', border: '1.5px solid #a7f3d0', padding: '5px 14px', borderRadius: '20px', fontWeight: 800, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <i className="fas fa-mosque" style={{ color: '#059669' }}></i> {dua.prayerName}
                </span>

                <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '16px', fontWeight: 700, fontSize: '0.78rem' }}>
                  ⏱️ {dua.timingDesc}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleCopyDua(dua)}
                  style={{
                    background: copiedId === dua.id ? '#10b981' : '#f8fafc',
                    color: copiedId === dua.id ? '#ffffff' : '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <i className={copiedId === dua.id ? "fas fa-check" : "fas fa-copy"}></i>
                  {copiedId === dua.id ? 'کاپی ہو گئی! (Copied)' : 'Copy Dua'}
                </button>

                {previewPrayer && (
                  <button
                    type="button"
                    onClick={() => setPreviewPrayer(null)}
                    style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    Close Preview
                  </button>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 style={{ margin: '0 0 1rem 0', color: '#065f46', fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.4 }}>
              {dua.titleUrdu}
            </h3>

            {/* 📜 Complete Arabic Dua Box */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', padding: '1.5rem', borderRadius: '18px', border: '1.5px solid #86efac', marginBottom: '1.25rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 'clamp(1.5rem, 3.5vw, 1.95rem)', fontWeight: 800, fontFamily: "'Amiri', 'Traditional Arabic', serif", color: '#064e3b', direction: 'rtl', lineHeight: 2.1, letterSpacing: '0.5px' }}>
                {dua.arabic}
              </p>
            </div>

            {/* 📖 Urdu Translation Box */}
            <div style={{ background: '#f8fafc', padding: '1.1rem 1.4rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1rem', borderRight: '4px solid #059669' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                اردو با محاورہ ترجمہ:
              </span>
              <p style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', direction: 'rtl', textAlign: 'right', fontFamily: "'Amiri', 'Jameel Noori Nastaleeq', serif", lineHeight: 1.8 }}>
                "{dua.translationUrdu}"
              </p>
            </div>

            {/* 🇬🇧 English Translation Box */}
            <div style={{ background: '#f8fafc', padding: '0.9rem 1.4rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                English Meaning:
              </span>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: 1.55 }}>
                "{dua.translationEn}"
              </p>
            </div>

            {/* 🌟 FAZEELAT & SIGNIFICANCE BOX (فضیلت اور مسنون وجہ - Why to Recite) */}
            <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1.5px solid #f59e0b', borderRadius: '16px', padding: '1.35rem 1.5rem', marginBottom: '1.25rem', boxShadow: '0 4px 12px rgba(245,158,11,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#92400e', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i className="fas fa-star" style={{ color: '#d97706' }}></i> فضیلت اور مسنون وجہ (Why to Recite & Hadith Reference)
                </span>

                <span style={{ background: '#ffffff', color: '#78350f', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                  📚 {dua.hadithRef}
                </span>
              </div>

              {/* Urdu Fazeelat & Hadith */}
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.02rem', color: '#451a03', direction: 'rtl', textAlign: 'right', fontFamily: "'Amiri', serif", lineHeight: 1.8 }}>
                {dua.fazeelatUrdu}
              </p>

              {/* Why to Recite (کیوں پڑھیں) */}
              <div style={{ background: 'rgba(255,255,255,0.7)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #fde68a', margin: '0.65rem 0' }}>
                <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#78350f', direction: 'rtl', textAlign: 'right', fontFamily: "'Amiri', serif", lineHeight: 1.7 }}>
                  💡 {dua.whyReciteUrdu}
                </p>
              </div>

              {/* English Fazeelat */}
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#78350f', lineHeight: 1.5, fontStyle: 'italic' }}>
                {dua.fazeelatEn}
              </p>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#059669' }}></i>
                مستند مسنون دعا • صحیح احادیثِ مبارکہ سے تصدیق شدہ
              </span>

              <button
                type="button"
                onClick={() => { if (navigateToTab) navigateToTab('azkar'); }}
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 20px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(5,150,105,0.25)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>تمام مسنون اذکار و تسبیح دیکھیں (View All Azkar)</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        ))}

        {/* 🔍 Preview Prayer Switcher (Allows testing all 6 prayer Duas at any time) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap', padding: '0.35rem 0' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginRight: '0.35rem' }}>
            Preview Prayer Duas:
          </span>
          {[
            { key: 'fajr', label: '🌅 Fajr' },
            { key: 'zuhr', label: '☀️ Zuhr' },
            { key: 'asr', label: '🌤️ Asr' },
            { key: 'asr_to_maghrib', label: '🌇 Asr-Maghrib' },
            { key: 'maghrib', label: '🌆 Maghrib' },
            { key: 'isha', label: '🌙 Isha' },
          ].map(p => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPreviewPrayer(previewPrayer === p.key ? null : p.key)}
              style={{
                background: previewPrayer === p.key ? '#059669' : 'rgba(255,255,255,0.85)',
                color: previewPrayer === p.key ? '#ffffff' : '#64748b',
                border: previewPrayer === p.key ? '1px solid #059669' : '1px solid #cbd5e1',
                padding: '3px 10px',
                borderRadius: '14px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
          {previewPrayer && (
            <button
              type="button"
              onClick={() => setPreviewPrayer(null)}
              style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '3px 8px', borderRadius: '14px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
            >
              ✕ Clear Preview
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
