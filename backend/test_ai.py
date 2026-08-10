import os
import django
import sys
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quran_project.settings")
django.setup()

from core.ai_views import generate_groq_answer
from django.conf import settings

query = "who is prophet Muhammad"
language = "en"
sources = []

print("GROQ KEY:", getattr(settings, 'GROQ_API_KEY', 'MISSING')[:10])

try:
    result = generate_groq_answer(query, language, sources)
    print("SUCCESS:")
    print(json.dumps(result, indent=2))
except Exception as e:
    print("FATAL ERROR:")
    print(e)
