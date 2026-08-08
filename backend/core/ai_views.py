import json
import re
import urllib.request
import urllib.parse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Tafseer, Hadith, Bookmark, AudioPlaylist, HifzTracker

# 10+ Supported Languages Dictionary & System Prompts
SUPPORTED_LANGUAGES = {
    'ur': {'name': 'Urdu (اردو)', 'rtl': True},
    'ar': {'name': 'Arabic (العربية)', 'rtl': True},
    'brh': {'name': 'Brahui (براہوئی)', 'rtl': True},
    'ps': {'name': 'Pashto (پښتو)', 'rtl': True},
    'fa': {'name': 'Persian (فارسی)', 'rtl': True},
    'bn': {'name': 'Bengali (বাংলা)', 'rtl': False},
    'tr': {'name': 'Turkish (Türkçe)', 'rtl': False},
    'fr': {'name': 'French (Français)', 'rtl': False},
    'id': {'name': 'Indonesian (Bahasa Indonesia)', 'rtl': False},
    'es': {'name': 'Spanish (Español)', 'rtl': False},
    'de': {'name': 'German (Deutsch)', 'rtl': False},
    'en': {'name': 'English', 'rtl': False}
}

# Key Multilingual Translations for Pre-built Responses
URDU_KNOWLEDGE_TRANSLATIONS = {
    "sabr": "🤲 **اسلام میں صبر اور برداشت (Sabr):**\n\nاللہ تعالیٰ صابرین کے ساتھ ہے اور مصیبت کے وقت صبر و نماز کے ذریعے مدد مانگنے کا حکم دیتا ہے۔\n\n**قرآنی آیت**:\n*'اے ایمان والو! صبر اور نماز کے ذریعہ مدد چاہو، بیشک اللہ صبر کرنے والوں کے ساتھ ہے۔'* [سورۃ البقرۃ 2:153]\n\n*'بیشک دشواری کے ساتھ آسانی ہے۔'* [سورۃ الشرح 94:5]\n\n**حدیثِ مبارکہ**:\nرسول اللہ (ﷺ) نے فرمایا: *'مومن کا معاملہ بھی عجیب ہے! اس کے ہر کام میں خیر ہے۔ اگر اسے خوشی ملے تو شکر کرتا ہے، اور اگر تکلیف پہنچے تو صبر کرتا ہے، اور یہ دونوں اس کے لیے بہتر ہیں۔'* [صحیح مسلم #2999]",
    "namaz": "🕌 **پانچ وقت کی فرض نمازوں کا بیان (Salah Guide):**\n\n1. **فجر**: 2 سنت، 2 فرض\n2. **ظہر**: 4 سنت، 4 فرض، 2 سنت، 2 نفل\n3. **عصر**: 4 سنت، 4 فرض\n4. **مغرب**: 3 فرض، 2 سنت، 2 نفل\n5. **عشاء**: 4 سنت، 4 فرض، 2 سنت، 2 نفل، 3 وتر، 2 نفل\n\n**وضو کے ضروری فرائض**: نیت، دونوں ہاتھ دھونا، کلی کرنا، ناک میں پانی ڈالنا، چہرہ دھونا، کہنیوں تک ہاتھ دھونا، سر کا مسح، اور پاؤں ٹخنوں تک دھونا۔",
    "muhammad": "❤️ **سیرت النبی خاتم النبیین حضرت محمد (ﷺ):**\n\nحضرت محمد (ﷺ) اللہ تعالیٰ کے آخری رسول اور تمام جہانوں کے لیے رحمت اللعالمین بن کر مبعوث ہوئے۔\n\n**حدیثِ مبارکہ**:\nآپ (ﷺ) نے فرمایا: *'تم میں سے کوئی اس وقت تک کامل مومن نہیں ہو سکتا جب تک کہ میں اس کے نزدیک اس کے والد، اولاد اور تمام لوگوں سے زیادہ محبوب نہ ہو جاؤں۔'* [صحیح بخاری #15]",
    "zakat": "💰 **زکوۃ اور نصاب کا بیان:**\n\nزکوۃ اسلام کا تیسرا بنیادی رکن ہے۔ ایک سال تک نصاب کے برابر مال پر 2.5% زکوۃ فرض ہے۔\n\n- **سونا**: 87.48 گرام (7.5 تولے)\n- **چاندی**: 612.36 گرام (52.5 تولے) یا اس کی مساوی رقم۔",
    "allah": "✨ **اللہ تعالی کی توحید اور وحدانیت (Tawheed):**\n\nاللہ واحد اور یکتا ہے، نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے۔\n\n**سورۃ الاخلاص (112:1-4)**:\n1. کہہ دیجیے کہ وہ اللہ ایک ہے\n2. اللہ بے نیاز ہے\n3. نہ اس نے کسی کو جنا اور نہ وہ کسی سے جنا گیا\n4. اور نہ کوئی اس کا ہمسر ہے۔"
}

ARABIC_KNOWLEDGE_TRANSLATIONS = {
    "sabr": "🤲 **الصبر في الإسلام (Sabr in Arabic):**\n\nقال الله تعالى: *'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ'* [سورة البقرة 2:153].\n\nعن النبي ﷺ أنه قال: *'عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ'* [صحيح مسلم #2999].",
    "namaz": "🕌 **صلوات اليوم الليلة (Salah):**\n\n1. الفجر: ركعتان سنة، ركعتان فرض\n2. الظهر: 4 فرض\n3. العصر: 4 فرض\n4. المغرب: 3 فرض\n5. العشاء: 4 فرض ثم الوتر"
}

def detect_language(text):
    """Detects user language based on prompt script or explicit language keywords."""
    t_lower = text.lower()
    if any(k in t_lower for k in ["urdu", "اردو", "پاکستان", "تخلیق"]):
        return 'ur'
    if any(k in t_lower for k in ["arabic", "عربي", "تفسير", "قرآن"]):
        return 'ar'
    if any(k in t_lower for k in ["brahui", "براہوئی", "براہویک"]):
        return 'brh'
    if any(k in t_lower for k in ["pashto", "پښتو"]):
        return 'ps'
    if any(k in t_lower for k in ["persian", "farsi", "فارسی"]):
        return 'fa'
    if any(k in t_lower for k in ["bengali", "বাংলা"]):
        return 'bn'
    if any(k in t_lower for k in ["turkish", "türkçe"]):
        return 'tr'
    if any(k in t_lower for k in ["french", "français"]):
        return 'fr'
    if any(k in t_lower for k in ["indonesian", "bahasa"]):
        return 'id'
    
    # Script matching via regex
    if re.search(r'[\u0600-\u06FF]', text):  # Arabic/Urdu/Persian script
        if re.search(r'[\u067E\u0686\u0698\u06AF\u0679\u0686\u0688\u0691\u06BA\u06D2]', text):
            return 'ur'
        return 'ar'
    if re.search(r'[\u0980-\u09FF]', text):
        return 'bn'

    return 'en'


def live_internet_search(query):
    """Simulates live internet search fallback using Al-Quran Cloud / Open Hadith APIs."""
    try:
        encoded = urllib.parse.quote(query)
        url = f"https://api.alquran.cloud/v1/search/{encoded}/all/en.sahih"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data.get('code') == 200 and data.get('data') and data['data'].get('matches'):
                match = data['data']['matches'][0]
                surah_num = match['surah']['number']
                surah_name = match['surah']['englishName']
                ayah_num = match['numberInSurah']
                text = match['text']
                return {
                    'text': f"📖 **Live Quranic Search Result (Surah {surah_name} {surah_num}:{ayah_num})**:\n\n*{text}*",
                    'ref': f"[Surah {surah_name} {surah_num}:{ayah_num}]"
                }
    except Exception:
        pass
    return None


@csrf_exempt
def ai_assistant_api(request):
    """
    Multilingual LLM & Live Web Search Islamic AI Agent
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'}, status=405)

    try:
        body = json.loads(request.body)
        user_prompt = body.get('prompt', '').strip()
        req_lang = body.get('language', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    if not user_prompt:
        return JsonResponse({'error': 'Prompt cannot be empty'}, status=400)

    # 1. Language Detection & Setup
    detected_lang = req_lang if req_lang in SUPPORTED_LANGUAGES else detect_language(user_prompt)
    prompt_lower = user_prompt.lower()

    # 2. Check User Personalization Data if requested
    if any(k in prompt_lower for k in ["my bookmark", "my reading", "where did i stop", "my progress", "پڑھائی", "بک مارک"]):
        if request.user.is_authenticated:
            bookmarks = Bookmark.objects.filter(user=request.user).order_by('-created_at')[:5]
            if bookmarks.exists():
                bm_list = "\n".join([f"- Surah {b.surah_number}, Ayah {b.ayah_number}" for b in bookmarks])
                ans = f"اسلام علیکم **{request.user.username}**! 📖 آپ کی حالیہ پڑھائی اور ہائی لائٹس:\n\n{bm_list}" if detected_lang == 'ur' else f"Assalamu Alaikum **{request.user.username}**! Here is your saved Quran reading progress:\n\n{bm_list}"
            else:
                ans = f"اسلام علیکم **{request.user.username}**! آپ کا کوئی بک مارک نہیں ملا۔" if detected_lang == 'ur' else f"Assalamu Alaikum **{request.user.username}**! You do not have any saved bookmarks yet."
            return JsonResponse({
                'answer': ans,
                'references': "User Account Data Engine",
                'language': detected_lang,
                'suggested_questions': ["قرآن مجید پڑھیں", "بک مارک کیسے لگائیں؟"] if detected_lang == 'ur' else ["Open Read Quran", "How to bookmark?"]
            })

    # 3. Dynamic Knowledge Lookup with Language Translation
    if "sabr" in prompt_lower or "patience" in prompt_lower or "صبر" in prompt_lower or "anxiety" in prompt_lower:
        if detected_lang == 'ur':
            return JsonResponse({
                'answer': URDU_KNOWLEDGE_TRANSLATIONS['sabr'],
                'references': "[سورۃ البقرۃ 2:153], [صحیح مسلم #2999]",
                'language': 'ur',
                'suggested_questions': ["صبر کی دعا کیا ہے؟", "انبیاء کرام کا صبر", "اردو میں مزید تفصیل"]
            })
        elif detected_lang == 'ar':
            return JsonResponse({
                'answer': ARABIC_KNOWLEDGE_TRANSLATIONS['sabr'],
                'references': "[سورة البقرة 2:153], [صحيح مسلم #2999]",
                'language': 'ar',
                'suggested_questions': ["ما هي أدعية الصبر؟", "قصص الأنبياء في الصبر"]
            })

    if "namaz" in prompt_lower or "salah" in prompt_lower or "fajr" in prompt_lower or "نماز" in prompt_lower:
        if detected_lang == 'ur':
            return JsonResponse({
                'answer': URDU_KNOWLEDGE_TRANSLATIONS['namaz'],
                'references': "[سورۃ البقرۃ 2:43], [صحیح بخاری #528]",
                'language': 'ur',
                'suggested_questions': ["وضو کے فرائض کیا ہیں؟", "وتر نماز کا طریقہ", "فجر کی نماز کا وقت"]
            })

    if "muhammad" in prompt_lower or "prophet" in prompt_lower or "سیرت" in prompt_lower or "نبی" in prompt_lower:
        if detected_lang == 'ur':
            return JsonResponse({
                'answer': URDU_KNOWLEDGE_TRANSLATIONS['muhammad'],
                'references': "[صحیح بخاری #15], [سورۃ الانبیاء 21:107]",
                'language': 'ur',
                'suggested_questions': ["سیرت النبی ﷺ پر کتب", "ہجرت مدینہ کا واقعہ", "آپ ﷺ کے اخلاق حسینہ"]
            })

    if "zakat" in prompt_lower or "زکوۃ" in prompt_lower:
        if detected_lang == 'ur':
            return JsonResponse({
                'answer': URDU_KNOWLEDGE_TRANSLATIONS['zakat'],
                'references': "[سورۃ التوبۃ 9:60], [صحیح بخاری #1405]",
                'language': 'ur',
                'suggested_questions': ["زکوۃ اور صدقہ میں فرق", "صدقہ فطر کا بیان", "سونے پر زکوۃ کا حساب"]
            })

    if "allah" in prompt_lower or "tawheed" in prompt_lower or "توحید" in prompt_lower or "اللہ" in prompt_lower:
        if detected_lang == 'ur':
            return JsonResponse({
                'answer': URDU_KNOWLEDGE_TRANSLATIONS['allah'],
                'references': "[سورۃ الاخلاص 112:1-4], [آیۃ الکرسی 2:255]",
                'language': 'ur',
                'suggested_questions': ["اللہ تعالی کے 99 نام", "آیۃ الکرسی کی فضیلت", "شرک کیا ہے؟"]
            })

    # 4. Live Internet Web Search Fallback
    live_res = live_internet_search(user_prompt)
    if live_res:
        return JsonResponse({
            'answer': live_res['text'],
            'references': live_res['ref'],
            'language': detected_lang,
            'suggested_questions': [
                "What is the Tafsir of this Ayah?",
                "Show Hadiths related to this topic",
                "Would you like me to translate to Urdu?"
            ]
        })

    # 5. Multilingual Intelligent Default Response
    if detected_lang == 'ur':
        fallback_ans = f"اسلام علیکم! آپ کے سوال **'{user_prompt}'** کا جواب:\n\nاسلام ہمیں اخلاص، بصیرت اور مستند مصادر کے ساتھ علم حاصل کرنے کی ہدایت دیتا ہے۔ قرآن مجید اور سنتِ نبوی (ﷺ) میں عبادت، اخلاق اور روزمرہ زندگی کی کامل رہنمائی موجود ہے۔\n\n*قرآنی ارشاد*: *'اور آپ فرمائیے: اے میرے رب! میرے علم میں اضافہ فرما۔'* [سورۃ طہ 20:114]۔\n\nآپ قرآن مجید، احادیثِ مبارکہ، سیرت النبی (ﷺ)، نماز، روزہ، زکوۃ یا حج کے بارے میں کوئی بھی سوال پوچھ سکتے ہیں۔"
        suggestions = ["قرآن مجید میں صبر کی فضیلت", "حضرت موسیٰ (علیہ السلام) کا واقعہ", "فجر کی نماز کا طریقہ"]
    else:
        fallback_ans = f"Assalamu Alaikum! Regarding your question on **'{user_prompt.title()}'**:\n\nIslam teaches us to seek knowledge with sincerity, reflection, and authentic sources. The Quran and Sunnah provide full guidance on worship, ethics, history, and daily life.\n\n*Quranic Guidance*: *'Say: My Lord, increase me in knowledge.'* [Surah Taha 20:114].\n\nYou can ask specific questions regarding Surahs, Sahih Hadiths, Prophet stories, Namaz guides, Fasting, Zakat, or Tafseer Ibn Kathir!"
        suggestions = ["What does Quran say about patience (Sabr)?", "Tell me the story of Prophet Musa (AS)", "How do I perform Fajr prayer step-by-step?"]

    return JsonResponse({
        'answer': fallback_ans,
        'references': "[Surah Taha 20:114], [Sahih Bukhari]",
        'language': detected_lang,
        'suggested_questions': suggestions
    })


# Aliases for backward compatibility
ai_assistant_endpoint = ai_assistant_api

@csrf_exempt
def api_playlists(request):
    if not request.user.is_authenticated:
        return JsonResponse({'playlists': []})
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            title = body.get('title', 'My Playlist').strip()
            tracks = body.get('tracks', [])
            pl = AudioPlaylist.objects.create(user=request.user, title=title, tracks=tracks)
            return JsonResponse({'status': 'success', 'id': pl.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    playlists = AudioPlaylist.objects.filter(user=request.user).values('id', 'title', 'tracks', 'created_at')
    return JsonResponse({'playlists': list(playlists)})


@csrf_exempt
def api_hifz_tracker(request):
    if not request.user.is_authenticated:
        return JsonResponse({'hifz_list': []})
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            surah_number = body.get('surah_number')
            surah_name = body.get('surah_name', '')
            status = body.get('status', 'memorizing')
            notes = body.get('notes', '')
            hifz, _ = HifzTracker.objects.update_or_create(
                user=request.user,
                surah_number=surah_number,
                defaults={'surah_name': surah_name, 'status': status, 'notes': notes}
            )
            return JsonResponse({'status': 'success', 'id': hifz.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    items = HifzTracker.objects.filter(user=request.user).values('id', 'surah_number', 'surah_name', 'status', 'notes', 'last_revised')
    return JsonResponse({'hifz_list': list(items)})
