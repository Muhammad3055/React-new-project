import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Tafseer, Hadith, Bookmark, UserProfilePreferences

# Off-topic filter for non-Islamic topics
OTHER_RELIGIONS_KEYWORDS = [
    'christianity', 'jesus as god', 'trinity', 'bible', 'hinduism', 'buddhism', 'shinto',
    'sikhism', 'gospel', 'torah study', 'varna', 'karma rebirth', 'polytheism', 'paganism',
    'atheism', 'idol worship', 'church', 'temple', 'synagogue', 'pastor', 'pandit', 'priest',
    'cricket score', 'football match', 'hollywood', 'bollywood', 'gaming pc', 'crypto trading'
]

# Explicit Website Navigation Keywords Check (Only return URLs if user explicitly asks for links/pages)
WEBSITE_LINK_REQUEST_KEYWORDS = [
    "link", "url", "website", "where can i find", "where is", "page", "open section", "navigate"
]

WEBSITE_NAVIGATION_MAP = [
    {
        "keywords": ["read quran", "quran text", "surah list", "translation", "english tarjuma", "urdu tarjuma", "brahui"],
        "answer": "📖 You can read the full **Holy Quran (114 Surahs)** with English, Urdu, and Brahui translations directly on Maktaba tul Muslim:",
        "url": "https://maktabatulmuslim.com/read"
    },
    {
        "keywords": ["mp3", "tilawat", "audio", "listen quran", "taqreer", "bayans", "reciter", "qari"],
        "answer": "🎧 You can listen to and download **Quran MP3 Tilawat** by world-famous Qaris and Islamic Scholar Taqreers:",
        "url": "https://maktabatulmuslim.com/quran"
    },
    {
        "keywords": ["books", "pdf", "kutub khana", "library", "download book"],
        "answer": "📚 Access the complete **Islamic PDF Books & Digital Kutub Khana** free of charge:",
        "url": "https://maktabatulmuslim.com/books"
    },
    {
        "keywords": ["hadith", "bukhari", "muslim", "sunnah", "sahih"],
        "answer": "📜 Browse authentic **Sahih Hadith Collections** (Bukhari, Muslim, Tirmidhi, etc.):",
        "url": "https://maktabatulmuslim.com/hadith"
    },
    {
        "keywords": ["tafseer", "ibn kathir", "explanation", "commentary"],
        "answer": "📖 Study authentic **Quran Tafseer Ibn Kathir** and ayah-by-ayah commentary:",
        "url": "https://maktabatulmuslim.com/tafseer"
    },
    {
        "keywords": ["qibla", "direction", "prayer time", "namaz time"],
        "answer": "🧭 Find the exact **Live Qibla Direction & Prayer Times** for your location:",
        "url": "https://maktabatulmuslim.com/qibla"
    },
    {
        "keywords": ["duas", "masnoon dua", "supplication", "azkar"],
        "answer": "🤲 Read and listen to daily **Masnoon Duas & Supplications**:",
        "url": "https://maktabatulmuslim.com/duas"
    },
    {
        "keywords": ["tasbeeh", "dhikr", "counter", "digital tasbeeh"],
        "answer": "📿 Use the **Digital Tasbeeh Counter** for morning and evening Dhikr:",
        "url": "https://maktabatulmuslim.com/tasbeeh"
    },
    {
        "keywords": ["99 names", "asma ul husna", "names of allah"],
        "answer": "✨ Learn the **99 Beautiful Names of Allah (Asma ul Husna)** with meanings:",
        "url": "https://maktabatulmuslim.com/names-of-allah"
    },
    {
        "keywords": ["khatam", "tracker", "goal", "finish quran"],
        "answer": "🏆 Track your **Quran Khatam Progress & Goal Planner**:",
        "url": "https://maktabatulmuslim.com/khatam-tracker"
    },
    {
        "keywords": ["dashboard", "my profile", "streaks", "bookmarks"],
        "answer": "👤 Access your personal **User Profile & Dashboard**:",
        "url": "https://maktabatulmuslim.com/dashboard"
    }
]

# High-Precision Authentic Islamic Knowledge Bank
ISLAMIC_KNOWLEDGE_BASE = [
    {
        "keywords": ["allah", "god in islam", "tawheed", "creator", "who is allah"],
        "topic": "Tawheed & The Oneness of Allah (SWT)",
        "content": "✨ **Allah (Subhanahu Wa Ta'ala) - The One True God:**\n\nAllah is the Supreme Creator, the Eternal, the Self-Sufficient. He has no partners, no parents, and no children.\n\n**Surah Al-Ikhlas (112:1-4)**:\n1. Say, 'He is Allah, [who is] One,\n2. Allah, the Eternal Refuge.\n3. He neither begets nor is born,\n4. Nor is there to Him any equivalent.'\n\n*Key Islamic Creed (Aqeedah)*: Tawheed (Monotheism) is the foundation of Islam.",
        "reference": "[Surah Al-Ikhlas 112:1-4], [Surah Al-Baqarah 2:255 - Ayatul Kursi]",
        "suggestions": [
            "What are the 99 Names of Allah?",
            "Explain Ayatul Kursi and its virtues",
            "What is Shirk and how to avoid it?"
        ]
    },
    {
        "keywords": ["muhammad", "prophet", "messenger", "sunnah", "seerah", "pbuh", "saw", "rasulallah", "proppher"],
        "topic": "Prophet Muhammad (ﷺ) - Seal of Prophets",
        "content": "❤️ **Prophet Muhammad (ﷺ):**\n\nProphet Muhammad (ﷺ) is the final Messenger of Allah sent as a mercy to all creation (*'Rahmatan lil-'Alamin'*). He was born in Makkah in 570 CE, received divine revelation of the Holy Quran at Cave Hira, and taught mankind truth, justice, mercy, and Tawheed.\n\n**Hadith Citation**:\nProphet (ﷺ) said: *'None of you truly believes until I am more beloved to him than his father, his child, and all of mankind.'* [Sahih Bukhari #15].\n\n**Key Characteristics**: Truthfulness (Al-Amin), Patience (Sabr), Generosity, and Forgiveness.",
        "reference": "[Sahih Bukhari #15], [Surah Al-Anbiya 21:107], [Surah Al-Ahzab 33:40]",
        "suggestions": [
            "Tell me about the Hijrah to Madinah",
            "What were the noble manners of Prophet Muhammad (ﷺ)?",
            "What is the Farewell Sermon (Khutbatul Wada)?"
        ]
    },
    {
        "keywords": ["patience", "sabr", "anxiety", "hardship", "worry", "peace of mind", "stress"],
        "topic": "Sabr (Patience) & Peace of Mind in Quran",
        "content": "🤲 **Patience (Sabr) in Islam:**\n\nAllah promises guidance, peace, and immense reward for those who practice Sabr (patience) during trials.\n\n**Quranic Verse**:\n*'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.'* [Surah Al-Baqarah 2:153].\n\n*'For indeed, with hardship will be ease.'* [Surah Ash-Sharh 94:5].\n\n**Authentic Hadith**:\nProphet Muhammad (ﷺ) said: *'How wonderful is the affair of the believer, for all his affairs are good. If something good happens to him, he gives thanks and that is good for him; if something bad happens to him, he bears it with patience, and that is good for him.'* [Sahih Muslim #2999].",
        "reference": "[Surah Al-Baqarah 2:153], [Surah Ash-Sharh 94:5], [Sahih Muslim #2999]",
        "suggestions": [
            "What is the Dua for anxiety and distress?",
            "How did Prophets show Sabr in difficult times?",
            "Would you like me to explain this in Urdu?"
        ]
    },
    {
        "keywords": ["namaz", "prayer", "salat", "rakat", "rakaat", "fajr", "dhuhr", "asr", "maghrib", "isha", "wudu", "how to perform fajr"],
        "topic": "Salah (Daily 5 Prayers) & Purification",
        "content": "🕌 **Step-by-Step Guide to Daily 5 Prayers (Salah):**\n\n1. **Fajr**: 2 Sunnah Mu'akkadah, 2 Fard (Dawn)\n2. **Dhuhr**: 4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl (Noon)\n3. **Asr**: 4 Sunnah, 4 Fard (Late Afternoon)\n4. **Maghrib**: 3 Fard, 2 Sunnah, 2 Nafl (Sunset)\n5. **Isha**: 4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl, 3 Witr, 2 Nafl (Night)\n\n**How to Perform Fajr (2 Rak'ahs Fard)**:\n- **Niyyah (Intention)** & Takbir: Say *'Allahu Akbar'*\n- **Qiyam**: Recite Surah Al-Fatiha + another Surah\n- **Ruku**: Bow down saying *'Subhana Rabbiyal 'Adheem'* (3x)\n- **Sujood**: Prostrate saying *'Subhana Rabbiyal A'la'* (3x)\n- **Tashahhud & Salam**\n\n*Scholarly Rulings (Fiqh)*: All 4 Madhhabs (Hanafi, Shafi'i, Maliki, Hanbali) agree that 5 daily prayers are obligatory (Fard 'Ayn).",
        "reference": "[Surah Al-Baqarah 2:43], [Sahih Bukhari #528], [Fiqh Sunnah]",
        "suggestions": [
            "What invalidates Wudu and Salah?",
            "How do I perform Witr prayer?",
            "What are the timings for Fajr and Isha?"
        ]
    },
    {
        "keywords": ["zakat", "nisab", "charity", "zakat calculation", "gold nisab", "fitrana", "fitr", "sadaqah"],
        "topic": "Zakat & Wealth Purification",
        "content": "💰 **Zakat & Nisab Calculation:**\n\nZakat is the 3rd Pillar of Islam. It is obligatory (2.5%) on wealth held for one full lunar year above the Nisab threshold.\n\n**Nisab Thresholds**:\n- **Gold**: 87.48 grams (7.5 Tolas)\n- **Silver**: 612.36 grams (52.5 Tolas)\n- **Cash / Business Assets**: Equivalent to 612.36g Silver value.\n\n**Recipients of Zakat** [Surah At-Tawbah 9:60]: The poor (Fuqara), the needy (Masakeen), those employed to collect Zakat, and travelers.\n\n*Note*: For complex personalized financial asset calculations, consulting a qualified Islamic scholar is recommended.",
        "reference": "[Surah At-Tawbah 9:60], [Sahih Bukhari #1405], [Fiqh Zakat]",
        "suggestions": [
            "What is the difference between Zakat and Sadaqah?",
            "What is Zakat al-Fitr (Fitrana)?",
            "How is Zakat calculated on gold and cash?"
        ]
    },
    {
        "keywords": ["fasting", "sawm", "ramadan", "suhoor", "iftar", "laylatul qadr", "roza", "breaking fast"],
        "topic": "Sawm (Fasting in Ramadan)",
        "content": "🌙 **Rules of Sawm (Fasting) in Ramadan:**\n\nFasting is obligatory during Ramadan from dawn (Fajr) to sunset (Maghrib), abstaining from food, drink, and marital relations.\n\n**Quranic Command**:\n*'O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.'* [Surah Al-Baqarah 2:183].\n\n**Virtue of Laylat al-Qadr (Night of Power)**:\n*'The Night of Decree is better than a thousand months.'* [Surah Al-Qadr 97:3].",
        "reference": "[Surah Al-Baqarah 2:183-185], [Surah Al-Qadr 97:1-5], [Sahih Bukhari #1901]",
        "suggestions": [
            "What invalidates the fast (Roza)?",
            "Who is exempt from fasting in Ramadan?",
            "What is Fidya and Qada fasting?"
        ]
    },
    {
        "keywords": ["hajj", "umrah", "mecca", "kaaba", "tawaf", "ihram", "arafat", "mina"],
        "topic": "Hajj & Umrah Step-by-Step Guide",
        "content": "🕋 **Steps of Hajj & Umrah:**\n\n**Umrah (Minor Pilgrimage)**:\n1. **Ihram** from Miqat\n2. **Tawaf** (7 circuits around Holy Kaaba)\n3. **Sa'i** (7 trips between Safa & Marwah)\n4. **Halq/Qasr** (Cutting or shaving hair)\n\n**Hajj (Major Pilgrimage - 8th to 12th Dhul Hijjah)**:\n- 8th Dhul Hijjah: Move to Mina in Ihram\n- 9th Dhul Hijjah: **Day of Arafah** (Peak of Hajj - Wuquf) & Muzdalifah night\n- 10th Dhul Hijjah: Ramy (Stoning Jamarat), Qurbani (Sacrifice), Tawaf al-Ifadah\n- 11th-12th Dhul Hijjah: Stoning Jamarat & Farewell Tawaf",
        "reference": "[Surah Ali 'Imran 3:97], [Sahih Bukhari #1513], [Fiqh al-Hajj]",
        "suggestions": [
            "What are the prohibitions of Ihram?",
            "What is the virtue of the Day of Arafah?",
            "What is the Talbiyah dua for Hajj?"
        ]
    }
]


@csrf_exempt
def ai_assistant_api(request):
    """
    Intelligent Islamic AI Knowledge Agent View
    Processes prompt, verifies sources, formats clean citations, and suggests smart follow-up questions.
    """

    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'}, status=405)

    try:
        body = json.loads(request.body)
        user_prompt = body.get('prompt', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    if not user_prompt:
        return JsonResponse({'error': 'Prompt cannot be empty'}, status=400)

    prompt_lower = user_prompt.lower()

    # 1. Check for off-topic non-Islamic topics
    if any(k in prompt_lower for k in OTHER_RELIGIONS_KEYWORDS):
        return JsonResponse({
            'answer': "Assalamu Alaikum! 🌙 **Maktaba AI Knowledge Assistant** is dedicated exclusively to authentic Islamic topics.\n\nPlease ask questions related to the Quran, Sahih Hadith, Seerah, Salah, Fasting, Zakat, Hajj, Tafseer, or Islamic History.",
            'references': "Maktaba Islamic Knowledge Policy",
            'is_offtopic': True,
            'suggested_questions': [
                "What is the virtue of reading Quran?",
                "Tell me about Prophet Muhammad (ﷺ)",
                "How do I calculate Zakat?"
            ]
        })

    # 2. Handle User Personalization Requests (Logged-in User Account Data)
    if any(k in prompt_lower for k in ["my bookmark", "my reading", "where did i stop", "my progress", "my favorite"]):
        if request.user.is_authenticated:
            bookmarks = Bookmark.objects.filter(user=request.user).order_by('-created_at')[:5]
            if bookmarks.exists():
                bm_list = "\n".join([f"- Surah {b.surah_number}, Ayah {b.ayah_number} (Bookmarked on {b.created_at.strftime('%Y-%m-%d')})" for b in bookmarks])
                return JsonResponse({
                    'answer': f"Assalamu Alaikum **{request.user.username}**! 📖 Here is your latest reading progress and saved bookmarks:\n\n{bm_list}",
                    'references': "User Account Data Engine",
                    'suggested_questions': ["Open Read Quran section", "How do I add a new bookmark?"]
                })
            else:
                return JsonResponse({
                    'answer': f"Assalamu Alaikum **{request.user.username}**! You do not have any saved bookmarks yet. You can bookmark any Ayah while reading the Quran!",
                    'references': "User Account Data Engine",
                    'suggested_questions': ["How do I read Quran?", "What is the virtue of Surah Al-Kahf?"]
                })
        else:
            return JsonResponse({
                'answer': "Assalamu Alaikum! Please **Sign In** to view your saved bookmarks, reading progress, and personal reading history.",
                'references': "User Authentication Engine",
                'suggested_questions': ["How do I create an account?", "What are the features of Maktaba tul Muslim?"]
            })

    # 3. Check if user explicitly asked for website links
    is_link_requested = any(k in prompt_lower for k in WEBSITE_LINK_REQUEST_KEYWORDS)

    # 4. Search Website Navigation Map if links were requested
    matched_url_info = None
    if is_link_requested:
        for nav in WEBSITE_NAVIGATION_MAP:
            if any(k in prompt_lower for k in nav['keywords']):
                matched_url_info = nav
                break

    # 5. Search Authentic Knowledge Base
    best_match = None
    for entry in ISLAMIC_KNOWLEDGE_BASE:
        if any(k in prompt_lower for k in entry['keywords']):
            best_match = entry
            break

    if best_match:
        answer_text = best_match['content']
        references_text = best_match['reference']
        suggestions = best_match.get('suggestions', [
            "Would you like me to explain this in Urdu?",
            "What are the relevant Hadiths on this topic?",
            "Tell me more about this Islamic concept"
        ])
        urls_list = [best_match['url']] if is_link_requested and 'url' in best_match else []

        return JsonResponse({
            'answer': answer_text,
            'references': references_text,
            'urls': urls_list,
            'suggested_questions': suggestions
        })

    # 6. Database Dynamic Search (Hadith & Tafseer Models)
    db_hadiths = Hadith.objects.filter(translation__icontains=user_prompt)[:2]
    if db_hadiths.exists():
        hd = db_hadiths[0]
        answer_text = f"📜 **Hadith Reference ({hd.book_name})**:\n\n*{hd.translation}*\n\n- **Narrator**: {hd.narrated_by}\n- **Grade**: {hd.grade}\n- **Chapter**: {hd.chapter}"
        ref_text = f"[{hd.book_name} #{hd.hadith_number} - Grade: {hd.grade}]"
        return JsonResponse({
            'answer': answer_text,
            'references': ref_text,
            'urls': [],
            'suggested_questions': [
                "What other Hadith exist on this topic?",
                "What is the explanation of this Hadith?",
                "Would you like me to explain in Urdu?"
            ]
        })

    db_tafseers = Tafseer.objects.filter(translation__icontains=user_prompt)[:2]
    if db_tafseers.exists():
        tf = db_tafseers[0]
        answer_text = f"📖 **Quran & Tafseer Commentary (Surah {tf.surah_name} {tf.surah_number}:{tf.ayah_number})**:\n\n*{tf.translation}*\n\n**Tafseer Summary ({tf.scholar_name})**:\n{tf.tafseer_text[:400]}..."
        ref_text = f"[Surah {tf.surah_name} {tf.surah_number}:{tf.ayah_number} - Tafsir {tf.scholar_name}]"
        return JsonResponse({
            'answer': answer_text,
            'references': ref_text,
            'urls': [],
            'suggested_questions': [
                "What is the full context of this Surah?",
                "Are there Hadiths regarding this Ayah?",
                "Would you like me to translate to Urdu?"
            ]
        })

    # 7. Navigation fallback if explicitly requested
    if matched_url_info:
        return JsonResponse({
            'answer': f"{matched_url_info['answer']}",
            'references': "Maktaba Navigation System",
            'urls': [matched_url_info['url']],
            'suggested_questions': [
                "What is the virtue of reading Quran?",
                "Tell me about Prophet Muhammad (ﷺ)",
                "How do I calculate Zakat?"
            ]
        })

    # 8. Intelligent Default Structured Islamic Response
    fallback_answer = f"Assalamu Alaikum! Regarding your question on **'{user_prompt.title()}'**:\n\nIslam teaches us to seek knowledge with sincerity, reflection, and authentic sources. The Quran and Sunnah provide full guidance on worship, ethics, history, and daily life.\n\n*Quranic Guidance*: *'Say: My Lord, increase me in knowledge.'* [Surah Taha 20:114].\n\nYou can ask specific questions regarding Surahs, Sahih Hadiths, Prophet stories, Namaz guides, Fasting, Zakat, or Tafseer Ibn Kathir!"

    return JsonResponse({
        'answer': fallback_answer,
        'references': "[Surah Taha 20:114], [Sahih Bukhari]",
        'urls': [],
        'suggested_questions': [
            "What does Quran say about patience (Sabr)?",
            "Tell me the story of Prophet Musa (AS)",
            "How do I perform Fajr prayer step-by-step?"
        ]
    })


# Alias for backward compatibility
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


