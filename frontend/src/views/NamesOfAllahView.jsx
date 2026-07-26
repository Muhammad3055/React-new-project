import React, { useState } from 'react';

export default function NamesOfAllahView() {
  const [search, setSearch] = useState('');
  const [copiedName, setCopiedName] = useState(null);

  const namesOfAllah = [
    { number: 1, arabic: 'الرَّحْمَٰنُ', transliteration: 'Ar-Rahman', meaning: 'The Most Gracious / The Compassionate', meaning_ur: 'سب سے زیادہ رحم کرنے والا', benefit: 'He who repeats this name 100 times after each prayer will be enhanced in memory and awareness.' },
    { number: 2, arabic: 'الرَّحِيمُ', transliteration: 'Ar-Rahim', meaning: 'The Most Merciful', meaning_ur: 'نہایت مہربان', benefit: 'He who repeats this name 100 times after Fajr prayer will find safety from all afflictions.' },
    { number: 3, arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', meaning: 'The King / The Sovereign', meaning_ur: 'حقیقی بادشاہ', benefit: 'He who repeats this name abundantly will be granted financial independence and respect.' },
    { number: 4, arabic: 'الْقُدُّوسُ', transliteration: 'Al-Quddus', meaning: 'The Most Holy / The Pure', meaning_ur: 'ہر عیب سے پاک', benefit: 'Reciting this name 100 times daily purifies the heart from anxiety and spiritual diseases.' },
    { number: 5, arabic: 'السَّلَامُ', transliteration: 'As-Salam', meaning: 'The Source of Peace', meaning_ur: 'سلامتی دینے والا', benefit: 'Reciting this name over a sick person 160 times helps bring healing and tranquility.' },
    { number: 6, arabic: 'الْمُؤْمِنُ', transliteration: 'Al-Mu\'min', meaning: 'The Granter of Security', meaning_ur: 'امن و امان دینے والا', benefit: 'Repeating this name 63 times when in fear protects from harm.' },
    { number: 7, arabic: 'الْمُهَيْمِنُ', transliteration: 'Al-Muhaymin', meaning: 'The Guardian / The Protector', meaning_ur: 'نگہبان و محافظ', benefit: 'He who takes a bath and offers 2 Rakaat prayer and recites this 100 times will be blessed with inner light.' },
    { number: 8, arabic: 'الْعَزِيزُ', transliteration: 'Al-Aziz', meaning: 'The All-Mighty', meaning_ur: 'سب پر غالب و عزت والا', benefit: 'He who recites this name 41 times after Fajr will be granted honor and self-reliance.' },
    { number: 9, arabic: 'الْجَبَّارُ', transliteration: 'Al-Jabbar', meaning: 'The Compeller / The Restorer', meaning_ur: 'زبردست و بنانے والا', benefit: 'He who recites this name will be protected from oppression and coercion.' },
    { number: 10, arabic: 'الْمُتَكَبِّرُ', transliteration: 'Al-Mutakabbir', meaning: 'The Supreme / The Majestic', meaning_ur: 'بزرگی و عظمت والا', benefit: 'He who recites this name before any major task will achieve righteous success.' },
    { number: 11, arabic: 'الْخَالِقُ', transliteration: 'Al-Khaliq', meaning: 'The Creator', meaning_ur: 'پیدا کرنے والا', benefit: 'He who recites this name 100 times for 7 consecutive days will have an angel created to pray on his behalf.' },
    { number: 12, arabic: 'الْبَارِئُ', transliteration: 'Al-Bari\'', meaning: 'The Maker of Order', meaning_ur: 'ٹھیک بنانے والا', benefit: 'Reciting this name helps relieve physical and mental burdens.' },
    { number: 13, arabic: 'الْمُصَوِّرُ', transliteration: 'Al-Musawwir', meaning: 'The Shaper of Beauty', meaning_ur: 'صورت گری کرنے والا', benefit: 'Reciting this name 21 times helps in creative and artistic endeavors.' },
    { number: 14, arabic: 'الْغَفَّارُ', transliteration: 'Al-Ghaffar', meaning: 'The Forgiving', meaning_ur: 'بہت بخشنے والا', benefit: 'He who repeats this name 100 times after Jumu\'ah prayer will be granted forgiveness.' },
    { number: 15, arabic: 'الْقَهَّارُ', transliteration: 'Al-Qahhar', meaning: 'The Subduer', meaning_ur: 'سب پر زبردست قاہر', benefit: 'Reciting this name helps overcome harmful desires and worldliness.' },
    { number: 16, arabic: 'الْوَهَّابُ', transliteration: 'Al-Wahhab', meaning: 'The Giver of All', meaning_ur: 'بہت عطا فرمانے والا', benefit: 'Reciting this name 40 times in Sujood brings unexpected sustenance.' },
    { number: 17, arabic: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', meaning: 'The Sustainer / The Provider', meaning_ur: 'رزق دینے والا', benefit: 'Reciting this name 10 times before Fajr brings abundant provision.' },
    { number: 18, arabic: 'الْفَتَّاحُ', transliteration: 'Al-Fattah', meaning: 'The Opener of Victory', meaning_ur: 'مشکلات کھولنے والا', benefit: 'He who places his hands on his chest and recites this 70 times after Fajr will have his heart illuminated.' },
    { number: 19, arabic: 'الْعَلِيمُ', transliteration: 'Al-\'Alim', meaning: 'The All-Knowing', meaning_ur: 'سب کچھ جاننے والا علم والا', benefit: 'He who recites this name will have a heart illuminated with divine wisdom.' },
    { number: 20, arabic: 'الْقَابِضُ', transliteration: 'Al-Qabid', meaning: 'The Restrainer', meaning_ur: 'تنگی کرنے والا', benefit: 'Writing this on 4 pieces of bread for 40 days protects from hunger and hardship.' },
    { number: 21, arabic: 'الْبَاسِطُ', transliteration: 'Al-Basit', meaning: 'The Expander / The Extender', meaning_ur: 'کشائش و وسعت دینے والا', benefit: 'He who recites this name 10 times at Ishraq prayer with hands raised will be granted wealth.' },
    { number: 22, arabic: 'الْخَافِضُ', transliteration: 'Al-Khafid', meaning: 'The Abaser', meaning_ur: 'پست کرنے والا', benefit: 'Reciting this name 500 times fulfills righteous needs.' },
    { number: 23, arabic: 'الرَّافِعُ', transliteration: 'Ar-Rafi\'', meaning: 'The Exalter', meaning_ur: 'بلند کرنے والا', benefit: 'He who recites this 100 times day and night will be elevated in honor.' },
    { number: 24, arabic: 'الْمُعِزُّ', transliteration: 'Al-Mu\'izz', meaning: 'The Bestower of Honor', meaning_ur: 'عزت دینے والا', benefit: 'Reciting this 140 times after Maghrib on Mondays or Fridays removes fear.' },
    { number: 25, arabic: 'الْمُذِلُّ', transliteration: 'Al-Mudhill', meaning: 'The Humiliator', meaning_ur: 'ذلیل کرنے والا', benefit: 'Reciting this 75 times protects against tyranny and oppression.' },
    { number: 26, arabic: 'السَّمِيعُ', transliteration: 'As-Sami\'', meaning: 'The All-Hearing', meaning_ur: 'سب کچھ سننے والا', benefit: 'Reciting this 500 times after Dhuhr prayer ensures prayers are answered.' },
    { number: 27, arabic: 'الْبَصِيرُ', transliteration: 'Al-Basir', meaning: 'The All-Seeing', meaning_ur: 'سب کچھ دیکھنے والا', benefit: 'Reciting this 100 times after Jumu\'ah prayer improves spiritual vision.' },
    { number: 28, arabic: 'الْحَكَمُ', transliteration: 'Al-Hakam', meaning: 'The Judge / The Arbitrator', meaning_ur: 'فیصلہ کرنے والا حاکم', benefit: 'Reciting this 99 times at night grants wisdom and deep understanding.' },
    { number: 29, arabic: 'الْعَدْلُ', transliteration: 'Al-\'Adl', meaning: 'The Utterly Just', meaning_ur: 'مکمل عدل کرنے والا', benefit: 'Reciting this name fosters justice and honesty in one\'s character.' },
    { number: 30, arabic: 'اللَّطِيفُ', transliteration: 'Al-Latif', meaning: 'The Subtle One / The Gracious', meaning_ur: 'نہایت باریک بین و مہربان', benefit: 'Reciting this 133 times brings relief from unexpected distress.' },
    { number: 31, arabic: 'الْخَبِيرُ', transliteration: 'Al-Khabir', meaning: 'The All-Aware', meaning_ur: 'ہر بات سے باخبر', benefit: 'Reciting this for 7 days removes harmful habits.' },
    { number: 32, arabic: 'الْحَلِيمُ', transliteration: 'Al-Halim', meaning: 'The Most Forbearing', meaning_ur: 'بردبار و صابر', benefit: 'Writing this name and placing it on crops or possessions protects them.' },
    { number: 33, arabic: 'الْعَظِيمُ', transliteration: 'Al-\'Azim', meaning: 'The Magnificent', meaning_ur: 'عظمت و بزرگی والا', benefit: 'Reciting this name frequently grants respect among people.' },
    { number: 34, arabic: 'الْغَفُورُ', transliteration: 'Al-Ghafur', meaning: 'The All-Forgiving', meaning_ur: 'بہت معاف فرمانے والا', benefit: 'Reciting this frequently cures headaches and sorrow.' },
    { number: 35, arabic: 'الشَّكُورُ', transliteration: 'Ash-Shakur', meaning: 'The Most Appreciative', meaning_ur: 'قدر دان و ثواب دینے والا', benefit: 'Reciting 41 times on water and washing the eyes improves vision and clarity.' },
    { number: 36, arabic: 'الْعَلِيُّ', transliteration: 'Al-\'Aliyy', meaning: 'The Most High', meaning_ur: 'سب سے بلند مرتبے والا', benefit: 'Reciting this daily elevates one\'s rank and knowledge.' },
    { number: 37, arabic: 'الْكَبِيرُ', transliteration: 'Al-Kabir', meaning: 'The Most Great', meaning_ur: 'سب سے بڑا', benefit: 'He who recites this 100 times daily will be esteemed by everyone.' },
    { number: 38, arabic: 'الْحَفِيظُ', transliteration: 'Al-Hafiz', meaning: 'The Preserver / The Protector', meaning_ur: 'حفاظت کرنے والا', benefit: 'Reciting 16 times daily protects against danger and calamity.' },
    { number: 39, arabic: 'الْمُقِيتُ', transliteration: 'Al-Muqit', meaning: 'The Sustainer of All', meaning_ur: 'روزی و طاقت دینے والا', benefit: 'Blowing this name onto water and drinking it satisfies spiritual hunger.' },
    { number: 40, arabic: 'الْحَسِيبُ', transliteration: 'Al-Hasib', meaning: 'The Reckoner', meaning_ur: 'کفایت کرنے والا و حساب لینے والا', benefit: 'Reciting this 70 times when facing fear brings divine protection.' },
    { number: 41, arabic: 'الْجَلِيلُ', transliteration: 'Al-Jalil', meaning: 'The Sublime One', meaning_ur: 'بزرگ و جلیل القدر', benefit: 'Writing this on paper with musk and saffron brings spiritual dignity.' },
    { number: 42, arabic: 'الْكَرِيمُ', transliteration: 'Al-Karim', meaning: 'The Most Generous', meaning_ur: 'بہت کرم کرنے والا سخی', benefit: 'Reciting this before sleeping brings honor in this life and Hereafter.' },
    { number: 43, arabic: 'الرَّقِيبُ', transliteration: 'Ar-Raqib', meaning: 'The Watchful', meaning_ur: 'نگران و دیکھنے والا', benefit: 'Reciting 7 times over family and home preserves them.' },
    { number: 44, arabic: 'الْمُجِيبُ', transliteration: 'Al-Mujib', meaning: 'The Responsive / The Answerer', meaning_ur: 'دعائیں قبول کرنے والا', benefit: 'Frequent recitation ensures supplications are accepted.' },
    { number: 45, arabic: 'الْوَاسِعُ', transliteration: 'Al-Wasi\'', meaning: 'The All-Encompassing', meaning_ur: 'وسعت والا کشادہ', benefit: 'Reciting this name eases financial constraints.' },
    { number: 46, arabic: 'الْحَكِيمُ', transliteration: 'Al-Hakim', meaning: 'The All-Wise', meaning_ur: 'حکمت والا', benefit: 'Reciting this name continuously opens doors of wisdom.' },
    { number: 47, arabic: 'الْوَدُودُ', transliteration: 'Al-Wadud', meaning: 'The Loving One', meaning_ur: 'بہت محبت کرنے والا', benefit: 'Reciting 1000 times over food and sharing it strengthens affection.' },
    { number: 48, arabic: 'الْمَجِيدُ', transliteration: 'Al-Majid', meaning: 'The Glorious', meaning_ur: 'بزرگی و شان والا', benefit: 'Reciting this name brings inner peace and nobility.' },
    { number: 49, arabic: 'الْبَاعِثُ', transliteration: 'Al-Ba\'ith', meaning: 'The Resurrector', meaning_ur: 'دوبارہ زندہ کرنے والا', benefit: 'Reciting 101 times at bedtime fills the heart with wisdom.' },
    { number: 50, arabic: 'الشَّهِيدُ', transliteration: 'Ash-Shahid', meaning: 'The All-Witnessing', meaning_ur: 'ہر جگہ حاضر و ناظر', benefit: 'Reciting this 21 times over an disobedient child guides them.' },
    { number: 51, arabic: 'الْحَقُّ', transliteration: 'Al-Haqq', meaning: 'The Absolute Truth', meaning_ur: 'برحق و سچا', benefit: 'Reciting this name brings back lost items.' },
    { number: 52, arabic: 'الْوَكِيلُ', transliteration: 'Al-Wakil', meaning: 'The Trustee / The Disposer of Affairs', meaning_ur: 'کارساز و کارفرما', benefit: 'Reciting this when facing calamity protects from harm.' },
    { number: 53, arabic: 'الْقَوِيُّ', transliteration: 'Al-Qawiyy', meaning: 'The All-Strong', meaning_ur: 'نہایت طاقتور', benefit: 'Reciting this name protects from enemies and weakness.' },
    { number: 54, arabic: 'الْمَتِينُ', transliteration: 'Al-Matin', meaning: 'The Firm / The Steadfast', meaning_ur: 'مضبوط و زبردست', benefit: 'Reciting this name gives spiritual strength.' },
    { number: 55, arabic: 'الْوَلِيُّ', transliteration: 'Al-Waliyy', meaning: 'The Protecting Friend', meaning_ur: 'سرپرست و دوست', benefit: 'Reciting this name frequently makes one a beloved servant of Allah.' },
    { number: 56, arabic: 'الْحَمِيدُ', transliteration: 'Al-Hamid', meaning: 'The Praiseworthy', meaning_ur: 'سزاوارِ حمد و تعریف', benefit: 'Reciting 93 times in solitude cleanses speech and character.' },
    { number: 57, arabic: 'الْمُحْصِي', transliteration: 'Al-Muhsi', meaning: 'The Appraiser / The Counter', meaning_ur: 'شمار کرنے والا', benefit: 'Reciting 20 times daily makes reckoning easy on Judgment Day.' },
    { number: 58, arabic: 'الْمُبْدِئُ', transliteration: 'Al-Mubdi\'', meaning: 'The Originator', meaning_ur: 'پہلی بار پیدا کرنے والا', benefit: 'Reciting this before starting a new project ensures success.' },
    { number: 59, arabic: 'الْمُعِيدُ', transliteration: 'Al-Mu\'id', meaning: 'The Restorer', meaning_ur: 'دوبارہ پیدا کرنے والا', benefit: 'Reciting 70 times for a missing person brings them back safely.' },
    { number: 60, arabic: 'الْمُحْيِي', transliteration: 'Al-Muhyi', meaning: 'The Giver of Life', meaning_ur: 'زندگی دینے والا', benefit: 'Reciting 7 times daily cures heavy burdens.' },
    { number: 61, arabic: 'الْمُمِيتُ', transliteration: 'Al-Mumit', meaning: 'The Creator of Death', meaning_ur: 'موت دینے والا', benefit: 'Reciting this destroys spiritual ego.' },
    { number: 62, arabic: 'الْحَيُّ', transliteration: 'Al-Hayy', meaning: 'The Ever-Living', meaning_ur: 'ہمیشہ زندہ رہنے والا', benefit: 'Reciting 300,000 times protects from illness.' },
    { number: 63, arabic: 'الْقَيُّومُ', transliteration: 'Al-Qayyum', meaning: 'The Sustainer of Existence', meaning_ur: 'سب کو قائم رکھنے والا', benefit: 'Reciting Ya Hayyu Ya Qayyum brings life to the heart.' },
    { number: 64, arabic: 'الْوَاجِدُ', transliteration: 'Al-Wajid', meaning: 'The Finder / The Unfailing', meaning_ur: 'پانے والا بے پرواہ', benefit: 'Reciting this while eating food brings nourishment to the heart.' },
    { number: 65, arabic: 'الْمَاجِدُ', transliteration: 'Al-Majid', meaning: 'The Noble', meaning_ur: 'عظمت و شرف والا', benefit: 'Reciting this name grants spiritual light.' },
    { number: 66, arabic: 'الْوَاحِدُ', transliteration: 'Al-Wahid', meaning: 'The Unique / The One', meaning_ur: 'اکیلا و یگانہ', benefit: 'Reciting 1000 times in solitude removes fear of creation.' },
    { number: 67, arabic: 'الأَحَدُ', transliteration: 'Al-Ahad', meaning: 'The Indivisible / The One', meaning_ur: 'ایک و لاشریک', benefit: 'Reciting 1000 times reveals spiritual secrets.' },
    { number: 68, arabic: 'الصَّمَدُ', transliteration: 'As-Samad', meaning: 'The Eternal / The Absolute', meaning_ur: 'بے نیاز و سب کا سہارا', benefit: 'Reciting 115 times at dawn protects from dependence on creation.' },
    { number: 69, arabic: 'الْقَادِرُ', transliteration: 'Al-Qadir', meaning: 'The Omnipotent', meaning_ur: 'قدرت والا توانا', benefit: 'Reciting 41 times fulfills righteous desires.' },
    { number: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'Al-Muqtadir', meaning: 'The Creator of All Power', meaning_ur: 'کامل قدرت والا', benefit: 'Reciting upon waking brings divine guidance.' },
    { number: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'Al-Muqaddim', meaning: 'The Expediter', meaning_ur: 'آگے کرنے والا', benefit: 'Reciting in battlefield or stressful situation grants courage.' },
    { number: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'Al-Mu\'akhkhir', meaning: 'The Delayer', meaning_ur: 'پیچھے کرنے والا', benefit: 'Reciting 100 times daily brings repentance.' },
    { number: 73, arabic: 'الأَوَّلُ', transliteration: 'Al-Awwal', meaning: 'The First', meaning_ur: 'سب سے پہلے وجود والا', benefit: 'Reciting 1000 times for 40 Fridays grants children.' },
    { number: 74, arabic: 'الأَخِرُ', transliteration: 'Al-Akhir', meaning: 'The Last', meaning_ur: 'سب کے بعد باقی رہنے والا', benefit: 'Reciting 1000 times grants a good end to life.' },
    { number: 75, arabic: 'الظَّاهِرُ', transliteration: 'Az-Zahir', meaning: 'The Manifest', meaning_ur: 'ظاہر و عیاں', benefit: 'Reciting 15 times after Ishraq illuminates sight.' },
    { number: 76, arabic: 'الْبَاطِنُ', transliteration: 'Al-Batin', meaning: 'The Hidden', meaning_ur: 'پوشیدہ و نہاں', benefit: 'Reciting 33 times daily brings inner enlightenment.' },
    { number: 77, arabic: 'الْوَالِي', transliteration: 'Al-Wali', meaning: 'The Supreme Governor', meaning_ur: 'مالک و حکمراں', benefit: 'Reciting over a house protects it from disaster.' },
    { number: 78, arabic: 'الْمُتَعَالِي', transliteration: 'Al-Muta\'ali', meaning: 'The Self-Exalted', meaning_ur: 'سب سے بلند و برتر', benefit: 'Reciting frequently grants high status.' },
    { number: 79, arabic: 'الْبَرُّ', transliteration: 'Al-Barr', meaning: 'The Source of All Goodness', meaning_ur: 'احسان کرنے والا نیک', benefit: 'Reciting for a child protects them from misfortune.' },
    { number: 80, arabic: 'التَّوَّابُ', transliteration: 'At-Tawwab', meaning: 'The Ever-Pardoning', meaning_ur: 'توبہ قبول کرنے والا', benefit: 'Reciting 360 times after Duha prayer grants sincere repentance.' },
    { number: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'Al-Muntaqim', meaning: 'The Avenger', meaning_ur: 'بدلہ لینے والا', benefit: 'Reciting against oppressors grants divine justice.' },
    { number: 82, arabic: 'الْعَفُوُّ', transliteration: 'Al-\'Afuww', meaning: 'The Supreme Pardoner', meaning_ur: 'معاف کر دینے والا', benefit: 'Reciting frequently forgives sins.' },
    { number: 83, arabic: 'الرَّءُوفُ', transliteration: 'Ar-Ra\'uf', meaning: 'The Most Kind', meaning_ur: 'نہایت شفقت کرنے والا', benefit: 'Reciting 10 times when angry calms emotions.' },
    { number: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Malik-ul-Mulk', meaning: 'Master of All Sovereignty', meaning_ur: 'ملک کا مالک و بادشاہ', benefit: 'Reciting constantly grants wealth and independence.' },
    { number: 85, arabic: 'ذُو الْجَلَالِ وَالإِكْرَامِ', transliteration: 'Dhul-Jalali wal-Ikram', meaning: 'Possessor of Majesty and Honor', meaning_ur: 'عظمت اور عزت والا', benefit: 'Reciting frequently brings honor and wealth.' },
    { number: 86, arabic: 'الْمُقْسِطُ', transliteration: 'Al-Muqsit', meaning: 'The Equitable', meaning_ur: 'انصاف کرنے والا', benefit: 'Reciting 700 times fulfills righteous goals.' },
    { number: 87, arabic: 'الْجَامِعُ', transliteration: 'Al-Jami\'', meaning: 'The Gatherer', meaning_ur: 'جمع کرنے والا', benefit: 'Reciting this unites separated loved ones.' },
    { number: 88, arabic: 'الْغَنِيُّ', transliteration: 'Al-Ghaniyy', meaning: 'The Self-Sufficient', meaning_ur: 'غنی و بے نیاز', benefit: 'Reciting 70 times brings contentment and prosperity.' },
    { number: 89, arabic: 'الْمُغْنِي', transliteration: 'Al-Mughni', meaning: 'The Enricher', meaning_ur: 'غنی کرنے والا بے نیاز بنانے والا', benefit: 'Reciting 1000 times for 10 Fridays removes poverty.' },
    { number: 90, arabic: 'الْمَانِعُ', transliteration: 'Al-Mani\'', meaning: 'The Withholder', meaning_ur: 'روکنے والا منسوب', benefit: 'Reciting 20 times before sleep protects marriage.' },
    { number: 91, arabic: 'الضَّارُّ', transliteration: 'Ad-Darr', meaning: 'The Creator of Harm', meaning_ur: 'نقصان کا مالک', benefit: 'Reciting 20 times on Friday night grants spiritual safety.' },
    { number: 92, arabic: 'النَّافِعُ', transliteration: 'An-Nafi\'', meaning: 'The Creator of Good', meaning_ur: 'نفع پہنچانے والا', benefit: 'Reciting before embarking on a journey ensures safety.' },
    { number: 93, arabic: 'النُّورُ', transliteration: 'An-Nur', meaning: 'The Light', meaning_ur: 'نور و روشنی بخشنے والا', benefit: 'Reciting 1001 times illuminates the heart.' },
    { number: 94, arabic: 'الْهَادِي', transliteration: 'Al-Hadi', meaning: 'The Guide', meaning_ur: 'ہدایت دینے والا', benefit: 'Reciting frequently guides the lost.' },
    { number: 95, arabic: 'الْبَدِيعُ', transliteration: 'Al-Badi\'', meaning: 'The Incomparable Originator', meaning_ur: 'بغیر مثال کے بنانے والا', benefit: 'Reciting 70 times in grief brings relief.' },
    { number: 96, arabic: 'الْبَاقِي', transliteration: 'Al-Baqi', meaning: 'The Everlasting', meaning_ur: 'ہمیشہ باقی رہنے والا', benefit: 'Reciting 100 times before sunrise protects from calamity.' },
    { number: 97, arabic: 'الْوَارِثُ', transliteration: 'Al-Warith', meaning: 'The Inheritor of All', meaning_ur: 'سب کا وارث', benefit: 'Reciting 100 times at sunrise grants long life.' },
    { number: 98, arabic: 'الرَّشِيدُ', transliteration: 'Ar-Rashid', meaning: 'The Righteous Teacher', meaning_ur: 'سیدھی راہ دکھانے والا', benefit: 'Reciting 1000 times between Maghrib and Isha completes tasks.' },
    { number: 99, arabic: 'الصَّبُورُ', transliteration: 'As-Sabur', meaning: 'The Patient One', meaning_ur: 'بہت صبر کرنے والا', benefit: 'Reciting 3000 times in hardship grants patience and victory.' }
  ];

  const filteredNames = namesOfAllah.filter(n =>
    n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
    n.meaning.toLowerCase().includes(search.toLowerCase()) ||
    n.meaning_ur.includes(search) ||
    n.arabic.includes(search) ||
    n.number.toString() === search.trim()
  );

  const handleCopy = (item) => {
    const textToCopy = `${item.number}. ${item.arabic} (${item.transliteration}) - English: ${item.meaning} | اردو: ${item.meaning_ur}`;
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
          "And to Allah belong the best names, so invoke Him by them." — (Surah Al-A'raf 7:180). Explore the 99 Beautiful Names of Allah with English & Urdu meanings and spiritual virtues.
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
        {filteredNames.map((name) => (
          <div key={name.number} className="card" style={{ padding: '1.35rem', position: 'relative', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="surah-number-badge" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
                  #{name.number}
                </span>
                <button
                  onClick={() => handleCopy(name)}
                  style={{ background: 'transparent', border: 'none', color: copiedName === name.number ? '#15803d' : '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
                  title="Copy Name & Meanings"
                >
                  <i className={`fas ${copiedName === name.number ? 'fa-check-circle' : 'fa-copy'}`}></i>
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
                <h2 className="arabic-font" style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: 700, margin: '0 0 0.2rem 0', direction: 'rtl' }}>
                  {name.arabic}
                </h2>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold-dark)', margin: 0 }}>
                  {name.transliteration}
                </h3>
                
                {/* English Meaning */}
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginTop: '0.4rem', marginBottom: '0.2rem' }}>
                  🇬🇧 {name.meaning}
                </p>

                {/* Urdu Meaning */}
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', margin: '0.2rem 0 0.5rem 0', direction: 'rtl' }}>
                  🇵🇰 اردو: {name.meaning_ur}
                </p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.75rem 0.9rem', borderRadius: '10px', borderLeft: '3px solid var(--accent-gold)', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: '1.45' }}>
                <strong style={{ color: '#0f172a' }}>Virtue:</strong> {name.benefit}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
