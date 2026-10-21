import importlib
from types import SimpleNamespace
from unittest.mock import patch

from django.apps import apps
from django.test import TestCase
from django.contrib.auth.models import User

from .models import BookMedia, Topic, QuranAudio


class TopicLibraryTests(TestCase):
    def test_named_topics_are_published_and_openable(self):
        for slug in ('salah', 'quran', 'hadith', 'aqeedah', 'seerah', 'dua',
                     'ramadan', 'zakat', 'hajj', 'family'):
            response = self.client.get(f'/api/topics/{slug}/')
            self.assertEqual(response.status_code, 200, slug)
            self.assertTrue(response.json()['title'])
            self.assertIn('sections', response.json())

    def test_drafts_are_hidden_from_public_browsing(self):
        Topic.objects.create(title='Draft topic', slug='draft-topic')
        self.assertEqual(self.client.get('/api/topics/draft-topic/').status_code, 404)
        listed = self.client.get('/api/topics/').json()['results']
        self.assertNotIn('draft-topic', [topic['slug'] for topic in listed])

    def test_migration_links_matching_books_and_preserves_manual_links(self):
        matched = BookMedia.objects.create(title='A guide to Ramadan fasting')
        unrelated = BookMedia.objects.create(title='General reading')
        topic = Topic.objects.get(slug='ramadan')
        topic.books.add(unrelated)
        migration = importlib.import_module('core.migrations.0023_library_topics')
        editor = SimpleNamespace(connection=SimpleNamespace(alias="default"))
        migration.create_topics(apps, editor)
        migration.create_topics(apps, editor)
        self.assertEqual(set(topic.books.values_list('id', flat=True)), {matched.id, unrelated.id})
        self.assertFalse(Topic.objects.get(slug='hajj').books.filter(id=matched.id).exists())

    def test_chatbot_rejects_empty_prompts(self):
        response = self.client.post('/api/ai-assistant/', data={'prompt': ''}, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())


class QuranAsbabAudioTests(TestCase):
    def test_asbab_section_is_separate_from_regular_brahui_translation(self):
        staff = User.objects.create_user('audio_admin', password='password', is_staff=True)
        self.client.force_login(staff)
        response = self.client.post('/api/quran/', {
            'surah_number': '1', 'language': 'brahui',
            'destination': 'quran_brahui_asbab',
            'reciter': 'Test Qari', 'audio_url': 'https://example.com/asbab.mp3',
        })
        self.assertEqual(response.status_code, 200)
        audio = QuranAudio.objects.get(pk=response.json()['id'])
        self.assertEqual(audio.destination_folder, 'quran_brahui_asbab')
        asbab = self.client.get('/api/quran/?destination=quran_brahui_asbab&language=brahui').json()['results']
        regular = self.client.get('/api/quran/?destination=quran_brahui&language=brahui').json()['results']
        self.assertEqual([item['id'] for item in asbab], [audio.id])
        self.assertEqual(regular, [])

    def test_public_cannot_upload_quran_audio(self):
        response = self.client.post('/api/quran/', {
            'surah_number': '1', 'destination': 'quran_brahui_asbab',
            'language': 'brahui',
        })
        self.assertEqual(response.status_code, 403)


class AutomaticPrayerLocationTests(TestCase):
    @patch('core.prayer_views._read_json')
    def test_visitor_ip_returns_city_country_timezone_and_coordinates(self, read_json):
        read_json.return_value = {
            'city': 'Karachi', 'country_name': 'Pakistan', 'country_code': 'PK',
            'latitude': 24.86, 'longitude': 67.01, 'timezone': 'Asia/Karachi',
        }
        response = self.client.get('/api/prayer/location/', HTTP_X_REAL_IP='8.8.4.4')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['label'], 'Karachi, Pakistan')
        self.assertEqual(response.json()['timezone'], 'Asia/Karachi')
        self.assertEqual(response.json()['lat'], 24.86)

    def test_prayer_proxy_rejects_unapproved_paths(self):
        response = self.client.get('/api/prayer/proxy/../private')
        self.assertEqual(response.status_code, 400)

    @patch('core.prayer_views._read_json')
    def test_prayer_proxy_returns_calendar_for_coordinates(self, read_json):
        read_json.return_value = {'code': 200, 'data': [{'timings': {'Fajr': '05:00'}}]}
        response = self.client.get('/api/prayer/proxy/calendar/2026/10?latitude=24.86&longitude=67.01&school=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data'][0]['timings']['Fajr'], '05:00')
        self.assertIn('calendar/2026/10', read_json.call_args.args[0])
