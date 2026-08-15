import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function NamesOfAllahView() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [copiedName, setCopiedName] = useState(null);
  const [visibleCount, setVisibleCount] = useState(18);

  const namesOfAllah = [
    { number: 1, arabic: 'الرَّحْمَٰنُ', transliteration: 'Ar-Rahman', meaning: 'The Most Gracious / The Compassionate', meaning_ur: 'سب سے زیادہ رحم کرنے والا', benefit: 'He who repeats this name 100 times after each prayer will be enhanced in memory and awareness.', benefit_ur: 'جو شخص ہر نماز کے بعد ۱۰۰ بار یہ اسم پڑھتا رہے گا، اس کا حافظہ قوی ہوگا اور غفلت و بھول چوک دور ہوگی۔' },
    { number: 2, arabic: 'الرَّحِيمُ', transliteration: 'Ar-Rahim', meaning: 'The Most Merciful', meaning_ur: 'نہایت مہربان', benefit: 'He who repeats this name 100 times after Fajr prayer will find safety from all afflictions.', benefit_ur: 'جو شخص ہر فجر کی نماز کے بعد ۱۰۰ بار ورد کرے گا، وہ تمام بلاؤں اور مصیبتوں سے محفوظ رہے گا۔' },
    { number: 3, arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', meaning: 'The King / The Sovereign', meaning_ur: 'حقیقی بادشاہ', benefit: 'He who repeats this name abundantly will be granted financial independence and respect.', benefit_ur: 'جو شخص اس اسم مبارک کا کثرت سے ورد رکھے گا، اللہ تعالی اسے مالی خود مختاری اور عزت عطا فرمائے گا۔' },
    { number: 4, arabic: 'الْقُدُّوسُ', transliteration: 'Al-Quddus', meaning: 'The Most Holy / The Pure', meaning_ur: 'ہر عیب سے پاک', benefit: 'Reciting this name 100 times daily purifies the heart from anxiety and spiritual diseases.', benefit_ur: 'روزانہ ۱۰۰ بار پڑھنے سے دل روحانی بیماریوں، وسوسوں اور پریشانیوں سے پاک صاف ہو جاتا ہے۔' },
    { number: 5, arabic: 'السَّلَامُ', transliteration: 'As-Salam', meaning: 'The Source of Peace', meaning_ur: 'سلامتی دینے والا', benefit: 'Reciting this name over a sick person 160 times helps bring healing and tranquility.', benefit_ur: 'مریض پر ۱۶۰ بار پڑھ کر دم کرنے سے اللہ تعالیٰ شفائے کاملہ اور سکون و سلامتی عطا فرماتا ہے۔' },
    { number: 6, arabic: 'الْمُؤْمِنُ', transliteration: 'Al-Mu\'min', meaning: 'The Granter of Security', meaning_ur: 'امن و امان دینے والا', benefit: 'Repeating this name 63 times when in fear protects from harm.', benefit_ur: 'خوف یا خطرے کے وقت ۶۳ بار پڑھنے سے اللہ تعالیٰ ہر قسم کے شر اور نقصان سے حفاظت فرماتا ہے۔' },
    { number: 7, arabic: 'الْمُهَيْمِنُ', transliteration: 'Al-Muhaymin', meaning: 'The Guardian / The Protector', meaning_ur: 'نگہبان و محافظ', benefit: 'He who takes a bath and offers 2 Rakaat prayer and recites this 100 times will be blessed with inner light.', benefit_ur: 'غسل کے بعد دو رکعت نفل پڑھ کر ۱۰۰ بار ورد کرنے سے باطن کا نور چمک اٹھتا ہے۔' },
    { number: 8, arabic: 'الْعَزِيزُ', transliteration: 'Al-Aziz', meaning: 'The All-Mighty', meaning_ur: 'سب پر غالب و عزت والا', benefit: 'He who recites this name 41 times after Fajr will be granted honor and self-reliance.', benefit_ur: 'نمازِ فجر کے بعد ۴۱ بار پڑھنے سے عزت، وقار اور خود داری نصیب ہوتی ہے۔' },
    { number: 9, arabic: 'الْجَبَّارُ', transliteration: 'Al-Jabbar', meaning: 'The Compeller / The Restorer', meaning_ur: 'زبردست و بنانے والا', benefit: 'He who recites this name will be protected from oppression and coercion.', benefit_ur: 'اس اسم مبارک کا ورد رکھنے والا ظالموں کے ظلم اور زبردستی سے محفوظ رہتا ہے۔' },
    { number: 10, arabic: 'الْمُتَكَبِّرُ', transliteration: 'Al-Mutakabbir', meaning: 'The Supreme / The Majestic', meaning_ur: 'بزرگی و عظمت والا', benefit: 'He who recites this name before any major task will achieve righteous success.', benefit_ur: 'کسی اہم کام کی شروعات سے پہلے پڑھنے سے اس کام میں بفضلِ خدا کامیابی نصیب ہوتی ہے۔' },
    { number: 11, arabic: 'الْخَالِقُ', transliteration: 'Al-Khaliq', meaning: 'The Creator', meaning_ur: 'پیدا کرنے والا', benefit: 'He who recites this name 100 times for 7 consecutive days will have an angel created to pray on his behalf.', benefit_ur: 'سات دن تک مسلسل ۱۰۰ بار پڑھنے والے کے لیے اللہ ایک فرشتہ پیدا کرتا ہے جو اس کی طرف سے عبادت کرتا ہے۔' },
    { number: 12, arabic: 'الْبَارِئُ', transliteration: 'Al-Bari\'', meaning: 'The Maker of Order', meaning_ur: 'ٹھیک بنانے والا', benefit: 'Reciting this name helps relieve physical and mental burdens.', benefit_ur: 'اس اسم کا ورد جسمانی و ذہنی بوجھ اور اضطراب کو دور کرتا ہے۔' },
    { number: 13, arabic: 'الْمُصَوِّرُ', transliteration: 'Al-Musawwir', meaning: 'The Shaper of Beauty', meaning_ur: 'صورت گری کرنے والا', benefit: 'Reciting this name 21 times helps in creative and artistic endeavors.', benefit_ur: '۲۱ بار پڑھ کر دم کرنے سے تخلیقی کاموں میں برکت اور خوبصورتی پیدا ہوتی ہے۔' },
    { number: 14, arabic: 'الْغَفَّارُ', transliteration: 'Al-Ghaffar', meaning: 'The Forgiving', meaning_ur: 'بہت بخشنے والا', benefit: 'He who repeats this name 100 times after Jumu\'ah prayer will be granted forgiveness.', benefit_ur: 'جمعہ کی نماز کے بعد ۱۰۰ بار پڑھنے والے کی مغفرت اور گناہوں کی بخشش ہوتی ہے۔' },
    { number: 15, arabic: 'الْقَهَّارُ', transliteration: 'Al-Qahhar', meaning: 'The Subduer', meaning_ur: 'سب پر زبردست قاہر', benefit: 'Reciting this name helps overcome harmful desires and worldliness.', benefit_ur: 'اس کا ورد نفسانی خواہشات اور دنیاوی لالچ پر قابو پانے میں مدد دیتا ہے۔' },
    { number: 16, arabic: 'الْوَهَّابُ', transliteration: 'Al-Wahhab', meaning: 'The Giver of All', meaning_ur: 'بہت عطا فرمانے والا', benefit: 'Reciting this name 40 times in Sujood brings unexpected sustenance.', benefit_ur: 'سجدے میں ۴۰ بار پڑھنے سے اللہ تعالیٰ غیب سے رزق عطا فرماتا ہے۔' },
    { number: 17, arabic: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', meaning: 'The Sustainer / The Provider', meaning_ur: 'رزق دینے والا', benefit: 'Reciting this name 10 times before Fajr brings abundant provision.', benefit_ur: 'فجر کی نماز سے پہلے ۱۰ بار پڑھنے سے رزق میں بے پناہ برکت اور وسعت ہوتی ہے۔' },
    { number: 18, arabic: 'الْفَتَّاحُ', transliteration: 'Al-Fattah', meaning: 'The Opener of Victory', meaning_ur: 'مشکلات کھولنے والا', benefit: 'He who places his hands on his chest and recites this 70 times after Fajr will have his heart illuminated.', benefit_ur: 'نماز فجر کے بعد سینے پر ہاتھ رکھ کر ۷۰ بار پڑھنے سے دل کا زنگ دور ہوتا ہے اور کامیابی کے راستے کھلتے ہیں۔' },
    { number: 19, arabic: 'الْعَلِيمُ', transliteration: 'Al-\'Alim', meaning: 'The All-Knowing', meaning_ur: 'سب کچھ جاننے والا علم والا', benefit: 'He who recites this name will have a heart illuminated with divine wisdom.', benefit_ur: 'کثرت سے پڑھنے والے کا دل حکمت، بصیرت اور الٰہی علم کے نور سے منور ہوتا ہے۔' },
    { number: 20, arabic: 'الْقَابِضُ', transliteration: 'Al-Qabid', meaning: 'The Restrainer', meaning_ur: 'تنگی کرنے والا', benefit: 'Writing this on 4 pieces of bread for 40 days protects from hunger and hardship.', benefit_ur: 'چالیس دن تک روٹی کے چار ٹکڑوں پر لکھ کر کھانے سے بھوک اور فاقے سے حفاظت رہتی ہے۔' },
    { number: 21, arabic: 'الْبَاسِطُ', transliteration: 'Al-Basit', meaning: 'The Expander / The Extender', meaning_ur: 'کشائش و وسعت دینے والا', benefit: 'He who recites this name 10 times at Ishraq prayer with hands raised will be granted wealth.', benefit_ur: 'اشراق کی نماز کے بعد ہاتھ اٹھا کر ۱۰ بار پڑھنے سے بے نیازی اور رزق کی کشائش ہوتی ہے۔' },
    { number: 22, arabic: 'الْخَافِضُ', transliteration: 'Al-Khafid', meaning: 'The Abaser', meaning_ur: 'پست کرنے والا', benefit: 'Reciting this name 500 times fulfills righteous needs.', benefit_ur: '۵۰۰ بار پڑھنے سے حاجتیں اور جائز دعائیں قبول ہوتی ہیں۔' },
    { number: 23, arabic: 'الرَّافِعُ', transliteration: 'Ar-Rafi\'', meaning: 'The Exalter', meaning_ur: 'بلند کرنے والا', benefit: 'He who recites this 100 times day and night will be elevated in honor.', benefit_ur: 'دن رات میں ۱۰۰ بار ورد کرنے والے کا مرتبہ اور عزت بلند ہوتی ہے۔' },
    { number: 24, arabic: 'الْمُعِزُّ', transliteration: 'Al-Mu\'izz', meaning: 'The Bestower of Honor', meaning_ur: 'عزت دینے والا', benefit: 'Reciting this 140 times after Maghrib on Mondays or Fridays removes fear.', benefit_ur: 'پیر یا جمعرات کی رات بعد نمازِ مغرب ۱۴۰ بار پڑھنے سے ہیبت اور خوف ختم ہوتا ہے۔' },
    { number: 25, arabic: 'الْمُذِلُّ', transliteration: 'Al-Mudhill', meaning: 'The Humiliator', meaning_ur: 'ذلیل کرنے والا', benefit: 'Reciting this 75 times protects against tyranny and oppression.', benefit_ur: '۷۵ بار پڑھنے سے دشمن کے ظلم اور حاسدوں کے شر سے نجات ملتی ہے۔' },
    { number: 26, arabic: 'السَّمِيعُ', transliteration: 'As-Sami\'', meaning: 'The All-Hearing', meaning_ur: 'سب کچھ سننے والا', benefit: 'Reciting this 500 times after Dhuhr prayer ensures prayers are answered.', benefit_ur: 'نمازِ ظہر کے بعد ۵۰۰ بار پڑھنے سے دعاؤں کی قبولیت کی بشارت ملتی ہے۔' },
    { number: 27, arabic: 'الْبَصِيرُ', transliteration: 'Al-Basir', meaning: 'The All-Seeing', meaning_ur: 'سب کچھ دیکھنے والا', benefit: 'Reciting this 100 times after Jumu\'ah prayer improves spiritual vision.', benefit_ur: 'نمازِ جمعہ کے بعد ۱۰۰ بار پڑھنے سے بصارت اور باطنی بصیرت تیز ہوتی ہے۔' },
    { number: 28, arabic: 'الْحَكَمُ', transliteration: 'Al-Hakam', meaning: 'The Judge / The Arbitrator', meaning_ur: 'فیصلہ کرنے والا حاکم', benefit: 'Reciting this 99 times at night grants wisdom and deep understanding.', benefit_ur: 'رات کے وقت ۹۹ بار ورد کرنے سے حکمت اور راز الٰہی کا انکشاف ہوتا ہے۔' },
    { number: 29, arabic: 'الْعَدْلُ', transliteration: 'Al-\'Adl', meaning: 'The Utterly Just', meaning_ur: 'مکمل عدل کرنے والا', benefit: 'Reciting this name fosters justice and honesty in one\'s character.', benefit_ur: 'اس اسم کا ورد انسان میں عدل، انصاف اور اخلاقِ حسنہ پیدا کرتا ہے۔' },
    { number: 30, arabic: 'اللَّطِيفُ', transliteration: 'Al-Latif', meaning: 'The Subtle One / The Gracious', meaning_ur: 'نہایت باریک بین و مہربان', benefit: 'Reciting this 133 times brings relief from unexpected distress.', benefit_ur: '۱۳۳ بار پڑھنے سے ہر قسم کی ناگہانی مصیبت اور پریشانی سے نجات ملتی ہے۔' },
    { number: 31, arabic: 'الْخَبِيرُ', transliteration: 'Al-Khabir', meaning: 'The All-Aware', meaning_ur: 'ہر بات سے باخبر', benefit: 'Reciting this for 7 days removes harmful habits.', benefit_ur: 'سات دن مسلسل ورد کرنے سے بری عادتوں اور وسوسوں سے چھٹکارا ملتا ہے۔' },
    { number: 32, arabic: 'الْحَلِيمُ', transliteration: 'Al-Halim', meaning: 'The Most Forbearing', meaning_ur: 'بردبار و صابر', benefit: 'Writing this name and placing it on crops or possessions protects them.', benefit_ur: 'کاغذ پر لکھ کر فصل یا سامان میں رکھنے سے وہ تلف ہونے سے محفوظ رہتے ہیں۔' },
    { number: 33, arabic: 'الْعَظِيمُ', transliteration: 'Al-\'Azim', meaning: 'The Magnificent', meaning_ur: 'عظمت و بزرگی والا', benefit: 'Reciting this name frequently grants respect among people.', benefit_ur: 'کثرت سے ورد کرنے والے کو لوگوں میں عزت، عظمت اور مقبولیت حاصل ہوتی ہے۔' },
    { number: 34, arabic: 'الْغَفُورُ', transliteration: 'Al-Ghafur', meaning: 'The All-Forgiving', meaning_ur: 'بہت معاف فرمانے والا', benefit: 'Reciting this frequently cures headaches and sorrow.', benefit_ur: 'اس کا کثرت سے ورد سر درد، غم اور ذہنی دباؤ کو دور کرتا ہے۔' },
    { number: 35, arabic: 'الشَّكُورُ', transliteration: 'Ash-Shakur', meaning: 'The Most Appreciative', meaning_ur: 'قدر دان و ثواب دینے والا', benefit: 'Reciting 41 times on water and washing the eyes improves vision and clarity.', benefit_ur: 'پانی پر ۴۱ بار دم کر کے آنکھوں پر لگانے سے آنکھوں کی روشنی تیز ہوتی ہے۔' },
    { number: 36, arabic: 'الْعَلِيُّ', transliteration: 'Al-\'Aliyy', meaning: 'The Most High', meaning_ur: 'سب سے بلند مرتبے والا', benefit: 'Reciting this daily elevates one\'s rank and knowledge.', benefit_ur: 'روزانہ پڑھنے والے کے علم، رتبے اور درجے میں بلندی آتی ہے۔' },
    { number: 37, arabic: 'الْكَبِيرُ', transliteration: 'Al-Kabir', meaning: 'The Most Great', meaning_ur: 'سب سے بڑا', benefit: 'He who recites this 100 times daily will be esteemed by everyone.', benefit_ur: 'روزانہ ۱۰۰ بار پڑھنے والا لوگوں کی نظروں میں محترم اور باوقار بنتا ہے۔' },
    { number: 38, arabic: 'الْحَفِيظُ', transliteration: 'Al-Hafiz', meaning: 'The Preserver / The Protector', meaning_ur: 'حفاظت کرنے والا', benefit: 'Reciting 16 times daily protects against danger and calamity.', benefit_ur: 'دن میں ۱۶ بار پڑھنے سے ناگہانی آفات اور خطروں سے حفاظت رہتی ہے۔' },
    { number: 39, arabic: 'الْمُقِيتُ', transliteration: 'Al-Muqit', meaning: 'The Sustainer of All', meaning_ur: 'روزی و طاقت دینے والا', benefit: 'Blowing this name onto water and drinking it satisfies spiritual hunger.', benefit_ur: 'پانی پر دم کر کے پینے سے روحانی و جسمانی توانائی میں اضافہ ہوتا ہے۔' },
    { number: 40, arabic: 'الْحَسِيبُ', transliteration: 'Al-Hasib', meaning: 'The Reckoner', meaning_ur: 'کفایت کرنے والا و حساب لینے والا', benefit: 'Reciting this 70 times when facing fear brings divine protection.', benefit_ur: 'خوف کے وقت ۷۰ بار پڑھنے سے اللہ تعالیٰ کی کفایت و حفاظت حاصل ہوتی ہے۔' },
    { number: 41, arabic: 'الْجَلِيلُ', transliteration: 'Al-Jalil', meaning: 'The Sublime One', meaning_ur: 'بزرگ و جلیل القدر', benefit: 'Writing this on paper with musk and saffron brings spiritual dignity.', benefit_ur: 'مشک و زعفران سے لکھ کر پاس رکھنے سے بزرگی اور رعب پیدا ہوتا ہے۔' },
    { number: 42, arabic: 'الْكَرِيمُ', transliteration: 'Al-Karim', meaning: 'The Most Generous', meaning_ur: 'بہت کرم کرنے والا سخی', benefit: 'Reciting this before sleeping brings honor in this life and Hereafter.', benefit_ur: 'سوتے وقت پڑھنے سے دنیا و آخرت میں عزت و کرامت نصیب ہوتی ہے۔' },
    { number: 43, arabic: 'الرَّقِيبُ', transliteration: 'Ar-Raqib', meaning: 'The Watchful', meaning_ur: 'نگران و دیکھنے والا', benefit: 'Reciting 7 times over family and home preserves them.', benefit_ur: 'اہل و عیال اور گھر پر ۷ بار دم کرنے سے وہ چوری اور نقصان سے محفوظ رہتے ہیں۔' },
    { number: 44, arabic: 'الْمُجِيبُ', transliteration: 'Al-Mujib', meaning: 'The Responsive / The Answerer', meaning_ur: 'دعائیں قبول کرنے والا', benefit: 'Frequent recitation ensures supplications are accepted.', benefit_ur: 'کثرت سے پڑھنے سے دعائیں جلدی بارگاہِ الٰہی میں قبول ہوتی ہیں۔' },
    { number: 45, arabic: 'الْوَاسِعُ', transliteration: 'Al-Wasi\'', meaning: 'The All-Encompassing', meaning_ur: 'وسعت والا کشادہ', benefit: 'Reciting this name eases financial constraints.', benefit_ur: 'اس اسم کا ورد تنگیِ رزق اور معاشی مشکلات کو دور کرتا ہے۔' },
    { number: 46, arabic: 'الْحَكِيمُ', transliteration: 'Al-Hakim', meaning: 'The All-Wise', meaning_ur: 'حکمت والا', benefit: 'Reciting this name continuously opens doors of wisdom.', benefit_ur: 'مسلسل ورد کرنے سے دانائی اور دانشمندانہ فیصلے کرنے کی صلاحیت بڑھتی ہے۔' },
    { number: 47, arabic: 'الْوَدُودُ', transliteration: 'Al-Wadud', meaning: 'The Loving One', meaning_ur: 'بہت محبت کرنے والا', benefit: 'Reciting 1000 times over food and sharing it strengthens affection.', benefit_ur: 'کھانے پر ۱۰۰۰ بار دم کر کے کھلانے سے میاں بیوی اور رشتوں میں محبت بڑھتی ہے۔' },
    { number: 48, arabic: 'الْمَجِيدُ', transliteration: 'Al-Majid', meaning: 'The Glorious', meaning_ur: 'بزرگی و شان والا', benefit: 'Reciting this name brings inner peace and nobility.', benefit_ur: 'پڑھنے والے کو قلبی سکون، روحانی پاکیزگی اور عزت حاصل ہوتی ہے۔' },
    { number: 49, arabic: 'الْبَاعِثُ', transliteration: 'Al-Ba\'ith', meaning: 'The Resurrector', meaning_ur: 'دوبارہ زندہ کرنے والا', benefit: 'Reciting 101 times at bedtime fills the heart with wisdom.', benefit_ur: 'سوتے وقت ۱۰۱ بار سینے پر ہاتھ رکھ کر پڑھنے سے دل معرفت سے بھر جاتا ہے۔' },
    { number: 50, arabic: 'الشَّهِيدُ', transliteration: 'Ash-Shahid', meaning: 'The All-Witnessing', meaning_ur: 'ہر جگہ حاضر و ناظر', benefit: 'Reciting this 21 times over an disobedient child guides them.', benefit_ur: 'نافرمان بچے کے لیے ۲۱ بار صبح پڑھ کر دم کرنے سے وہ نیک بنتا ہے۔' },
    { number: 51, arabic: 'الْحَقُّ', transliteration: 'Al-Haqq', meaning: 'The Absolute Truth', meaning_ur: 'برحق و سچا', benefit: 'Reciting this name brings back lost items.', benefit_ur: 'کثرت سے ورد کرنے سے گمشدہ چیز مل جاتی ہے اور سچائی ظاہر ہوتی ہے۔' },
    { number: 52, arabic: 'الْوَكِيلُ', transliteration: 'Al-Wakil', meaning: 'The Trustee / The Disposer of Affairs', meaning_ur: 'کارساز و کارفرما', benefit: 'Reciting this when facing calamity protects from harm.', benefit_ur: 'مصیبت کے وقت پڑھنے سے اللہ تعالیٰ بندے کا بہترین کارساز بن جاتا ہے۔' },
    { number: 53, arabic: 'الْقَوِيُّ', transliteration: 'Al-Qawiyy', meaning: 'The All-Strong', meaning_ur: 'نہایت طاقتور', benefit: 'Reciting this name protects from enemies and weakness.', benefit_ur: 'دشمن کے شر، کمزوری اور خوف پر غالب آنے کے لیے بے حد مفید ہے۔' },
    { number: 54, arabic: 'الْمَتِينُ', transliteration: 'Al-Matin', meaning: 'The Firm / The Steadfast', meaning_ur: 'مضبوط و زبردست', benefit: 'Reciting this name gives spiritual strength.', benefit_ur: 'اس اسم کا ورد انسان کو روحانی و جسمانی طور پر مضبوط بناتا ہے۔' },
    { number: 55, arabic: 'الْوَلِيُّ', transliteration: 'Al-Waliyy', meaning: 'The Protecting Friend', meaning_ur: 'سرپرست و دوست', benefit: 'Reciting this name frequently makes one a beloved servant of Allah.', benefit_ur: 'کثرت سے ورد کرنے والا اللہ کا محبوب و مقبول بندہ بن جاتا ہے۔' },
    { number: 56, arabic: 'الْحَمِيدُ', transliteration: 'Al-Hamid', meaning: 'The Praiseworthy', meaning_ur: 'سزاوارِ حمد و تعریف', benefit: 'Reciting 93 times in solitude cleanses speech and character.', benefit_ur: 'تنہائی میں ۹۳ بار پڑھنے سے زبان اور اخلاق سنور جاتے ہیں۔' },
    { number: 57, arabic: 'الْمُحْصِي', transliteration: 'Al-Muhsi', meaning: 'The Appraiser / The Counter', meaning_ur: 'شمار کرنے والا', benefit: 'Reciting 20 times daily makes reckoning easy on Judgment Day.', benefit_ur: 'روزانہ ۲۰ بار پڑھنے سے قیامت کے دن کا حساب آسان ہوگا۔' },
    { number: 58, arabic: 'الْمُبْدِئُ', transliteration: 'Al-Mubdi\'', meaning: 'The Originator', meaning_ur: 'پہلی بار پیدا کرنے والا', benefit: 'Reciting this before starting a new project ensures success.', benefit_ur: 'نیا کام شروع کرتے وقت پڑھنے سے اس میں برکت اور کامرانی ہوتی ہے۔' },
    { number: 59, arabic: 'الْمُعِيدُ', transliteration: 'Al-Mu\'id', meaning: 'The Restorer', meaning_ur: 'دوبارہ پیدا کرنے والا', benefit: 'Reciting 70 times for a missing person brings them back safely.', benefit_ur: 'گم شدہ یا سفر سے غائب شخص کی سلامتی کے لیے ۷۰ بار پڑھنا مفید ہے۔' },
    { number: 60, arabic: 'الْمُحْيِي', transliteration: 'Al-Muhyi', meaning: 'The Giver of Life', meaning_ur: 'زندگی دینے والا', benefit: 'Reciting 7 times daily cures heavy burdens.', benefit_ur: 'روزانہ ۷ بار پڑھنے سے سخت بیماریاں اور دکھ دور ہوتے ہیں۔' },
    { number: 61, arabic: 'الْمُمِيتُ', transliteration: 'Al-Mumit', meaning: 'The Creator of Death', meaning_ur: 'موت دینے والا', benefit: 'Reciting this destroys spiritual ego.', benefit_ur: 'اس اسم کا ورد نفسِ امارہ اور برے جذبات کا خاتمہ کرتا ہے۔' },
    { number: 62, arabic: 'الْحَيُّ', transliteration: 'Al-Hayy', meaning: 'The Ever-Living', meaning_ur: 'ہمیشہ زندہ رہنے والا', benefit: 'Reciting 300,000 times protects from illness.', benefit_ur: 'کثرت سے ورد کرنے والے کو صحتِ کاملہ اور لمبی عمر کی برکت ملتی ہے۔' },
    { number: 63, arabic: 'الْقَيُّومُ', transliteration: 'Al-Qayyum', meaning: 'The Sustainer of Existence', meaning_ur: 'سب کو قائم رکھنے والا', benefit: 'Reciting Ya Hayyu Ya Qayyum brings life to the heart.', benefit_ur: 'یا حی یا قیوم کا ورد دل کو زندہ اور روشن رکھتا ہے۔' },
    { number: 64, arabic: 'الْوَاجِدُ', transliteration: 'Al-Wajid', meaning: 'The Finder / The Unfailing', meaning_ur: 'پانے والا بے پرواہ', benefit: 'Reciting this while eating food brings nourishment to the heart.', benefit_ur: 'کھاتے وقت پڑھنے سے قلب کو نور اور غنا حاصل ہوتا ہے۔' },
    { number: 65, arabic: 'الْمَاجِدُ', transliteration: 'Al-Majid', meaning: 'The Noble', meaning_ur: 'عظمت و شرف والا', benefit: 'Reciting this name grants spiritual light.', benefit_ur: 'اس کے ورد سے انسان کو روحانی بزرگی اور شرافت ملتی ہے۔' },
    { number: 66, arabic: 'الْوَاحِدُ', transliteration: 'Al-Wahid', meaning: 'The Unique / The One', meaning_ur: 'اکیلا و یگانہ', benefit: 'Reciting 1000 times in solitude removes fear of creation.', benefit_ur: 'تنہائی میں ۱۰۰0 بار پڑھنے سے دل سے مخلوق کا خوف نکل جاتا ہے۔' },
    { number: 67, arabic: 'الأَحَدُ', transliteration: 'Al-Ahad', meaning: 'The Indivisible / The One', meaning_ur: 'ایک و لاشریک', benefit: 'Reciting 1000 times reveals spiritual secrets.', benefit_ur: '۱۰۰۰ بار ورد کرنے سے باطنی و روحانی اسرار کھلتے ہیں۔' },
    { number: 68, arabic: 'الصَّمَدُ', transliteration: 'As-Samad', meaning: 'The Eternal / The Absolute', meaning_ur: 'بے نیاز و سب کا سہارا', benefit: 'Reciting 115 times at dawn protects from dependence on creation.', benefit_ur: 'صبح کے وقت ۱۱۵ بار پڑھنے والا مخلوق کا محتاج نہیں رہتا۔' },
    { number: 69, arabic: 'الْقَادِرُ', transliteration: 'Al-Qadir', meaning: 'The Omnipotent', meaning_ur: 'قدرت والا توانا', benefit: 'Reciting 41 times fulfills righteous desires.', benefit_ur: '۴۱ بار پڑھنے سے جائز خواہشات اور مقصد پورا ہوتا ہے۔' },
    { number: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'Al-Muqtadir', meaning: 'The Creator of All Power', meaning_ur: 'کامل قدرت والا', benefit: 'Reciting upon waking brings divine guidance.', benefit_ur: 'سو کر اٹھتے ہی پڑھنے سے دل ہدایت و نور پر قائم رہتا ہے۔' },
    { number: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'Al-Muqaddim', meaning: 'The Expediter', meaning_ur: 'آگے کرنے والا', benefit: 'Reciting in battlefield or stressful situation grants courage.', benefit_ur: 'مشکل و خوفناک حالات میں پڑھنے سے ہمت و شجاعت ملتی ہے۔' },
    { number: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'Al-Mu\'akhkhir', meaning: 'The Delayer', meaning_ur: 'پیچھے کرنے والا', benefit: 'Reciting 100 times daily brings repentance.', benefit_ur: 'روزانہ ۱۰۰ بار پڑھنے سے توبہ کی توفیق اور استقامت ملتی ہے۔' },
    { number: 73, arabic: 'الأَوَّلُ', transliteration: 'Al-Awwal', meaning: 'The First', meaning_ur: 'سب سے پہلے وجود والا', benefit: 'Reciting 1000 times for 40 Fridays grants children.', benefit_ur: '۴۰ جمعہ تک ۱۰۰۰ بار پڑھنے سے اللہ نیک اولاد عطا فرماتا ہے۔' },
    { number: 74, arabic: 'الأَخِرُ', transliteration: 'Al-Akhir', meaning: 'The Last', meaning_ur: 'سب کے بعد باقی رہنے والا', benefit: 'Reciting 1000 times grants a good end to life.', benefit_ur: '۱۰۰۰ بار پڑھنے والے کا خاتمہ ایمان بالخیر پر ہوتا ہے۔' },
    { number: 75, arabic: 'الظَّاهِرُ', transliteration: 'Az-Zahir', meaning: 'The Manifest', meaning_ur: 'ظاہر و عیاں', benefit: 'Reciting 15 times after Ishraq illuminates sight.', benefit_ur: 'اشراق کے بعد ۱۵ بار پڑھنے سے آنکھوں کی روشنی اور دل کا نور بڑھتا ہے۔' },
    { number: 76, arabic: 'الْبَاطِنُ', transliteration: 'Al-Batin', meaning: 'The Hidden', meaning_ur: 'پوشیدہ و نہاں', benefit: 'Reciting 33 times daily brings inner enlightenment.', benefit_ur: 'روزانہ ۳۳ بار پڑھنے سے باطنی اور روحانی علوم کھلتے ہیں۔' },
    { number: 77, arabic: 'الْوَالِي', transliteration: 'Al-Wali', meaning: 'The Supreme Governor', meaning_ur: 'مالک و حکمراں', benefit: 'Reciting over a house protects it from disaster.', benefit_ur: 'گھر میں پڑھنے سے گھر تمام آفتوں اور ناگہانی بلاؤں سے محفوظ رہتا ہے۔' },
    { number: 78, arabic: 'الْمُتَعَالِي', transliteration: 'Al-Muta\'ali', meaning: 'The Self-Exalted', meaning_ur: 'سب سے بلند و برتر', benefit: 'Reciting frequently grants high status.', benefit_ur: 'کثرت سے ورد کرنے سے رتبہ، عہدہ اور شان بلند ہوتی ہے۔' },
    { number: 79, arabic: 'الْبَرُّ', transliteration: 'Al-Barr', meaning: 'The Source of All Goodness', meaning_ur: 'احسان کرنے والا نیک', benefit: 'Reciting for a child protects them from misfortune.', benefit_ur: 'بچوں کے لیے پڑھنے سے وہ حوادث اور برائیوں سے محفوظ رہتے ہیں۔' },
    { number: 80, arabic: 'التَّوَّابُ', transliteration: 'At-Tawwab', meaning: 'The Ever-Pardoning', meaning_ur: 'توبہ قبول کرنے والا', benefit: 'Reciting 360 times after Duha prayer grants sincere repentance.', benefit_ur: 'چاشت کی نماز کے بعد ۳۶۰ بار پڑھنے سے سچی توبہ نصیب ہوتی ہے۔' },
    { number: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'Al-Muntaqim', meaning: 'The Avenger', meaning_ur: 'بدلہ لینے والا', benefit: 'Reciting against oppressors grants divine justice.', benefit_ur: 'ظالم کے مقابلے میں پڑھنے سے غیبی مدد اور انصاف ملتا ہے۔' },
    { number: 82, arabic: 'الْعَفُوُّ', transliteration: 'Al-\'Afuww', meaning: 'The Supreme Pardoner', meaning_ur: 'معاف کر دینے والا', benefit: 'Reciting frequently forgives sins.', benefit_ur: 'کثرت سے پڑھنے والے کے گناہ معاف اور خطائیں بخش دی جاتی ہیں۔' },
    { number: 83, arabic: 'الرَّءُوفُ', transliteration: 'Ar-Ra\'uf', meaning: 'The Most Kind', meaning_ur: 'نہایت شفقت کرنے والا', benefit: 'Reciting 10 times when angry calms emotions.', benefit_ur: 'غصے کے وقت ۱۰ بار پڑھنے سے غصہ فوری ٹھنڈا ہو جاتا ہے۔' },
    { number: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Malik-ul-Mulk', meaning: 'Master of All Sovereignty', meaning_ur: 'ملک کا مالک و بادشاہ', benefit: 'Reciting constantly grants wealth and independence.', benefit_ur: 'ہمیشہ پڑھنے والا غنی اور خود دار رہتا ہے۔' },
    { number: 85, arabic: 'ذُو الْجَلَالِ وَالإِكْرَامِ', transliteration: 'Dhul-Jalali wal-Ikram', meaning: 'Possessor of Majesty and Honor', meaning_ur: 'عظمت اور عزت والا', benefit: 'Reciting frequently brings honor and wealth.', benefit_ur: 'کثرت سے ورد کرنے والے کو عزت، عظمت اور نعمتیں ملتی ہیں۔' },
    { number: 86, arabic: 'الْمُقْسِطُ', transliteration: 'Al-Muqsit', meaning: 'The Equitable', meaning_ur: 'انصاف کرنے والا', benefit: 'Reciting 700 times fulfills righteous goals.', benefit_ur: '۷۰۰ بار پڑھنے سے مقاصد میں عدل اور کامیابی ملتی ہے۔' },
    { number: 87, arabic: 'الْجَامِعُ', transliteration: 'Al-Jami\'', meaning: 'The Gatherer', meaning_ur: 'جمع کرنے والا', benefit: 'Reciting this unites separated loved ones.', benefit_ur: 'بچھڑے ہوئے پیاروں کو ملانے اور باہمی اتفاق کے لیے اکسیر ہے۔' },
    { number: 88, arabic: 'الْغَنِيُّ', transliteration: 'Al-Ghaniyy', meaning: 'The Self-Sufficient', meaning_ur: 'غنی و بے نیاز', benefit: 'Reciting 70 times brings contentment and prosperity.', benefit_ur: '۷۰ بار پڑھنے سے بے نیازی، قناعت اور رزق ملتا ہے۔' },
    { number: 89, arabic: 'الْمُغْنِي', transliteration: 'Al-Mughni', meaning: 'The Enricher', meaning_ur: 'غنی کرنے والا بے نیاز بنانے والا', benefit: 'Reciting 1000 times for 10 Fridays removes poverty.', benefit_ur: '۱۰ جمعہ تک ۱۰۰۰ بار پڑھنے سے فقر و فاقہ دور ہوتا ہے۔' },
    { number: 90, arabic: 'الْمَانِعُ', transliteration: 'Al-Mani\'', meaning: 'The Withholder', meaning_ur: 'روکنے والا منسوب', benefit: 'Reciting 20 times before sleep protects marriage.', benefit_ur: 'سوتے وقت ۲۰ بار پڑھنے سے میاں بیوی میں ناچاقی دور ہوتی ہے۔' },
    { number: 91, arabic: 'الضَّارُّ', transliteration: 'Ad-Darr', meaning: 'The Creator of Harm', meaning_ur: 'نقصان کا مالک', benefit: 'Reciting 20 times on Friday night grants spiritual safety.', benefit_ur: 'جمعہ کی رات ۲۰ بار پڑھنے سے روحانی تحفظ حاصل ہوتا ہے۔' },
    { number: 92, arabic: 'النَّافِعُ', transliteration: 'An-Nafi\'', meaning: 'The Creator of Good', meaning_ur: 'نفع پہنچانے والا', benefit: 'Reciting before embarking on a journey ensures safety.', benefit_ur: 'سفر کی شروعات میں پڑھنے سے ہر قسم کی حفاظت رہتی ہے۔' },
    { number: 93, arabic: 'النُّورُ', transliteration: 'An-Nur', meaning: 'The Light', meaning_ur: 'نور و روشنی بخشنے والا', benefit: 'Reciting 1001 times illuminates the heart.', benefit_ur: '۱۰۰۱ بار پڑھنے سے دل اور چہرہ نورانی ہوتا ہے۔' },
    { number: 94, arabic: 'الْهَادِي', transliteration: 'Al-Hadi', meaning: 'The Guide', meaning_ur: 'ہدایت دینے والا', benefit: 'Reciting frequently guides the lost.', benefit_ur: 'کثرت سے پڑھنے والے کو اللہ سیدھی راہ کی ہدایت دیتا ہے۔' },
    { number: 95, arabic: 'الْبَدِيعُ', transliteration: 'Al-Badi\'', meaning: 'The Incomparable Originator', meaning_ur: 'بغیر مثال کے بنانے والا', benefit: 'Reciting 70 times in grief brings relief.', benefit_ur: 'غم اور پریشانی کے وقت ۷۰ بار پڑھنے سے کشائش ملتی ہے۔' },
    { number: 96, arabic: 'الْبَاقِي', transliteration: 'Al-Baqi', meaning: 'The Everlasting', meaning_ur: 'ہمیشہ باقی رہنے والا', benefit: 'Reciting 100 times before sunrise protects from calamity.', benefit_ur: 'سورج نکلنے سے پہلے ۱۰۰ بار پڑھنے سے ناگہانی بلاؤں سے امان ملتی ہے۔' },
    { number: 97, arabic: 'الْوَارِثُ', transliteration: 'Al-Warith', meaning: 'The Inheritor of All', meaning_ur: 'سب کا وارث', benefit: 'Reciting 100 times at sunrise grants long life.', benefit_ur: 'طلوعِ آفتاب کے وقت ۱۰۰ بار پڑھنے سے لمبی اور بابرکت عمر ملتی ہے۔' },
    { number: 98, arabic: 'الرَّشِيدُ', transliteration: 'Ar-Rashid', meaning: 'The Righteous Teacher', meaning_ur: 'سیدھی راہ دکھانے والا', benefit: 'Reciting 1000 times between Maghrib and Isha completes tasks.', benefit_ur: 'مغرب اور عشاء کے درمیان ۱۰۰۰ بار پڑھنے سے کام سنور جاتے ہیں۔' },
    { number: 99, arabic: 'الصَّبُورُ', transliteration: 'As-Sabur', meaning: 'The Patient One', meaning_ur: 'بہت صبر کرنے والا', benefit: 'Reciting 3000 times in hardship grants patience and victory.', benefit_ur: 'سخت مشکل میں ۳۰۰۰ بار پڑھنے سے صبر، استقامت اور نصرت ملتی ہے۔' }
  ];

  const filteredNames = namesOfAllah.filter(n => {
    if (!n) return false;
    const q = (search || '').trim().toLowerCase();
    if (!q) return true;
    const trans = (n.transliteration || '').toLowerCase();
    const mean = (n.meaning || '').toLowerCase();
    const meanUr = (n.meaning_ur || '').toLowerCase();
    const arab = (n.arabic || '').toLowerCase();
    const num = (n.number || '').toString();
    return trans.includes(q) || mean.includes(q) || meanUr.includes(q) || arab.includes(q) || num === q || num.includes(q);
  });

  const handleCopy = (item) => {
    const textToCopy = `${item.number}. ${item.arabic} (${item.transliteration})\nEnglish Meaning: ${item.meaning}\nاردو معنی: ${item.meaning_ur}\nEnglish Virtue: ${item.benefit}\nاردو فضیلت: ${item.benefit_ur}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedName(item.number);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      {/* Header Banner */}
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>
          <i className="fas fa-star" style={{ color: 'var(--accent-gold)' }}></i> Asma ul Husna — 99 Names of Allah (أسماء الله الحسنى)
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '720px', marginInline: 'auto' }}>
          "And to Allah belong the best names, so invoke Him by them." — (Surah Al-A'raf 7:180). Explore the 99 Beautiful Names of Allah with English & Urdu meanings and spiritual virtues (فضائل و برکات).
        </p>
      </div>

      {/* Search Input */}
      <div style={{ maxWidth: '540px', margin: '0 auto 2rem auto', position: 'relative' }}>
        <i className="fas fa-search" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
        <input
          type="text"
          className="form-input"
          placeholder="Search in English or Urdu (e.g. Ar-Rahman, Merciful, رحم, 1)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '2.8rem', borderRadius: '30px', border: '1.5px solid var(--accent-gold)' }}
        />
      </div>

      {/* Grid of 99 Names */}
      <div className="grid-3">
        {filteredNames.slice(0, search ? filteredNames.length : visibleCount).map((name) => (
          <div key={name.number} className="card" style={{ padding: '1.35rem', position: 'relative', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="surah-number-badge" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
                  #{name.number}
                </span>
                <button
                  onClick={() => handleCopy(name)}
                  style={{ background: 'transparent', border: 'none', color: copiedName === name.number ? '#15803d' : '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
                  title="Copy Name, Meanings & Virtues"
                >
                  <i className={`fas ${copiedName === name.number ? 'fa-check-circle' : 'fa-copy'}`}></i>
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
                {/* Arabic Name */}
                <h2 className="arabic-font" style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: 700, margin: '0 0 0.2rem 0', direction: 'rtl' }}>
                  {name.arabic}
                </h2>

                {/* Transliteration */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-gold-dark)', margin: '0 0 0.5rem 0' }}>
                  {name.transliteration}
                </h3>
                
                {/* English Meaning */}
                {/* Dynamic Primary Language Meaning */}
                <p style={{ fontSize: lang === 'en' ? '0.92rem' : '1.08rem', fontWeight: 700, color: 'var(--primary-dark)', margin: '0.4rem 0 0.6rem 0', direction: lang === 'en' ? 'ltr' : 'rtl' }}>
                  {lang === 'en' ? name.meaning : name.meaning_ur}
                </p>
              </div>
            </div>

            {/* Virtues Section (Dynamic Language) */}
            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-gold)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <p style={{ fontSize: lang === 'en' ? '0.82rem' : '0.95rem', color: '#064e3b', margin: 0, lineHeight: '1.5', direction: lang === 'en' ? 'ltr' : 'rtl' }}>
                <strong style={{ color: '#047857' }}><i className="fas fa-gem" style={{ color: 'var(--accent-gold)', marginRight: '0.25rem' }}></i> {t('fazail')}:</strong> {lang === 'en' ? name.benefit : name.benefit_ur}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button if search is empty and not all names are loaded */}
      {!search && visibleCount < filteredNames.length && (
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 18, 99))}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '25px',
              border: '2px solid var(--accent-gold)',
              background: '#ffffff',
              color: 'var(--accent-gold)',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(180, 83, 9, 0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            <i className="fas fa-chevron-down" style={{ marginRight: '0.5rem' }}></i>
            {t('loadMore') || (lang === 'ur' ? 'مزید دیکھئے' : lang === 'br' ? 'مست لوڑ بکن بو' : lang === 'ar' ? 'تحميل المزيد' : 'Load More')}
          </button>
        </div>
      )}
    </div>
  );
}
