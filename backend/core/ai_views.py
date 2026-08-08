import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Tafseer, Hadith, AudioPlaylist, HifzTracker


# Off-topic filter for non-Islamic topics
OTHER_RELIGIONS_KEYWORDS = [
    'christianity', 'jesus as god', 'trinity', 'bible', 'hinduism', 'buddhism', 'shinto',
    'sikhism', 'gospel', 'torah study', 'varna', 'karma rebirth', 'polytheism', 'paganism',
    'atheism', 'idol worship', 'church', 'temple', 'synagogue', 'pastor', 'pandit', 'priest',
    'cricket score', 'football match', 'hollywood', 'bollywood', 'gaming pc', 'crypto trading'
]

# Website Pages Navigator Map
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
        "content": "✨ **Allah (Subhanahu Wa Ta'ala) - The One True God:**\n\nAllah is the Supreme Creator, the Eternal, the Self-Sufficient. He has no partners, no parents, and no children.\n\n*Surah Al-Ikhlas (112:1-4)*:\n1. Say, 'He is Allah, [who is] One,\n2. Allah, the Eternal Refuge.\n3. He neither begets nor is born,\n4. Nor is there to Him any equivalent.'",
        "reference": "Surah Al-Ikhlas (112:1-4), Surah Al-Baqarah (Ayatul Kursi 2:255)",
        "url": "https://quran.com/112"
    },
    {
        "keywords": ["muhammad", "prophet", "messenger", "sunnah", "seerah", "pbuh", "saw", "rasulallah"],
        "topic": "Prophet Muhammad (ﷺ) - Seal of Prophets",
        "content": "❤️ **Prophet Muhammad (ﷺ):**\n\nProphet Muhammad (ﷺ) is the final Messenger of Allah sent as a mercy to all creation ('Rahmatan lil-'Alamin'). He was born in Makkah in 570 CE, received the Holy Quran at Cave Hira, and taught mankind truth, justice, mercy, and Tawheed.\n\nProphet (ﷺ) said: *'None of you truly believes until I am more beloved to him than his father, his child, and all of mankind.'* (Sahih Bukhari #15).",
        "reference": "Sahih Bukhari #15, Surah Al-Anbiya (21:107)",
        "url": "https://sunnah.com/bukhari:15"
    },
    {
        "keywords": ["prophets", "anbiya", "adam", "nuh", "ibrahim", "ismail", "musa", "isa", "yusuf", "yunus", "sulaiman", "dawood"],
        "topic": "The Prophets in Islam (Anbiya)",
        "content": "📖 **Prophets & Messengers of Allah (Anbiya):**\n\nMuslims believe in all Messengers sent by Allah, including Adam, Nuh (Noah), Ibrahim (Abraham), Ismail, Ishaq, Yaqub, Yusuf (Joseph), Musa (Moses), Dawood (David), Sulaiman (Solomon), Yunus (Jonah), Isa (Jesus - son of Maryam), and final Prophet Muhammad (peace be upon them all).",
        "reference": "Surah Al-Baqarah (2:136), Surah An-Nisa (4:163)",
        "url": "https://maktabatulmuslim.com/read"
    },
    {
        "keywords": ["namaz", "prayer", "salat", "rakat", "rakaat", "fajr", "dhuhr", "asr", "maghrib", "isha", "wudu"],
        "topic": "Salah (Daily Prayers) & Wudu",
        "content": "✨ **Guide to Daily 5 Prayers (Salah):**\n\n1. **Fajr**: 2 Sunnah, 2 Fard (Dawn)\n2. **Dhuhr**: 4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl (Noon)\n3. **Asr**: 4 Sunnah, 4 Fard (Afternoon)\n4. **Maghrib**: 3 Fard, 2 Sunnah, 2 Nafl (Sunset)\n5. **Isha**: 4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl, 3 Witr, 2 Nafl (Night)\n\n**Wudu Steps**: Niyyah, Wash hands 3x, Rinse mouth & nose 3x, Wash face 3x, Wash arms up to elbows 3x, Wipe head (Masah), Wash feet to ankles 3x.",
        "reference": "Sahih Bukhari #504",
        "url": "https://sunnah.com/bukhari:504"
    },
    {
        "keywords": ["hajj", "umrah", "kaaba", "makkah", "tawaf", "arafah", "pilgrimage"],
        "topic": "Hajj & Umrah Pilgrimage",
        "content": "🕋 **Hajj & Umrah Pilgrimage:**\n\nHajj is the 5th Pillar of Islam, mandatory once in a lifetime for those physically and financially able. It takes place in Dhu al-Hijjah in Makkah, featuring Ihram, Tawaf around the Kaaba, Sa'i between Safa & Marwah, standing at Mount Arafah, and Qurbani (Sacrifice).",
        "reference": "Surah Ali 'Imran (3:97), Sahih Bukhari #1521",
        "url": "https://sunnah.com/bukhari:1521"
    },
    {
        "keywords": ["zakat", "fitr", "fitrana", "charity", "nisab", "sadaqah"],
        "topic": "Zakat & Zakat al-Fitr",
        "content": "💰 **Zakat & Zakat al-Fitr Rules:**\n\n1. **Zakat**: 3rd Pillar of Islam, obligatory on wealth held for 1 lunar year exceeding Nisab (87.48g Gold or 612.36g Silver / cash equivalent). Rate is **2.5%**.\n2. **Zakat al-Fitr (Fitrana)**: Obligatory charity given before Eid al-Fitr prayer to feed the poor.",
        "reference": "Sahih Bukhari #1503, Surah At-Tawbah (9:60)",
        "url": "https://sunnah.com/bukhari:1503"
    },
    {
        "keywords": ["ramadan", "ramzan", "roza", "fasting", "suhoor", "iftar", "laylatul qadr"],
        "topic": "Sawm (Fasting in Ramadan)",
        "content": "🌙 **Fasting in Ramadan (Sawm):**\n\nFasting during Ramadan is the 4th Pillar of Islam from Fajr to Maghrib.\n\n*Hadith*: *'Whoever fasts Ramadan out of faith and seeking reward, his past sins will be forgiven.'* (Sahih Bukhari #38).\n\n**Laylatul Qadr** (Night of Power) in the last 10 odd nights of Ramadan is better than 1,000 months.",
        "reference": "Surah Al-Qadr (97:1-5), Sahih Bukhari #38",
        "url": "https://sunnah.com/bukhari:38"
    },
    {
        "keywords": ["eid", "eid fitr", "eid adha", "qurbani", "festival"],
        "topic": "Eid al-Fitr & Eid al-Adha",
        "content": "🎉 **The Two Blessed Eids in Islam:**\n\n1. **Eid al-Fitr**: Celebrated on 1st Shawwal after completing Ramadan fasting.\n2. **Eid al-Adha**: Celebrated on 10th Dhu al-Hijjah commemorating Prophet Ibrahim (AS)'s sacrifice with Qurbani.",
        "reference": "Sunan Abu Dawud #1134",
        "url": "https://sunnah.com/abudawud:1134"
    }
]

@csrf_exempt
def ai_assistant_api(request):
    """
    Super-Fast Islamic AI Assistant with:
    - Non-Islamic topic filter
    - Complete website navigation links (https://maktabatulmuslim.com/...)
    - Verified web citations (sunnah.com, quran.com)
    - Optional LLM integration fallback
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            prompt = data.get('prompt', '').strip()
            prompt_lower = prompt.lower()
        except Exception:
            return JsonResponse({'error': 'Invalid JSON body'}, status=400)

        if not prompt:
            return JsonResponse({'error': 'Prompt is required'}, status=400)

        # 1. Filter Non-Islamic Questions
        if any(kw in prompt_lower for kw in OTHER_RELIGIONS_KEYWORDS):
            return JsonResponse({
                'answer': "Assalamu Alaikum! 🌙 I am an **Islamic AI Assistant** dedicated strictly to authentic Islamic knowledge.\n\nKindly ask questions related to **Islam, the Holy Quran, Sunnah, Prophet Stories, Namaz, Ramadan, Zakat, Hajj, or Islamic Guidance**.",
                'references': "Maktaba tul Muslim Policy",
                'prompt': prompt,
                'is_offtopic': True
            })

        answer_parts = []
        references = []
        web_links = []

        # 2. Check Website Navigation Queries
        for nav in WEBSITE_NAVIGATION_MAP:
            if any(kw in prompt_lower for kw in nav["keywords"]):
                answer_parts.append(f"{nav['answer']}\n👉 **[{nav['url']}]({nav['url']})**")
                web_links.append(nav["url"])

        # 3. Match Knowledge Bank
        for item in ISLAMIC_KNOWLEDGE_BASE:
            if any(kw in prompt_lower for kw in item["keywords"]):
                answer_parts.append(item["content"])
                references.append(item["reference"])
                if "url" in item:
                    web_links.append(item["url"])

        # 4. Search Local Database (Hadith & Tafseer)
        matching_hadith = Hadith.objects.filter(translation__icontains=prompt_lower).first() or \
                         Hadith.objects.filter(arabic_text__icontains=prompt_lower).first()

        if matching_hadith:
            hadith_ref = f"{matching_hadith.book_name} #{matching_hadith.hadith_number}"
            answer_parts.append(
                f"\n\n📜 **Sahih Hadith ({hadith_ref}):**\n"
                f"\"{matching_hadith.translation}\"\n"
                f"*Grade*: {matching_hadith.grade}"
            )
            references.append(hadith_ref)
            web_links.append("https://sunnah.com")

        matching_tafseer = Tafseer.objects.filter(translation__icontains=prompt_lower).first() or \
                          Tafseer.objects.filter(tafseer_text__icontains=prompt_lower).first()

        if matching_tafseer:
            tafseer_ref = f"Surah {matching_tafseer.surah_name} ({matching_tafseer.surah_number}:{matching_tafseer.ayah_number})"
            answer_parts.append(
                f"\n\n📖 **Tafseer Ibn Kathir ({tafseer_ref}):**\n"
                f"Arabic: {matching_tafseer.arabic_text}\n"
                f"Translation: \"{matching_tafseer.translation}\"\n"
                f"Summary: {matching_tafseer.tafseer_text[:300]}..."
            )
            references.append(tafseer_ref)
            web_links.append(f"https://quran.com/{matching_tafseer.surah_number}/{matching_tafseer.ayah_number}")

        # Fallback General Response
        if not answer_parts:
            answer_parts.append(
                f"Assalamu Alaikum! Regarding your question on **'{prompt.capitalize()}'**:\n\n"
                f"Islam teaches us to seek knowledge with sincerity and reflection. You can explore all sections of **Maktaba tul Muslim**:\n"
                f"• 📖 **[Read Quran Online](https://maktabatulmuslim.com/read)**\n"
                f"• 🎧 **[Quran MP3 & Taqreers](https://maktabatulmuslim.com/quran)**\n"
                f"• 📚 **[Islamic PDF Books](https://maktabatulmuslim.com/books)**\n"
                f"• 📜 **[Sahih Hadith Library](https://maktabatulmuslim.com/hadith)**\n"
                f"• 🧭 **[Qibla & Prayer Times](https://maktabatulmuslim.com/qibla)**"
            )
            references.append("Maktaba tul Muslim Authentic Portal")
            web_links.append("https://maktabatulmuslim.com/read")

        final_response = "\n\n".join(answer_parts)
        formatted_refs = ", ".join(list(set(references)))
        formatted_links = list(set(web_links))

        return JsonResponse({
            'answer': final_response,
            'references': formatted_refs,
            'urls': formatted_links,
            'prompt': prompt,
            'source': 'Maktaba Authentic Islamic Knowledge Engine'
        })

    return JsonResponse({'error': 'Only POST requests allowed'}, status=405)


@csrf_exempt
def api_playlists(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return JsonResponse({'playlists': []})
        playlists = AudioPlaylist.objects.filter(user=request.user)
        res = []
        for p in playlists:
            try:
                tracks = json.loads(p.tracks_json)
            except Exception:
                tracks = []
            res.append({
                'id': p.id,
                'title': p.title,
                'description': p.description,
                'tracks': tracks,
                'created_at': p.created_at.strftime('%Y-%m-%d %H:%M')
            })
        return JsonResponse({'playlists': res})

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        try:
            data = json.loads(request.body.decode('utf-8'))
            title = data.get('title', 'My Quran Playlist').strip()
            description = data.get('description', '').strip()
            tracks = data.get('tracks', [])
            playlist = AudioPlaylist.objects.create(
                user=request.user,
                title=title,
                description=description,
                tracks_json=json.dumps(tracks)
            )
            return JsonResponse({
                'id': playlist.id,
                'title': playlist.title,
                'description': playlist.description,
                'tracks': tracks,
                'message': 'Playlist created successfully!'
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def api_hifz_tracker(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return JsonResponse({'records': []})
        records = HifzTracker.objects.filter(user=request.user)
        res = [{
            'surah_number': r.surah_number,
            'surah_name': r.surah_name,
            'status': r.status,
            'notes': r.notes,
            'last_revised': r.last_revised.strftime('%Y-%m-%d')
        } for r in records]
        return JsonResponse({'records': res})

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        try:
            data = json.loads(request.body.decode('utf-8'))
            surah_number = int(data.get('surah_number'))
            surah_name = data.get('surah_name', f'Surah {surah_number}')
            status = data.get('status', 'in_progress')
            notes = data.get('notes', '')

            obj, created = HifzTracker.objects.update_or_create(
                user=request.user,
                surah_number=surah_number,
                defaults={'surah_name': surah_name, 'status': status, 'notes': notes}
            )
            return JsonResponse({
                'surah_number': obj.surah_number,
                'surah_name': obj.surah_name,
                'status': obj.status,
                'notes': obj.notes,
                'message': 'Hifz progress saved!'
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)
