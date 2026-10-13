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

export function getPrayerMethodAndAdjustment(countryCode) {
  let code = (countryCode || '').toUpperCase();
  
  if (!code) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        if (tz.includes('Karachi') || tz.includes('Asia/Karachi')) code = 'PK';
        else if (tz.includes('Kolkata') || tz.includes('Calcutta')) code = 'IN';
        else if (tz.includes('Dhaka')) code = 'BD';
        else if (tz.includes('Casablanca')) code = 'MA';
        else if (tz.includes('London')) code = 'GB';
        else if (tz.startsWith('America/')) code = 'US';
        else if (tz.includes('Cairo')) code = 'EG';
      }
    } catch (e) {}
  }

  let method = 4; // Default Umm Al-Qura
  let hijriAdjustment = 0;
  let school = 0; // 0 = Shafi/Standard, 1 = Hanafi

  if (['PK', 'IN', 'BD', 'AF'].includes(code)) {
    method = 1; // University of Islamic Sciences, Karachi
    hijriAdjustment = -1; // 1 day behind Makkah (Umm Al-Qura)
    school = 1; // Hanafi (Asr currently around 4:30 PM in Pakistan)
  } else if (['MA'].includes(code)) {
    method = 3; // Muslim World League
    hijriAdjustment = -1;
  } else if (['US', 'CA'].includes(code)) {
    method = 2; // ISNA
  } else if (['EG'].includes(code)) {
    method = 5; // Egyptian General Authority of Survey
  } else if (['GB', 'UK'].includes(code)) {
    method = 3; // Muslim World League
    hijriAdjustment = -1;
  }
  return { method, hijriAdjustment, school, countryCode: code };
}

