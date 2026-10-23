from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0025_mixed_quran_audio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quranaudio',
            name='destination_folder',
            field=models.CharField(blank=True, choices=[
                ('quran_brahui', 'Brahui Quran Tarjuma MP3 (براہوئی قرآن)'),
                ('quran_brahui_asbab', 'Brahui Tarjuma with Asbab al-Nuzul MP3'),
                ('quran_urdu', 'Urdu Quran Tarjuma MP3 (اردو قرآن)'),
                ('quran_arabic', 'Arabic Surah Tilawat MP3 (عربي تلاوة)'),
                ('quran_mixed', 'Mixed Quran Audio MP3 (مکسڈ قرآن آڈیو)'),
                ('quran_mixed_tilawat', 'Mixed Quran Tilawat MP3'),
                ('taqreer_brahui', 'Brahui Taqreer Lectures (تقارير براہوئی)'),
                ('taqreer_urdu', 'Urdu Taqreer Lectures (تقارير اردو)'),
                ('taqreer_arabic', 'Arabic Taqreer Lectures (تقارير عربية)'),
            ], db_index=True, max_length=50),
        ),
        migrations.CreateModel(
            name='MixedQuranTilawat',
            fields=[],
            options={'verbose_name': 'Mixed Quran Tilawat', 'verbose_name_plural': 'Mixed Quran Tilawat', 'proxy': True, 'indexes': [], 'constraints': []},
            bases=('core.quranaudio',),
        ),
    ]
