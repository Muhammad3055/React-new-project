import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function VideosView() {
  const { t } = useLanguage();

  return (
    <main className="container videos-coming-soon">
      <h1>{t('videoLecturesTitle', 'Video Library')}</h1>
      <p>{t('videosComingSoonTitle', 'Video content will be added soon.')}</p>
      <p lang="ur" dir="rtl">ویڈیوز جلد شامل کی جائیں گی۔</p>
    </main>
  );
}
