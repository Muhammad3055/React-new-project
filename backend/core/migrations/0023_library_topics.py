import re

from django.db import migrations


TOPICS = [
    ('quran', 'Quran & Tafsir', 'Read, listen, and explore the meanings of the Holy Quran.'),
    ('hadith', 'Hadith & Sunnah', 'Explore the teachings and traditions of Prophet Muhammad ﷺ.'),
    ('aqeedah', 'Aqeedah (Faith)', 'Learn about Islamic beliefs and the foundations of faith.'),
    ('seerah', 'Seerah', 'Discover the life and example of Prophet Muhammad ﷺ.'),
    ('dua', 'Dua & Adhkar', 'Explore supplications and the remembrance of Allah.'),
    ('ramadan', 'Ramadan & Fasting', 'Learn about fasting, Ramadan, and spiritual preparation.'),
    ('zakat', 'Zakat & Charity', 'Explore giving, generosity, and caring for others.'),
    ('hajj', 'Hajj & Umrah', 'Learn about pilgrimage and its rites.'),
    ('family', 'Family & Character', 'Explore family life, good manners, and everyday Islamic values.'),
]


# Match subject words in existing titles; retain all manually curated links.
KEYWORDS = {
    'salah': ['salah', 'namaz', 'prayer', 'نماز', 'الصلاة'],
    'quran': ['quran', 'tafsir', 'tafseer', 'tajweed', 'surah', 'قرآن', 'القرآن', 'تفسیر'],
    'hadith': ['hadith', 'hadees', 'حدیث', 'الحديث'],
    'aqeedah': ['aqeedah', 'tawheed', 'عقیدہ', 'توحید'],
    'seerah': ['seerah', 'seerat', 'سیرت'],
    'dua': ['dua', 'adhkar', 'azkar', 'supplication', 'دعا', 'اذکار'],
    'ramadan': ['ramadan', 'ramazan', 'fasting', 'رمضان', 'روزہ'],
    'zakat': ['zakat', 'charity', 'sadaqah', 'زکوۃ', 'صدقہ'],
    'hajj': ['hajj', 'umrah', 'حج', 'عمرہ'],
    'family': ['family', 'marriage', 'character', 'manners', 'اخلاق', 'نکاح'],
}


def create_topics(apps, schema_editor):
    Topic = apps.get_model('core', 'Topic')
    for order, (slug, title, description) in enumerate(TOPICS, start=1):
        Topic.objects.using(schema_editor.connection.alias).get_or_create(
            slug=slug, defaults=dict(title=title, description=description,
                                    sort_order=order, is_published=True))

    for slug, words in KEYWORDS.items():
        topic = Topic.objects.using(schema_editor.connection.alias).filter(slug=slug).first()
        if not topic:
            continue
        pattern = re.compile(r'(?<!\w)(?:' + '|'.join(re.escape(word) for word in words) + r')(?!\w)', re.IGNORECASE)
        for relation, model_name in [('lectures', 'TaqreerAudio'), ('books', 'BookMedia'), ('videos', 'VideoMedia')]:
            Model = apps.get_model('core', model_name)
            ids = [pk for pk, title in Model.objects.using(schema_editor.connection.alias).values_list('pk', 'title') if pattern.search(title)]
            getattr(topic, relation).add(*ids)
        if slug == 'quran':
            QuranAudio = apps.get_model('core', 'QuranAudio')
            topic.quran_audios.add(*QuranAudio.objects.using(schema_editor.connection.alias).exclude(destination_folder__startswith='taqreer_').values_list('pk', flat=True))


class Migration(migrations.Migration):
    dependencies = [('core', '0022_topic')]
    operations = [migrations.RunPython(create_topics, migrations.RunPython.noop)]
