// Dynamic Islamic / Hijri Date Helper

export function getFormattedHijriDate(lang = 'en', customHijri = null) {
  if (customHijri && customHijri.day) {
    const day = customHijri.day;
    const month = customHijri.month;
    const year = customHijri.year;
    if (lang === 'ur' || lang === 'br') {
      const monthName = month.ur || month.ar || month.en || 'صفر';
      return `${day} ${monthName} ${year}ھ`;
    }
    if (lang === 'ar') {
      const monthName = month.ar || month.en || 'صفر';
      return `${day} ${monthName} ${year} هـ`;
    }
    const monthName = month.en || month.ar || 'Safar';
    return `${day} ${monthName} ${year} AH`;
  }

  if (lang === 'ur' || lang === 'br') {
    return '۲ صفر ۱۴۴۸ھ';
  }
  if (lang === 'ar') {
    return '۲ صفر ۱۴۴۸ هـ';
  }
  return '2 Safar 1448 AH';
}
