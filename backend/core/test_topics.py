import json

from django.contrib.auth.models import User
from django.test import Client, TestCase

from .models import BookMedia, QuranAudio, Topic


class TopicApiTests(TestCase):
    def setUp(self):
        self.salah = Topic.objects.get(slug='salah')
        self.staff = User.objects.create_user('topic_editor', password='test-password', is_staff=True)
        self.audio = QuranAudio.objects.create(
            surah_number=1,
            surah_name_english='Al-Fatihah',
            surah_name_arabic='الفاتحة',
            audio_url='https://example.com/fatihah.mp3',
        )
        self.book = BookMedia.objects.create(
            title='Learning Salah', author='Test Author', pdf_url='https://example.com/salah.pdf'
        )

    def test_public_topic_is_listed_without_copying_media(self):
        self.salah.quran_audios.add(self.audio)
        self.salah.books.add(self.book)
        listing = self.client.get('/api/topics/')
        detail = self.client.get('/api/topics/salah/')
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(detail.status_code, 200)
        self.assertEqual(detail.json()['sections']['quran_audios'][0]['id'], self.audio.id)
        self.assertEqual(detail.json()['sections']['books'][0]['id'], self.book.id)
        self.assertEqual(QuranAudio.objects.count(), 1)
        self.assertEqual(BookMedia.objects.count(), 1)

    def test_draft_is_hidden_from_public(self):
        Topic.objects.create(title='Draft topic', slug='draft-topic', is_published=False)
        self.assertNotIn('draft-topic', [item['slug'] for item in self.client.get('/api/topics/').json()['results']])
        self.assertEqual(self.client.get('/api/topics/draft-topic/').status_code, 404)

    def test_staff_can_link_existing_items_with_csrf(self):
        client = Client(enforce_csrf_checks=True)
        client.force_login(self.staff)
        token = client.get('/api/admin/topics/').json()['csrf_token']
        payload = {
            'id': self.salah.id,
            'title': self.salah.title,
            'description': 'A curated Salah library.',
            'is_published': True,
            'quran_audios': [self.audio.id],
            'lectures': [],
            'books': [self.book.id],
            'videos': [],
        }
        response = client.post(
            '/api/admin/topics/', data=json.dumps(payload), content_type='application/json',
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')
        self.assertEqual(list(self.salah.books.values_list('id', flat=True)), [self.book.id])
        self.assertEqual(BookMedia.objects.count(), 1)

    def test_staff_can_create_non_english_topic_with_explicit_slug(self):
        self.client.force_login(self.staff)
        response = self.client.post('/api/admin/topics/', data=json.dumps({
            'title': 'نماز', 'slug': 'namaz', 'description': 'Prayer resources',
            'is_published': True, 'books': [self.book.id],
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['topic']['slug'], 'namaz')
        self.assertEqual(self.client.get('/api/topics/namaz/').json()['sections']['books'][0]['id'], self.book.id)

    def test_non_staff_cannot_edit_or_search_options(self):
        self.assertEqual(self.client.get('/api/admin/topics/').status_code, 403)
        self.assertEqual(self.client.get('/api/admin/topics/options/?kind=books').status_code, 403)
        response = self.client.post(
            '/api/admin/topics/', data=json.dumps({'title': 'Unwanted'}), content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_staff_write_requires_csrf_token(self):
        client = Client(enforce_csrf_checks=True)
        client.force_login(self.staff)
        response = client.post('/api/admin/topics/', data=json.dumps({
            'title': 'New topic', 'is_published': True,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 403)
        self.assertFalse(Topic.objects.filter(slug='new-topic').exists())

    def test_invalid_media_id_does_not_change_topic(self):
        self.client.force_login(self.staff)
        response = self.client.post('/api/admin/topics/', data=json.dumps({
            'id': self.salah.id, 'title': 'Changed title', 'description': '',
            'is_published': True, 'books': [999999],
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.salah.refresh_from_db()
        self.assertEqual(self.salah.title, 'Salah (Prayer)')
