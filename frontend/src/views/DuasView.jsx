import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function DuasView({ playTrack, user }) {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState({});

  const categories = [
    { id: 'all', label: 'All Du\'as (تمام مسنون دعائیں)', icon: 'fas fa-hands' },
    { id: 'morning', label: 'Morning Adhkar (صبح کے اذکار)', icon: 'fas fa-sun' },
    { id: 'evening', label: 'Evening Adhkar (شام کے اذکار)', icon: 'fas fa-moon' },
    { id: 'salah', label: 'After Prayer (نماز کے بعد)', icon: 'fas fa-kaaba' },
    { id: 'sleep', label: 'Sleep & Waking (سونے جاگنے)', icon: 'fas fa-bed' },
    { id: 'forgiveness', label: 'Forgiveness & Istighfar (استغفار)', icon: 'fas fa-heart' },
    { id: 'anxiety', label: 'Anxiety & Relief (پریشانی و غم)', icon: 'fas fa-shield-alt' },
    { id: 'guidance', label: 'Knowledge & Exams (علم و امتحان)', icon: 'fas fa-book-reader' },
    { id: 'travel', label: 'Travel & Home (سفر و مکان)', icon: 'fas fa-plane' },
    { id: 'eating', label: 'Food & Fasting (کھانا و روزہ)', icon: 'fas fa-utensils' },
    { id: 'family', label: 'Family & Children (اولاد و والدین)', icon: 'fas fa-users' }
  ];

  const duasData = [
    {
      id: 1,
      category: 'morning',
      title: 'Morning Remembrance for Divine Sovereignty',
      title_ur: 'صبح کا عظیم الشان ذکر',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      transliteration: 'Asbahna wa-asbahal-mulku lillah wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah',
      translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. There is no god worthy of worship except Allah alone, without partner.',
      translation_ur: 'ہم نے صبح کی اور اللہ کے تمام ملک نے صبح کی اور سب تعریف اللہ کے لیے ہے، اللہ کے سوا کوئی معبود نہیں وہ اکیلا ہے اس کا کوئی شریک نہیں۔',
      whenToPray_ur: 'ہر صبح نمازِ فجر کے بعد ۱ بار پڑھیں۔',
      recommendedCount: '1 Time (۱ بار)',
      reference: 'Sahih Muslim 2723',
      virtue_ur: 'دن بھر اللہ تعالیٰ کی حفاظت اور بادشاہی کے تحت رہنے کا عظیم ذریعہ۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3'
    },
    {
      id: 2,
      category: 'morning',
      title: 'Sayyid al-Istighfar (Master Supplication for Forgiveness)',
      title_ur: 'سید الاستغفار (استغفار کا سردار)',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      transliteration: 'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa-ana \'abduk, wa-ana \'ala \'ahdika wa-wa\'dika mas-tata\'t, a\'udhu bika min sharri ma sana\'t, abu\'u laka bi-ni\'matika \'alayya wa-abu\'u bi-dhanbi faghfir li fa-innahu la yaghfirudh-dhunuba illa ant',
      translation: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant. I am faithful to my covenant and promise as much as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me.',
      translation_ur: 'اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے ہی مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور اپنے مقدور بھر تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، اپنے اوپر تیری نعمتوں کا اعتراف کرتا ہوں اور اپنے گناہوں کا اقرار کرتا ہوں، پس مجھے بخش دے۔',
      whenToPray_ur: 'صبح اور شام باقاعدگی سے یقین کے ساتھ پڑھیں۔',
      recommendedCount: '1 Time Morning & Evening (صبح و شام ۱ بار)',
      reference: 'Sahih al-Bukhari 6306',
      virtue_ur: 'جو شخص دن یا رات میں اسے سچے دل سے پڑھے اور اسی دن فوت ہو جائے تو وہ جنتی ہے۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/255.mp3'
    },
    {
      id: 3,
      category: 'evening',
      title: 'Evening Protection from Created Evils',
      title_ur: 'شام کے وقت مخلوق کے شر سے حفاظت کی دعا',
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      transliteration: 'A\'udhu bi-kalimatil-lahit-tam-mati min sharri ma khalaq',
      translation: 'I seek refuge in the Perfect Words of Allah from the evil of what He has created.',
      translation_ur: 'میں اللہ کے مکمل کلمات کی پناہ مانگتا ہوں اس کی مخلوق کے شر سے۔',
      whenToPray_ur: 'شام کے وقت یا کسی نئے مکان/منزل پر پہنچ کر ۳ بار پڑھیں۔',
      recommendedCount: '3 Times Evening (شام کو ۳ بار)',
      reference: 'Sahih Muslim 2709',
      virtue_ur: 'اس کے پڑھنے والے کو رات بھر کوئی زہریلی چیز یا شر نقصان نہیں پہنچا سکتا۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6234.mp3'
    },
    {
      id: 4,
      category: 'evening',
      title: 'Protection from Harm in Earth and Heaven',
      title_ur: 'زمین و آسمان کی ہر بلا سے حفاظت کی دعا',
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa huwas-Sami\'ul-\'Alim',
      translation: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth or in the heaven, and He is the All-Hearing, the All-Knowing.',
      translation_ur: 'اللہ کے نام کے ساتھ جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی اور وہی سننے والا جاننے والا ہے۔',
      whenToPray_ur: 'صبح فجر اور شام مغرب کے بعد ۳، ۳ بار لازمی پڑھیں۔',
      recommendedCount: '3 Times Morning & Evening (صبح و شام ۳ بار)',
      reference: 'Sunan Abu Dawud 5088 (Sahih)',
      virtue_ur: 'جو اسے صبح و شام ۳ بار پڑھے گا اسے اچانک کوئی آفت یا زہر نقصان نہیں پہنچائے گا۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
    },
    {
      id: 5,
      category: 'salah',
      title: 'Ayat al-Kursi (The Verse of the Throne)',
      title_ur: 'آیۃ الکرسی (عظیم ترین آیت)',
      arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      transliteration: 'Allahu la ilaha illa huwal-Hayyul-Qayyum, la ta\'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard',
      translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.',
      translation_ur: 'اللہ! اس کے سوا کوئی معبود نہیں، وہ زندہ اور سب کو قائم رکھنے والا ہے، اسے نہ اونگھ آتی ہے نہ نیند، جو کچھ آسمانوں اور زمین میں ہے اسی کا ہے۔',
      whenToPray_ur: 'ہر فرض نماز کے بعد اور رات سوتے وقت ۱ بار پڑھیں۔',
      recommendedCount: '1 Time After Each Salah (ہر فرض نماز کے بعد ۱ بار)',
      reference: 'Surah Al-Baqarah 2:255 / An-Nasa\'i (Sahih)',
      virtue_ur: 'ہر فرض نماز کے بعد آیۃ الکرسی پڑھنے والے اور جنت کے درمیان صرف موت کا فاصلہ ہوتا ہے۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3'
    },
    {
      id: 6,
      category: 'salah',
      title: 'Dhikr Immediately After Completing Obligatory Salah',
      title_ur: 'سلام پھیرنے کے فوراً بعد کا ذکر',
      arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
      transliteration: 'Astaghfirullah (3x), Allahumma antas-Salam wa minkas-Salam, tabarakta ya Dhal-Jalali wal-Ikram',
      translation: 'I ask Allah for forgiveness (3 times). O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of Majesty and Honor.',
      translation_ur: 'میں اللہ سے بخشش مانگتا ہوں (۳ بار)۔ اے اللہ! تو سلامتی والا ہے اور تیری ہی طرف سے سلامتی ہے، تو بابرکت ہے اے عظمت اور عزت والے۔',
      whenToPray_ur: 'فرض نماز کے سلام کے فوراً بعد پڑھیں۔',
      recommendedCount: 'Astaghfirullah 3x + Dua 1x (استغفر اللہ ۳ بار + دعا ۱ بار)',
      reference: 'Sahih Muslim 591',
      virtue_ur: 'نبی کریم ﷺ ہر فرض نماز کے بعد یہ کلمات باقاعدگی سے فرماتے تھے۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/112.mp3'
    },
    {
      id: 7,
      category: 'sleep',
      title: 'Supplication Right Before Sleeping',
      title_ur: 'بستر پر سوتے وقت کی دعا',
      arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      transliteration: 'Bismika-Allahumma amutu wa-ahya',
      translation: 'In Your Name, O Allah, I die and I live.',
      translation_ur: 'اے اللہ! میں تیرے نام کے ساتھ ہی مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔',
      whenToPray_ur: 'بستر پر دائیں کروٹ لیٹتے وقت پڑھیں۔',
      recommendedCount: '1 Time (۱ بار)',
      reference: 'Sahih al-Bukhari 6312',
      virtue_ur: 'نیند کو اللہ کے سپرد کرنے اور تحفظ حاصل کرنے کا سنت طریقہ۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6232.mp3'
    },
    {
      id: 8,
      category: 'sleep',
      title: 'Dua Upon Waking Up in the Morning',
      title_ur: 'صبح نیند سے جاگنے کی دعا',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilaihin-nushur',
      translation: 'All praise is for Allah Who gave us life after having caused us to die, and unto Him is the resurrection.',
      translation_ur: 'سب تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے (سلانے) کے بعد دوبارہ زندگی دی اور اسی کی طرف لوٹ کر جانا ہے۔',
      whenToPray_ur: 'صبح آنکھ کھلتے ہی سب سے پہلے پڑھیں۔',
      recommendedCount: '1 Time (۱ بار)',
      reference: 'Sahih al-Bukhari 6314',
      virtue_ur: 'نئی زندگی ملنے پر اللہ تعالیٰ کا شکر ادا کرنے کی مسنون دعا۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3'
    },
    {
      id: 9,
      category: 'anxiety',
      title: 'Dua of Prophet Yunus (Jonah) in Distress & Trial',
      title_ur: 'حضرت یونس علیہ السلام کی دعا (آیتِ کریمہ)',
      arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
      transliteration: 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimin',
      translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
      translation_ur: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی ظالموں (قصورواروں) میں سے تھا۔',
      whenToPray_ur: 'کسی بھی پریشانی، دکھ، بیماری یا مصیبت کے وقت کثرت سے پڑھیں۔',
      recommendedCount: 'Abundantly / 40 Times (کثرت سے یا ۴۰ بار)',
      reference: 'Surah Al-Anbiya 21:87 / Jami` at-Tirmidhi (Sahih)',
      virtue_ur: 'جو مسلمان بھی اس دعا کے ذریعے اللہ کو پکارے گا، اللہ اس کی پریشانی ضرور دور فرمائے گا۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2570.mp3'
    },
    {
      id: 10,
      category: 'anxiety',
      title: 'Dua for Relief from Depression, Anxiety & Debt',
      title_ur: 'غم، پریشانی اور قرض سے نجات کی دعا',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
      transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazani, wal-\'ajzi wal-kasali, wal-bukhli wal-jubni, wa dal-\'id-daini wa ghalabatir-rijal',
      translation: 'O Allah, I seek refuge in You from anxiety and grief, helplessness and laziness, miserliness and cowardice, the burden of debt and being overpowered by men.',
      translation_ur: 'اے اللہ! میں پریشانی، غم، عاجزی، سستی، بخل، بزدلی، قرض کے بوجھ اور لوگوں کے تسلط سے تیری پناہ مانگتا ہوں۔',
      whenToPray_ur: 'صبح اور شام پریشانی یا قرض کی صورت میں باقاعدگی سے پڑھیں۔',
      recommendedCount: '1 or 3 Times (۱ یا ۳ بار)',
      reference: 'Sahih al-Bukhari 6369',
      virtue_ur: 'غموں کو دور کرنے اور قرضوں کی ادائیگی کا مجرب مسنون علاج۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3'
    },
    {
      id: 11,
      category: 'guidance',
      title: 'Dua for Increase in Beneficial Knowledge & Memory',
      title_ur: 'علم، حافظے اور سمجھ میں اضافے کی دعا',
      arabic: 'رَّبِّ زِدْنِي عِلْمًا',
      transliteration: 'Rabbi zidni \'ilma',
      translation: 'My Lord, increase me in knowledge.',
      translation_ur: 'اے میرے پروردگار! میرے علم میں اضافہ فرما۔',
      whenToPray_ur: 'مطالعہ کرنے، سبق یاد کرنے یا امتحان دیتے وقت کثرت سے پڑھیں۔',
      recommendedCount: 'Recite frequently (کثرت سے پڑھیں)',
      reference: 'Surah Taha 20:114',
      virtue_ur: 'علم نافع اور حافظے کی مضبوطی کے لیے قرآن پاک کی خوبصورت دعا۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2462.mp3'
    },
    {
      id: 12,
      category: 'guidance',
      title: 'Dua for Ease in Speech, Exams & Difficult Tasks',
      title_ur: 'مشکل کاموں اور امتحان میں آسانی کی دعا',
      arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي',
      transliteration: 'Rabbish-rah li sadri wa yassir li amri wahlul \'uqdatam min lisani yafqahu qawli',
      translation: 'My Lord, expand for me my chest, and ease for me my task, and untie the knot from my tongue that they may understand my speech.',
      translation_ur: 'اے میرے رب! میرا سینہ کھول دے، میرے کام کو آسان کر دے اور میری زبان کی گرہ کھول دے تاکہ لوگ میری بات سمجھ سکیں۔',
      whenToPray_ur: 'انٹرویو، تقریر، امتحان یا کسی مشکل کام سے پہلے پڑھیں۔',
      recommendedCount: '1 or 3 Times (۱ یا ۳ بار)',
      reference: 'Surah Taha 20:25-28',
      virtue_ur: 'حضرت موسیٰ علیہ السلام کی دعا جو زبان کی لکنت اور ہچکچاہٹ دور کرتی ہے۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2373.mp3'
    },
    {
      id: 13,
      category: 'eating',
      title: 'Dua Before Eating Food',
      title_ur: 'کھانا کھانے سے پہلے کی دعا',
      arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
      transliteration: 'Bismillahi wa \'ala barakatillah',
      translation: 'In the Name of Allah and upon the blessings of Allah.',
      translation_ur: 'اللہ کے نام کے ساتھ اور اللہ کی برکت پر (میں کھانا شروع کرتا ہوں)۔',
      whenToPray_ur: 'کھانا شروع کرنے سے پہلے پڑھیں۔',
      recommendedCount: '1 Time (۱ بار)',
      reference: 'Al-Mustadrak (Sahih)',
      virtue_ur: 'کھانے میں شیطانی شرکت کو روکتا ہے اور رزق میں برکت دیتا ہے۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
    },
    {
      id: 14,
      category: 'eating',
      title: 'Dua After Finishing Meal',
      title_ur: 'کھانا کھانے کے بعد کی دعا',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ',
      transliteration: 'Alhamdu lillahil-ladhi at\'amana wa saqana wa ja\'alana minal-Muslimin',
      translation: 'Praise be to Allah Who has fed us, given us drink, and made us Muslims.',
      translation_ur: 'تمام تعریفیں اللہ ہی کے لیے ہیں جس نے ہمیں کھلایا، پلایا اور ہمیں مسلمانوں میں سے بنایا۔',
      whenToPray_ur: 'کھانے سے فارغ ہو کر ہاتھ دھونے سے پہلے پڑھیں۔',
      recommendedCount: '1 Time (۱ بار)',
      reference: 'Sunan Abu Dawud 3850',
      virtue_ur: 'کھانے کی نعمت پر شکر گزاری اور گناہوں کی بخشش کا ذریعہ۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3'
    },
    {
      id: 15,
      category: 'travel',
      title: 'Dua Upon Entering Vehicle or Mounting Travel',
      title_ur: 'سواری پر بیٹھنے اور سفر شروع کرنے کی دعا',
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
      transliteration: 'Subhanal-ladhi sakkhara lana hadha wa ma kunna lahu muqrinin wa inna ila Rabbina lamunqalibun',
      translation: 'Glory to Him Who has subjected this to us, and we could not have otherwise subdued it. And indeed, to our Lord we will return.',
      translation_ur: 'پاک ہے وہ ذات جس نے اس سواری کو ہمارے تابع کر دیا حالانکہ ہم اسے قابو میں لانے والے نہ تھے اور بے شک ہم اپنے رب کی طرف لوٹنے والے ہیں۔',
      whenToPray_ur: 'گاڑی، موٹر سائیکل، بس یا جہاز پر بیٹھتے وقت پڑھیں۔',
      recommendedCount: '1 Time (۱ بار)',
      reference: 'Surah Az-Zukhruf 43:13-14',
      virtue_ur: 'سفر کے دوران حادثات اور بلاؤں سے محفوظ رہنے کی مسنون دعا۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4347.mp3'
    },
    {
      id: 16,
      category: 'travel',
      title: 'Dua Upon Entering the House',
      title_ur: 'گھر میں داخل ہوتے وقت کی دعا',
      arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
      transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa \'alallahi Rabbina tawakkalna',
      translation: 'In the name of Allah we enter, and in the name of Allah we leave, and upon Allah our Lord we rely.',
      translation_ur: 'اللہ کے نام کے ساتھ ہم داخل ہوئے اور اللہ کے نام کے ساتھ ہی ہم نکلے اور اپنے رب اللہ ہی پر ہم نے بھروسہ کیا۔',
      whenToPray_ur: 'گھر میں داخل ہوتے وقت پڑھیں اور گھر والوں کو سلام کریں۔',
      recommendedCount: '1 Time (۱ بار)',
      reference: 'Sunan Abu Dawud 5096',
      virtue_ur: 'شیطان گھر میں داخل ہونے اور رات گزارنے سے محروم ہو جاتا ہے۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
    },
    {
      id: 17,
      category: 'family',
      title: 'Dua for Pious Spouse & Righteous Offspring',
      title_ur: 'نیک شریکِ حیات اور صالح اولاد کی دعا',
      arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
      transliteration: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yunin waj\'alna lil-muttaqina imama',
      translation: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.',
      translation_ur: 'اے ہمارے پروردگار! ہمیں ہماری بیویوں اور ہماری اولاد کی طرف سے آنکھوں کی ٹھنڈک عطا فرما اور ہمیں پرہیزگاروں کا پیشوا بنا۔',
      whenToPray_ur: 'روزانہ بعد نماز یا سجدے میں کثرت سے مانگیں۔',
      recommendedCount: 'Recite frequently (کثرت سے پڑھیں)',
      reference: 'Surah Al-Furqan 25:74',
      virtue_ur: 'گھریلو سکون اور نیک نسل کی بقا کے لیے بہترین قرآنی دعا۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2927.mp3'
    },
    {
      id: 18,
      category: 'family',
      title: 'Dua for Parents (Asking Forgiveness for Parents)',
      title_ur: 'والدین کی مغفرت اور رحم کی قرآنی دعا',
      arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      transliteration: 'Rabbir-hamhuma kama rabbayani saghira',
      translation: 'My Lord, have mercy upon them both as they brought me up when I was small.',
      translation_ur: 'اے میرے رب! ان دونوں (والدین) پر رحم فرما جس طرح انہوں نے مجھے بچپن میں (محبت سے) پالا تھا۔',
      whenToPray_ur: 'والدین کی زندگی یا وفات کے بعد ان کے لیے پڑھیں۔',
      recommendedCount: 'Recite daily (روزانہ پڑھیں)',
      reference: 'Surah Al-Isra 17:24',
      virtue_ur: 'والدین کے ساتھ حسنِ سلوک اور ان کی بخشش کا سب سے بڑا ذریعہ۔',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2053.mp3'
    }
  ];

  const filteredDuas = duasData.filter((d) => {
    const matchesCat = activeCategory === 'all' || d.category === activeCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.title_ur.includes(search) ||
      d.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      d.translation.toLowerCase().includes(search.toLowerCase()) ||
      d.translation_ur.includes(search) ||
      d.arabic.includes(search);
    return matchesCat && matchesSearch;
  });

  const handleCopy = (item) => {
    const copyText = `${item.title} (${item.title_ur})\n\n${item.arabic}\n\nTransliteration: ${item.transliteration}\n\nEnglish: "${item.translation}"\n\nاردو: "${item.translation_ur}"\n\nWhen to Pray: ${item.whenToPray_ur}\nRecommended Count: ${item.recommendedCount}\nReference: ${item.reference}`;
    navigator.clipboard.writeText(copyText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlayDua = (item) => {
    if (playTrack && item.audioUrl) {
      playTrack(item.audioUrl, `${item.title} (${item.title_ur})`, 'Mishary Rashid Alafasy Recitation');
      return;
    }

    // Speech synthesis fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(item.arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.82;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBookmarkDua = (item) => {
    if (!user) {
      alert("Sign in to save this Dua to your Account Favorites!");
      return;
    }
    const updated = { ...bookmarkedIds };
    if (updated[item.id]) {
      delete updated[item.id];
      alert(`Removed "${item.title}" from your account favorites.`);
    } else {
      updated[item.id] = true;
      alert(`Saved "${item.title}" to your User Account Favorites!`);
    }
    setBookmarkedIds(updated);
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      {/* Banner */}
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>
          <i className="fas fa-hands" style={{ color: 'var(--accent-gold)' }}></i> Authentic Du'as & Daily Adhkar (جامع مسنون دعائیں و اذکار)
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.4rem', maxWidth: '750px', marginInline: 'auto' }}>
          Explore authentic supplications from the Holy Quran & Sunnah with complete English & Urdu translations, timing instructions (کب اور کتنی بار پڑھیں), and spiritual virtues.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '0.6rem 1.15rem',
              borderRadius: '30px',
              border: activeCategory === cat.id ? '2px solid var(--accent-gold)' : '1.5px solid #cbd5e1',
              background: activeCategory === cat.id ? 'rgba(245, 158, 11, 0.2)' : '#ffffff',
              color: activeCategory === cat.id ? '#b45309' : '#0f172a',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            <i className={cat.icon} style={{ color: activeCategory === cat.id ? '#b45309' : 'var(--accent-gold)' }}></i>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div style={{ maxWidth: '540px', margin: '0 auto 2rem auto', position: 'relative' }}>
        <i className="fas fa-search" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
        <input
          type="text"
          className="form-input"
          placeholder="Search in English or Urdu (e.g. Morning, Forgiveness, سفر, استغفار)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '2.8rem', borderRadius: '30px', border: '1.5px solid var(--accent-gold)' }}
        />
      </div>

      {/* Du'as List */}
      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '880px', margin: '0 auto' }}>
        {filteredDuas.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{ padding: '1.6rem', background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {/* Top Bar Badges & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-dark)', background: '#fef3c7', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '15px' }}>
                  <i className="fas fa-redo-alt" style={{ marginRight: '0.3rem' }}></i> {item.recommendedCount}
                </span>

                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857', background: '#dcfce7', border: '1px solid #a7f3d0', padding: '4px 12px', borderRadius: '15px' }}>
                  <i className="far fa-clock" style={{ marginRight: '0.3rem' }}></i> {item.whenToPray_ur}
                </span>
              </div>

              {/* Clean Icon Controls: Play Speaker Circle Button + Copy + Star Bookmark */}
              <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                {/* Audio Playback Circle Icon Button */}
                <button
                  onClick={() => handlePlayDua(item)}
                  title="Play Supplication Audio Recitation"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--accent-gold)',
                    color: 'var(--primary-dark)',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justify: 'center',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <i className="fas fa-volume-up"></i>
                </button>

                {/* Star Bookmark Icon Button */}
                <button
                  onClick={() => handleBookmarkDua(item)}
                  title="Bookmark Dua to Account"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: bookmarkedIds[item.id] ? '#fef3c7' : '#f8fafc',
                    color: bookmarkedIds[item.id] ? '#b45309' : '#64748b',
                    border: bookmarkedIds[item.id] ? '1.5px solid #fde68a' : '1px solid #e2e8f0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justify: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <i className={`${bookmarkedIds[item.id] ? 'fas' : 'far'} fa-star`}></i>
                </button>

                {/* Copy Icon Button */}
                <button
                  onClick={() => handleCopy(item)}
                  title="Copy Supplication Text"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: copiedId === item.id ? '#dcfce7' : '#f8fafc',
                    color: copiedId === item.id ? '#15803d' : '#64748b',
                    border: copiedId === item.id ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justify: 'center',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <i className={`fas ${copiedId === item.id ? 'fa-check' : 'fa-copy'}`}></i>
                </button>
              </div>
            </div>

            {/* Dua Title (Dynamic Language) */}
            <div>
              <h3 style={{ fontSize: lang === 'en' ? '1.15rem' : '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, direction: lang === 'en' ? 'ltr' : 'rtl' }}>
                {lang === 'en' ? item.title : item.title_ur}
              </h3>
            </div>

            {/* Arabic Card Box */}
            <div style={{ background: '#f8fafc', padding: '1.35rem', borderRadius: '14px', borderLeft: '4px solid var(--accent-gold)', textAlign: 'right' }}>
              <p className="arabic-font" style={{ fontSize: '1.9rem', color: '#0f172a', margin: 0, lineHeight: '1.85', direction: 'rtl', fontWeight: 700 }}>
                {item.arabic}
              </p>
            </div>

            {/* Transliteration */}
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155', fontStyle: 'italic', margin: 0 }}>
              "{item.transliteration}"
            </p>

            {/* Translation (Dynamic Language) */}
            <p style={{ fontSize: lang === 'en' ? '0.9rem' : '1.05rem', color: lang === 'en' ? '#334155' : '#047857', margin: 0, lineHeight: '1.6', direction: lang === 'en' ? 'ltr' : 'rtl', fontWeight: lang === 'en' ? 400 : 700 }}>
              {lang === 'en' ? item.translation : item.translation_ur}
            </p>

            {/* Virtues & Reference Footer Box */}
            <div style={{ background: '#f0fdf4', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #bbf7d0', marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <p className="arabic-font" style={{ fontSize: '0.95rem', color: '#064e3b', margin: 0, direction: lang === 'en' ? 'ltr' : 'rtl' }}>
                <strong style={{ color: '#047857' }}>{t('fazail')}:</strong> {item.virtue_ur}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#475569', fontWeight: 700 }}>
                <i className="fas fa-bookmark" style={{ color: 'var(--accent-gold)' }}></i>
                <span>Reference: {item.reference}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredDuas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <i className="fas fa-search fa-2x" style={{ color: 'var(--accent-gold)', marginBottom: '0.75rem' }}></i>
            <p>No supplications found matching your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
