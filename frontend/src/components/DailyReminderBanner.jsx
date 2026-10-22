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

// Authentic Post-Prayer 33-Times Tasbeeh Data
const POST_PRAYER_TASBEEH = [
  {
    id: 'subhanAllah',
    titleUrdu: 'سُبْحَانَ اللَّهِ',
    romanTitle: 'SubhanAllah',
    countTarget: 33,
    meaningUrdu: 'اللہ پاک ہے (ہر عیب و کمزوری سے پاک ہے)',
    meaningEn: 'Glory be to Allah',
    badgeColor: 'var(--primary-emerald)',
    bgLight: 'var(--home-sage, #edf4ec)',
    borderLight: 'var(--home-line, #dce8db)'
  },
  {
    id: 'subhanAllahAzeem',
    titleUrdu: 'سُبْحَانَ اللَّهِ الْعَظِيمِ',
    altTitleUrdu: 'الْحَمْدُ لِلَّهِ',
    romanTitle: 'SubhanAllahil Azeem / Alhamdulillah',
    countTarget: 33,
    meaningUrdu: 'عظمت والا اللہ پاک ہے • تمام تعریفیں اللہ کے لیے ہیں',
    meaningEn: 'Glory be to Allah the Magnificent • All praise is due to Allah',
    badgeColor: 'var(--primary-emerald)',
    bgLight: 'var(--home-sage, #edf4ec)',
    borderLight: 'var(--home-line, #dce8db)'
  },
  {
    id: 'allahuAkbar',
    titleUrdu: 'اللَّهُ أَكْبَرُ',
    romanTitle: 'Allahu Akbar',
    countTarget: 33,
    meaningUrdu: 'اللہ سب سے بڑا اور برتر ہے',
    meaningEn: 'Allah is the Greatest',
    badgeColor: 'var(--primary-emerald)',
    bgLight: 'var(--home-sage, #edf4ec)',
    borderLight: 'var(--home-line, #dce8db)'
  }
];

const COMPLETION_KALIMAH = {
  arabic: 'لَا إِلَـٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
  meaningUrdu: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے، اسی کے لیے تمام تعریف ہے، اور وہ ہر چیز پر کامل قدرت رکھتا ہے۔',
  meaningEn: 'None has the right to be worshipped except Allah alone, with no partner. His is the majesty and His is all praise, and He has power over everything.',
  fazeelatUrdu: 'رسول اللہ ﷺ نے فرمایا: "جس نے ہر نماز کے بعد ۳۳ بار سُبْحَانَ اللَّهِ، ۳۳ بار سُبْحَانَ اللَّهِ الْعَظِيمِ / الْحَمْدُ لِلَّهِ، اور ۳۳ بار اللَّهُ أَكْبَرُ پڑھا، اور سوواں عدد پورا کرنے کے لیے یہ کلمہ پڑھا، اس کے تمام گناہ بخش دیے جاتے ہیں اگرچہ وہ سمندر کے جھاگ کے برابر ہی کیوں نہ ہوں۔" (صحیح مسلم: 597)',
  hadithRef: 'صحیح مسلم: 597 • سنن ابو داؤد: 1504 • سنن نسائی: 1350'
};

const getPrayerDate = (timeText, now, timezone) => {
  const match = String(timeText || '').match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;

  if (!timezone) {
    const date = new Date(now);
    date.setHours(hour, minute, 0, 0);
    return date;
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    });
    const partsFor = (date) => Object.fromEntries(formatter.formatToParts(date).map(part => [part.type, Number(part.value)]));
    const localNow = partsFor(now);
    const targetLocalAsUtc = Date.UTC(localNow.year, localNow.month - 1, localNow.day, hour, minute);
    let timestamp = targetLocalAsUtc;
    for (let pass = 0; pass < 2; pass += 1) {
      const atTimestamp = partsFor(new Date(timestamp));
      const representedAsUtc = Date.UTC(atTimestamp.year, atTimestamp.month - 1, atTimestamp.day,
        atTimestamp.hour, atTimestamp.minute, atTimestamp.second);
      timestamp += targetLocalAsUtc - representedAsUtc;
    }
    return new Date(timestamp);
  } catch {
    const date = new Date(now);
    date.setHours(hour, minute, 0, 0);
    return date;
  }
};

export default function DailyReminderBanner({ timings, timezone, navigateToTab }) {
  const { t, lang } = useLanguage();
  const isUrdu = lang === 'ur';
  const isArabic = lang === 'ar';
  const [activeReminders, setActiveReminders] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [previewPrayer, setPreviewPrayer] = useState(null); // Allows user/admin to preview any prayer's Dua

  // Interactive 33-times Tasbeeh counters with local persistence
  const [tasbeehCounts, setTasbeehCounts] = useState(() => {
    try {
      const saved = localStorage.getItem('post_prayer_tasbeeh_counts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { subhanAllah: 0, subhanAllahAzeem: 0, allahuAkbar: 0 };
  });

  useEffect(() => {
    try {
      localStorage.setItem('post_prayer_tasbeeh_counts', JSON.stringify(tasbeehCounts));
    } catch (e) {}
  }, [tasbeehCounts]);

  const incrementTasbeeh = (key) => {
    if (navigator.vibrate) {
      try { navigator.vibrate(35); } catch (e) {}
    }
    setTasbeehCounts(prev => ({
      ...prev,
      [key]: Math.min(33, (prev[key] || 0) + 1)
    }));
  };

  const setTasbeehComplete = (key) => {
    setTasbeehCounts(prev => ({
      ...prev,
      [key]: 33
    }));
  };

  const resetAllTasbeeh = () => {
    setTasbeehCounts({ subhanAllah: 0, subhanAllahAzeem: 0, allahuAkbar: 0 });
  };

  const totalTasbeehCount = (tasbeehCounts.subhanAllah || 0) + (tasbeehCounts.subhanAllahAzeem || 0) + (tasbeehCounts.allahuAkbar || 0);
  const isTasbeehComplete = (tasbeehCounts.subhanAllah >= 33) && (tasbeehCounts.subhanAllahAzeem >= 33) && (tasbeehCounts.allahuAkbar >= 33);

  useEffect(() => {
    // Resolve prayer timings (from prop, localStorage cache, or default)
    const resolveTimings = () => {
      if (timings && timings.Fajr) return timings;
      try {
        const cached = localStorage.getItem('user_prayer_timings');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
      return null;
    };

    const checkReminders = () => {
      const prayerTimings = resolveTimings();
      if (!prayerTimings) return;

      const now = new Date();
      const active = [];

      const prayerTimezone = timezone || (() => {
        try { return localStorage.getItem('user_prayer_timezone') || ''; } catch { return ''; }
      })();
      const fajr = getPrayerDate(prayerTimings.Fajr, now, prayerTimezone);
      const dhuhr = getPrayerDate(prayerTimings.Dhuhr, now, prayerTimezone);
      const asr = getPrayerDate(prayerTimings.Asr, now, prayerTimezone);
      const maghrib = getPrayerDate(prayerTimings.Maghrib, now, prayerTimezone);
      const isha = getPrayerDate(prayerTimings.Isha, now, prayerTimezone);

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
      // Show at the selected location's Asr time and keep it visible for 40 minutes.
      // Window: [Asr] to [Asr + 40m]
      // =========================================================================
      if (asr) {
        const asrStart = asr;
        const asrEnd = new Date(asr.getTime() + 40 * 60000);
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
  }, [timings, timezone]);

  // Copy Dua to Clipboard
  const handleCopyDua = (dua) => {
    const textToCopy = `${t(dua.prayerKey, dua.prayerName)} - ${isUrdu ? dua.titleUrdu : dua.titleEn}\n\n` +
      `${isUrdu ? 'عربی دعا' : 'Arabic dua'}:\n${dua.arabic}\n\n` +
      `${isUrdu ? 'ترجمہ' : 'Meaning'}:\n${isUrdu ? dua.translationUrdu : dua.translationEn}\n\n` +
      `${isUrdu ? 'فضیلت و مسنون وجہ' : 'Hadith reference'}:\n${isUrdu ? `${dua.fazeelatUrdu}\n${dua.whyReciteUrdu}` : dua.fazeelatEn}\n\n` +
      `مکتبۃ المسلم • maktabatulmuslim.com`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  // Copy Full 33x Tasbeeh to Clipboard
  const handleCopyTasbeeh = () => {
    const textToCopy = `${isUrdu ? 'ہر فرض نماز کے بعد کی مسنون تسبیح' : 'Post-prayer Tasbeeh'} (33 × 3):\n\n` +
      POST_PRAYER_TASBEEH.map((item, index) => `${index + 1}. ${item.titleUrdu}${item.altTitleUrdu ? ` / ${item.altTitleUrdu}` : ''} (33) — ${isUrdu ? item.meaningUrdu : item.meaningEn}`).join('\n') +
      `\n\n${isUrdu ? 'سوواں کلمہ' : 'Final remembrance'}:\n${COMPLETION_KALIMAH.arabic}\n\n` +
      `${isUrdu ? 'ترجمہ' : 'Meaning'}:\n${isUrdu ? COMPLETION_KALIMAH.meaningUrdu : COMPLETION_KALIMAH.meaningEn}\n\n` +
      (isUrdu ? `فضیلت:\n${COMPLETION_KALIMAH.fazeelatUrdu}\n\n` : '') +
      `${isUrdu ? 'حوالہ' : 'Reference'}: ${COMPLETION_KALIMAH.hadithRef}\n\n` +
      `مکتبۃ المسلم • maktabatulmuslim.com`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId('tasbeeh_full');
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
    <div className="prayer-dua-shell" style={{ padding: '0 0.75rem', marginBottom: '1rem', marginTop: '0.75rem' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Active Prayer Dua Cards */}
        {displayList.map(dua => (
          <div
            key={dua.id}
            className="prayer-dua-card"
            style={{
              background: 'var(--surface-paper)',
              border: '2px solid #059669',
              borderRadius: '18px',
              padding: '1.1rem 1.25rem',
              boxShadow: '0 12px 36px rgba(5,150,105,0.12)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Top decorative accent */}
            <div className="dua-accent" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'var(--primary-emerald)' }} />

            {/* Header: Prayer Badge + Active Window Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ background: '#ecfdf5', color: '#065f46', border: '1.5px solid #a7f3d0', padding: '5px 14px', borderRadius: '20px', fontWeight: 800, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <i className="fas fa-mosque" style={{ color: '#059669' }}></i> {t(dua.prayerKey, dua.prayerName)}
                </span>

                <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '16px', fontWeight: 700, fontSize: '0.78rem' }}>
                  ⏱️ {isUrdu ? dua.timingDesc : isArabic ? 'وقت الدعاء بعد الصلاة' : 'After-prayer dua window'}
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
                  {copiedId === dua.id ? (isUrdu ? 'کاپی ہو گئی!' : isArabic ? 'تم النسخ' : 'Copied') : `${t('copy', 'Copy')} Dua`}
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
            <h3 style={{ margin: '0 0 0.55rem 0', color: '#065f46', fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.4 }}>
              {isUrdu ? dua.titleUrdu : isArabic ? `دعاء بعد صلاة ${t(dua.prayerKey, dua.prayerName)}` : dua.titleEn}
            </h3>

            <div className="prayer-dua-columns">
              <div className="prayer-dua-reading">
            {/* 📜 Complete Arabic Dua Box */}
            <div className="dua-arabic-panel" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', padding: '0.85rem 1rem', borderRadius: '14px', border: '1.5px solid #86efac', marginBottom: '0.7rem', textAlign: 'center' }}>
              <p className="prayer-dua-arabic notranslate" translate="no" style={{ margin: 0, fontSize: 'clamp(1.35rem, 3vw, 1.8rem)', fontWeight: 800, fontFamily: "'Amiri', 'Traditional Arabic', serif", color: '#064e3b', direction: 'rtl', lineHeight: 1.75, letterSpacing: '0.5px' }}>
                {dua.arabic}
              </p>
            </div>

            {/* 📖 Urdu Translation Box */}
            {isUrdu && <div className="dua-translation" style={{ background: '#f8fafc', padding: '0.7rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '0.6rem', borderRight: '4px solid #059669' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                اردو با محاورہ ترجمہ:
              </span>
              <p className="prayer-dua-translation-urdu" style={{ margin: 0, fontSize: '1.08rem', color: '#0f172a', direction: 'rtl', textAlign: 'right', fontFamily: "'Amiri', 'Jameel Noori Nastaleeq', serif", lineHeight: 1.7 }}>
                "{dua.translationUrdu}"
              </p>
            </div>}

            {/* 🇬🇧 English Translation Box */}
            {!isUrdu && <div className="dua-translation" style={{ background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '0.7rem', borderLeft: '4px solid #f59e0b' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                English Meaning:
              </span>
              <p className="prayer-dua-translation-english" style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: 1.55 }}>
                "{dua.translationEn}"
              </p>
            </div>}

            {/* 🌟 FAZEELAT & SIGNIFICANCE BOX (فضیلت اور مسنون وجہ - Why to Recite) */}
            <div className="dua-reference" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1.5px solid #f59e0b', borderRadius: '14px', padding: '0.85rem 1rem', marginBottom: '0.7rem', boxShadow: '0 4px 12px rgba(245,158,11,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#92400e', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i className="fas fa-star" style={{ color: '#d97706' }}></i> {isUrdu ? 'فضیلت اور مسنون وجہ' : isArabic ? 'المرجع والفضل' : 'Why to Recite & Hadith Reference'}
                </span>

                <span style={{ background: 'var(--surface-paper)', color: '#78350f', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                  📚 {dua.hadithRef}
                </span>
              </div>

              {/* Urdu Fazeelat & Hadith */}
              {isUrdu && <p style={{ margin: '0 0 0.35rem 0', fontSize: '1.02rem', color: '#451a03', direction: 'rtl', textAlign: 'right', fontFamily: "'Amiri', serif", lineHeight: 1.7 }}>
                {dua.fazeelatUrdu}
              </p>}

              {/* Why to Recite (کیوں پڑھیں) */}
              {isUrdu && <div className="dua-reference-note" style={{ background: 'rgba(255,255,255,0.7)', padding: '0.5rem 0.7rem', borderRadius: '10px', border: '1px solid #fde68a', margin: '0.4rem 0' }}>
                <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#78350f', direction: 'rtl', textAlign: 'right', fontFamily: "'Amiri', serif", lineHeight: 1.7 }}>
                  💡 {dua.whyReciteUrdu}
                </p>
              </div>}

              {/* English Fazeelat */}
              {!isUrdu && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#78350f', lineHeight: 1.5, fontStyle: 'italic' }}>
                {dua.fazeelatEn}
              </p>}
            </div>
              </div>

            {/* 📿 ۳۳ بار والی مسنون تسبیح (SubhanAllah 33x, SubhanAllahil Azeem / Alhamdulillah 33x, Allahu Akbar 33x + 100th Kalimah) */}
            <div
              className="post-prayer-tasbeeh"
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)',
                border: '2px solid #10b981',
                borderRadius: '16px',
                padding: '0.9rem 1rem',
                marginBottom: '0.7rem',
                boxShadow: '0 8px 24px rgba(16,185,129,0.08)'
              }}
            >
              {/* Header: Title + Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ background: '#059669', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontSize: '0.76rem', fontWeight: 800 }}>
                      📿 {isUrdu ? 'مسنون تسبیح' : isArabic ? 'تسبيح بعد الصلاة' : 'Post-Prayer Tasbeeh'} (33 × 33 × 33)
                    </span>
                    <h4 style={{ margin: 0, color: '#064e3b', fontSize: '1.18rem', fontWeight: 900 }}>
                      {isUrdu ? 'ہر فرض نماز کے بعد کی تسبیح (۳۳، ۳۳، ۳۳ مرتبہ)' : isArabic ? 'تسبيح بعد كل صلاة مفروضة' : 'Tasbeeh after each obligatory prayer'}
                    </h4>
                  </div>
                  <p className="notranslate" translate="no" style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#475569' }}>
                    سُبْحَانَ اللَّهِ (۳۳ بار) • سُبْحَانَ اللَّهِ الْعَظِيمِ / الْحَمْدُ لِلَّهِ (۳۳ بار) • اللَّهُ أَكْبَرُ (۳۳ بار)
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleCopyTasbeeh}
                    style={{
                      background: copiedId === 'tasbeeh_full' ? '#10b981' : 'var(--surface-paper)',
                      color: copiedId === 'tasbeeh_full' ? '#ffffff' : '#065f46',
                      border: '1px solid #a7f3d0',
                      padding: '5px 12px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <i className={copiedId === 'tasbeeh_full' ? "fas fa-check" : "fas fa-copy"}></i>
                    {copiedId === 'tasbeeh_full' ? (isUrdu ? 'کاپی ہو گیا!' : isArabic ? 'تم النسخ' : 'Copied') : `${t('copy', 'Copy')} Tasbeeh`}
                  </button>

                  {totalTasbeehCount > 0 && (
                    <button
                      type="button"
                      onClick={resetAllTasbeeh}
                      style={{
                        background: 'var(--surface-paper)',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        padding: '5px 12px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                      title="تسبیح کاؤنٹر دوبارہ شروع کریں"
                    >
                      <i className="fas fa-undo"></i> {t('reset', 'Reset')}
                    </button>
                  )}
                </div>
              </div>

              {/* Overall Progress Meter */}
              <div className="tasbeeh-progress" style={{ background: 'var(--surface-paper)', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.5rem 0.75rem', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.82rem', fontWeight: 800 }}>
                  <span style={{ color: isTasbeehComplete ? '#059669' : '#334155' }}>
                    {isTasbeehComplete ? (isUrdu ? '🎉 ماشاء اللہ! ۹۹ مرتبہ تسبیح مکمل ہو گئی' : isArabic ? '🎉 اكتملت التسبيحات ٩٩ مرة' : '🎉 99 recitations complete') : (isUrdu ? 'مجموعی تسبیح کاؤنٹر:' : isArabic ? 'مجموع التسبيحات:' : 'Total Tasbeeh count:')}
                  </span>
                  <span style={{ color: '#059669' }}>
                    {totalTasbeehCount} / 99
                  </span>
                </div>
                <div style={{ width: '100%', height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(totalTasbeehCount / 99) * 100}%`,
                      height: '100%',
                      background: isTasbeehComplete ? '#059669' : 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      transition: 'width 0.25s ease'
                    }}
                  />
                </div>
              </div>

              {/* 3 Interactive Counter Cards */}
              <div
                className="post-prayer-counter-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 245px), 1fr))',
                  gap: '0.6rem',
                  marginBottom: '0.65rem'
                }}
              >
                {POST_PRAYER_TASBEEH.map((item, idx) => {
                  const currentCount = tasbeehCounts[item.id] || 0;
                  const isItemDone = currentCount >= item.countTarget;
                  return (
                    <div
                      key={item.id}
                      className={`post-prayer-counter-card${isItemDone ? ' is-complete' : ''}`}
                      style={{
                        background: isItemDone ? item.bgLight : 'var(--surface-paper)',
                        border: `2px solid ${isItemDone ? item.badgeColor : item.borderLight}`,
                        borderRadius: '13px',
                        padding: '0.7rem 0.8rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isItemDone ? '0 4px 14px rgba(5,150,105,0.12)' : '0 2px 6px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Top: Index & Counter badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ background: item.bgLight, color: item.badgeColor, border: `1px solid ${item.borderLight}`, padding: '2px 8px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800 }}>
                          {idx + 1}. {item.romanTitle}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: isItemDone ? '#059669' : '#64748b' }}>
                          {currentCount} / {item.countTarget}
                        </span>
                      </div>

                      {/* Arabic Text */}
                      <div style={{ textAlign: 'center', margin: '0.2rem 0' }}>
                        <p style={{
                          margin: 0,
                          fontSize: '1.55rem',
                          fontWeight: 800,
                          fontFamily: "'Amiri', 'Traditional Arabic', serif",
                          color: '#064e3b',
                          direction: 'rtl',
                          lineHeight: 1.5
                        }}>
                          <span className="notranslate" translate="no">{item.titleUrdu}</span>
                        </p>
                        {item.altTitleUrdu && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--primary-emerald)', fontWeight: 700, direction: 'rtl', display: 'block', marginTop: '2px' }}>
                            ({isUrdu ? 'یا' : isArabic ? 'أو' : 'or'}: <span className="notranslate" translate="no">{item.altTitleUrdu}</span>)
                          </span>
                        )}
                      </div>

                      {/* Meanings */}
                      <div style={{ textAlign: 'center', margin: '0.15rem 0 0.5rem 0' }}>
                        {isUrdu && <p style={{ margin: 0, fontSize: '0.86rem', color: '#1e293b', direction: 'rtl', fontFamily: "'Amiri', serif", fontWeight: 700 }}>
                          "{item.meaningUrdu}"
                        </p>}
                        {!isUrdu && <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic' }}>
                          {item.meaningEn}
                        </p>}
                      </div>

                      {/* Mini Progress */}
                      <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                        <div style={{ width: `${(currentCount / item.countTarget) * 100}%`, height: '100%', background: item.badgeColor, transition: 'width 0.2s' }} />
                      </div>

                      {/* Tap / Complete Buttons */}
                      <div className="post-prayer-counter-actions" style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => incrementTasbeeh(item.id)}
                          disabled={isItemDone}
                          style={{
                            flex: 1,
                            background: isItemDone ? '#e2e8f0' : `linear-gradient(135deg, ${item.badgeColor} 0%, #047857 100%)`,
                            color: isItemDone ? '#64748b' : '#ffffff',
                            border: 'none',
                            padding: '7px 10px',
                            borderRadius: '10px',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            cursor: isItemDone ? 'default' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            boxShadow: isItemDone ? 'none' : '0 3px 10px rgba(5,150,105,0.2)',
                            userSelect: 'none'
                          }}
                        >
                          {isItemDone ? (
                            <>
                              <i className="fas fa-check-circle" style={{ color: '#059669' }}></i>
                              <span>{isUrdu ? '۳۳ بار مکمل!' : isArabic ? 'اكتمل ٣٣ مرة' : '33 complete'}</span>
                            </>
                          ) : (
                            <>
                              <i className="fas fa-fingerprint"></i>
                              <span>+1 {isUrdu ? 'پڑھا' : isArabic ? 'ذِكر' : 'recited'} ({currentCount}/33)</span>
                            </>
                          )}
                        </button>

                        {!isItemDone && (
                          <button
                            type="button"
                            onClick={() => setTasbeehComplete(item.id)}
                            style={{
                              background: '#f8fafc',
                              color: '#475569',
                              border: '1px solid #cbd5e1',
                              padding: '7px 8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                            title="اگر انگلیوں پر پڑھ لیا ہے تو ۳۳ مکمل نشان زد کریں"
                          >
                            ✓ {isUrdu ? '33 مکمل' : isArabic ? '٣٣ مكتمل' : 'Complete 33'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 🌟 100th Completion Kalimah (سوواں کلمہ) */}
              <div
                className={`tasbeeh-completion${isTasbeehComplete ? ' is-complete' : ''}`}
                style={{
                  background: isTasbeehComplete ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'var(--surface-paper)',
                  border: `2px dashed ${isTasbeehComplete ? '#d97706' : '#94a3b8'}`,
                  borderRadius: '14px',
                  padding: '0.8rem 1rem',
                  marginBottom: '0.65rem',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem', background: 'var(--surface-paper)', color: '#92400e', border: '1px solid #fde68a', padding: '3px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  <span>✨ {isUrdu ? 'سوواں (100) کلمہ برائے تکمیلِ تسبیح' : isArabic ? 'الذكر المتمم للتسبيح (١٠٠)' : 'Final remembrance to complete 100'}</span>
                  {isTasbeehComplete && <span style={{ color: '#059669', fontWeight: 900 }}>• {isUrdu ? 'اب یہ کلمہ پڑھیں!' : isArabic ? 'اقرأ هذا الذكر الآن' : 'Recite this now'}</span>}
                </div>

                <p style={{
                  margin: '0 0 0.45rem 0',
                  fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
                  fontWeight: 800,
                  fontFamily: "'Amiri', 'Traditional Arabic', serif",
                  color: '#064e3b',
                  direction: 'rtl',
                  lineHeight: 1.7
                }}>
                  <span className="notranslate" translate="no">{COMPLETION_KALIMAH.arabic}</span>
                </p>

                {isUrdu && <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.98rem', color: '#1e293b', direction: 'rtl', fontFamily: "'Amiri', serif", lineHeight: 1.7 }}>
                  "{COMPLETION_KALIMAH.meaningUrdu}"
                </p>}

                {!isUrdu && <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{COMPLETION_KALIMAH.meaningEn}"
                </p>}
              </div>

              {/* 📖 Hadith Fazeelat Banner */}
              <div
                className="tasbeeh-reference"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid #a7f3d0',
                  borderRadius: '12px',
                  padding: '0.6rem 0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <span style={{ fontSize: '1.25rem', color: '#059669' }}>💫</span>
                  <div>
                    {isUrdu && <p style={{ margin: 0, fontSize: '0.92rem', color: '#065f46', direction: 'rtl', fontFamily: "'Amiri', serif", fontWeight: 700, lineHeight: 1.7 }}>
                      {COMPLETION_KALIMAH.fazeelatUrdu}
                    </p>}
                  </div>
                </div>
                <span style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>
                  📚 {COMPLETION_KALIMAH.hadithRef}
                </span>
              </div>
            </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#059669' }}></i>
                {isUrdu ? 'مستند مسنون دعا • صحیح احادیثِ مبارکہ سے تصدیق شدہ' : isArabic ? 'دعاء مأثور • المراجع الحديثية مذكورة أعلاه' : 'Sunnah supplication • Hadith references shown above'}
              </span>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => { if (navigateToTab) navigateToTab('asanNimaz'); }}
                  style={{
                    background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 14px rgba(6,78,59,0.25)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <i className="fas fa-mosque" style={{ color: '#fde68a' }}></i>
                  <span>{isUrdu ? 'آسان نماز (مکمل طریقہ و مسائل)' : isArabic ? 'دليل الصلاة' : 'Prayer Guide'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { if (navigateToTab) navigateToTab('azkar'); }}
                  style={{
                    background: '#f8fafc',
                    color: '#065f46',
                    border: '1.5px solid #a7f3d0',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <span>{isUrdu ? 'تمام اذکار و تسبیحات' : isArabic ? 'جميع الأذكار والتسبيحات' : 'All Azkar & Tasbeeh'}</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
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
