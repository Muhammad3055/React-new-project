from django.db import migrations, models


def create_salah_topic(apps, schema_editor):
    Topic = apps.get_model('core', 'Topic')
    Topic.objects.get_or_create(
        slug='salah',
        defaults={
            'title': 'Salah (Prayer)',
            'description': 'Explore Quran recitations, lectures, books, and videos about Salah. More resources will appear as editors link existing library items.',
            'is_published': True,
            'sort_order': 0,
        },
    )


class Migration(migrations.Migration):
    dependencies = [('core', '0021_quranaudio_destination_folder_and_more')]

    operations = [
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=120)),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('description', models.TextField(blank=True)),
                ('is_published', models.BooleanField(default=False)),
                ('sort_order', models.PositiveIntegerField(default=0)),
                ('books', models.ManyToManyField(blank=True, related_name='topics', to='core.bookmedia')),
                ('lectures', models.ManyToManyField(blank=True, related_name='topics', to='core.taqreeraudio')),
                ('quran_audios', models.ManyToManyField(blank=True, related_name='topics', to='core.quranaudio')),
                ('videos', models.ManyToManyField(blank=True, related_name='topics', to='core.videomedia')),
            ],
            options={'ordering': ['sort_order', 'title']},
        ),
        migrations.RunPython(create_salah_topic, migrations.RunPython.noop),
    ]
