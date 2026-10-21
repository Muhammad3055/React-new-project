import importlib
from types import SimpleNamespace

from django.apps import apps
from django.test import TestCase

from .models import BookMedia, Topic


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
