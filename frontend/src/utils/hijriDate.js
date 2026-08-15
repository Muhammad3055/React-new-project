// Dynamic Islamic / Hijri Date Helper for all countries and locations

const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

const HIJRI_MONTHS_UR = [
  'محرم الحرام', 'صفر المظفر', 'ربیع الأول', 'ربیع الثانی',
  'جمادی الأول', 'جمادی الثانی', 'رجب المرجب', 'شعبان المعظم',
  'رمضان المبارک', 'شوال المکرم', 'ذو القعدہ', 'ذو الحجہ'
];

const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

export function getFormattedHijriDate(lang = 'en', customHijri = null) {
  if (customHijri && customHijri.day) {
    const day = customHijri.day;
    const month = customHijri.month;
    const year = customHijri.year;
    if (lang === 'ur' || lang === 'br') {
      const monthName = month.ur || month.ar || month.en || '';
      return `${day} ${monthName} ${year}ھ`;
    }
    if (lang === 'ar') {
      const monthName = month.ar || month.en || '';
      return `${day} ${monthName} ${year} هـ`;
    }
    const monthName = month.en || month.ar || '';
    return `${day} ${monthName} ${year} AH`;
  }

  try {
    const localeMap = {
      en: 'en-US-u-ca-islamic-umalqura',
      ur: 'ur-PK-u-ca-islamic-umalqura',
      ar: 'ar-SA-u-ca-islamic-umalqura',
      br: 'ur-PK-u-ca-islamic-umalqura'
    };
    const locale = localeMap[lang] || localeMap.en;
    const formatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatter.format(new Date());
  } catch (e) {
    return '20 Safar 1448 AH';
  }
}
