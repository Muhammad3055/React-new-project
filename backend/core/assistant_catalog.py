"""Live, public website context and links for the conversational assistant."""
import json
import re
from urllib.parse import urlencode

from django.db.models import Case, IntegerField, Q, Value, When

from .models import BookMedia, Hadith, ImageMedia, QuranAudio, Tafseer, TaqreerAudio, Topic, VideoMedia

# Only real public routes. Never let a model invent a website destination.
PAGES = [
    ('Books & Documents', '/books', 'books book documents pdf kitab kitaben کتاب کتابیں کتب كتب مكتبة'),
    ('Quran Audio & Lectures', '/quran', 'audio recitation lectures lecture bayan taqreer mp3 تلاوت بیان تقریر'),
    ('Read the Quran', '/read', 'read quran reading قرآن پڑھ'),
    ('Explore Topics', '/topics', 'topic topics subjects موضوع موضوعات'),
    ('Videos', '/videos', 'video videos watch ویڈیو فيديو'),
    ('Images', '/images', 'image images pictures تصاویر صور'),
    ('Tafseer', '/tafseer', 'tafseer tafsir commentary تفسیر تفسير'),
    ('Hadith', '/hadith', 'hadith hadees sunnah حدیث حديث'),
    ('Qaris & Reciters', '/qaris', 'qaris qari reciter reciters قاری'),
    ('Prayer Times', '/prayers', 'prayer times timing اوقات نماز'),
    ('Asan Nimaz', '/asan-nimaz', 'namaz salah prayer guide نماز صلاة'),
    ('Qibla Direction', '/qibla', 'qibla direction قبلہ قبلة'),
    ('Duas', '/duas', 'dua duas supplication دعا دعائیں دعاء'),
    ('Daily Adhkar', '/azkar', 'azkar adhkar dhikr remembrance اذکار'),
    ('Names of Allah', '/names-of-allah', 'allah names اسماء الحسنى'),
    ('Tasbeeh Counter', '/tasbeeh', 'tasbeeh counter تسبیح'),
    ('Khatam Tracker', '/khatam-tracker', 'khatam tracker ختم'),
    ('Zakat Calculator', '/zakat', 'zakat calculator زکوۃ زکات زكاة'),
    ('Hajj & Umrah', '/hajj-umrah', 'hajj umrah pilgrimage حج عمرہ'),
    ('Tajweed', '/tajweed', 'tajweed pronunciation تجوید تجويد'),
    ('Islamic Names', '/names', 'baby names name بچوں نام'),
    ('Inheritance Calculator', '/inheritance', 'inheritance wasiyyah will وراثت وصیت'),
    ('Qada Tracker', '/qada', 'qada missed قضا'),
    ('Ramadan', '/ramadan', 'ramadan ramazan fasting رمضان روزہ'),
    ('Islamic Cards', '/card-creator', 'card cards creator کارڈ'),
    ('Live Streams', '/live', 'live stream streaming براہ راست'),
    ('Brahui Heritage', '/brahui', 'brahui heritage براہوئی'),
    ('Quran Words', '/words', 'vocabulary words الفاظ'),
    ('World Clock', '/world-clock', 'clock timezone time world وقت'),
    ('Islamic Quiz', '/quiz', 'quiz questions کوئز'),
    ('Seerah', '/seerah', 'seerah seerat prophet biography سیرت'),
    ('Daily Reflection', '/muhasaba', 'muhasaba reflection محاسبہ'),
    ('Quranic Maps', '/maps', 'maps map places نقشہ'),
    ('Fazail', '/fazail', 'fazail virtues فضائل'),
    ('Dream Interpretation', '/dream', 'dream dreams خواب'),
    ('Contact Us', '/contact', 'contact support رابطہ'),
    ('About Maktaba tul Muslim', '/about', 'about website site maktaba maktab library portal'),
]
STOP = set('islam islamic اسلامی اسلام ones version versions a an the i me my we you your our is are be do does can could would should will want need please tell give show find where which what how some any all of for in on at to and or with about this that these those type types website site available have has here there also more instead only just thanks now page pages link links book books document documents pdf video videos image images picture pictures lecture lectures audio audios topic topics read reading watch listen looking recommend suggest download english urdu arabic brahui en ur ar br roman kitab kitaben ki ka ke ko mein mujhe dikhao kahan hain hai par aur یہ وہ میں کی کے کا کو مجھے ہیں ہے کتاب کتابیں کتب کہاں دکھائیں اردو عربی براہوئی انگریزی كتب كتاب أين في من عن على هل'.split())
SYNONYMS = [
    ('salah', 'salat', 'namaz', 'prayer', 'نماز', 'الصلاة', 'صلاة'),
    ('tafsir', 'tafseer', 'تفسیر', 'تفسير'),
    ('hadith', 'hadees', 'حدیث', 'حديث'),
    ('quran', 'قرآن', 'القرآن'),
    ('seerah', 'seerat', 'سیرت'),
    ('ramadan', 'ramazan', 'fasting', 'رمضان', 'روزہ'),
    ('zakat', 'charity', 'زکوۃ', 'زكاة', 'صدقہ'),
    ('dua', 'duas', 'supplication', 'دعا', 'دعاء'),
    ('hajj', 'pilgrimage', 'حج'),
    ('umrah', 'عمرہ', 'عمرة'),
]


def tokens(query):
    return list(dict.fromkeys(re.findall(r'[^\W_]+', query.lower())))[:40]


def search_words(query):
    words = [word for word in tokens(query) if word not in STOP and len(word) > 1][:12]
    expanded = list(words)
    for group in SYNONYMS:
        if any(word in words for word in group):
            expanded.extend(group)
    return list(dict.fromkeys(expanded))


def metadata_matches(query, fields):
    condition = Q()
    for word in search_words(query):
        for field in fields:
            condition |= Q(**{f'{field}__icontains': word})
    return condition


def clean_history(value):
    if not isinstance(value, list):
        return []
    result = []
    for entry in value[-10:]:
        if isinstance(entry, dict) and entry.get('role') in ('user', 'assistant') and isinstance(entry.get('content'), str):
            result.append({'role': entry['role'], 'content': entry['content'][:3000]})
    return result


def contextual_query(query, history):
    # Follow-ups such as "in Urdu?" retain the preceding subject. New subjects do not.
    if len(tokens(query)) <= 9 and (not search_words(query) or re.search(r'\b(it|them|those|these|same|that|more|also|instead|ones)\b|ان کی|اسی|مزید', query.lower())):
        context = []
        for entry in reversed(history):
            if entry['role'] == 'user':
                context.append(entry['content'][:500])
                if search_words(entry['content']) or set(tokens(entry['content'])) & {'books','lectures','videos','topics','کتابیں'} or len(context) == 3:
                    break
        if context:
            return ' '.join([*reversed(context), query])

    return query


def requested_language(query):
    # Last explicit language wins when a user changes their filter in a follow-up.
    aliases = {'english':'en', 'urdu':'ur', 'arabic':'ar', 'brahui':'br', 'اردو':'ur', 'عربی':'ar', 'براہوئی':'br', 'انگریزی':'en'}
    found = [aliases[word] for word in tokens(query) if word in aliases]
    return found[-1] if found else ''


def website_question(query):
    text = query.lower()
    if re.search(r'\b(website|site|library|catalog|page|links?|books?|documents?|videos?|lectures?|topics?|audio|images?|kitab|kitaben)\b|کتاب|کتب|صفح|ویب|كتب|موقع|فيديو', text):
        return True
    navigation = re.search(r'\b(find|show|open|browse|where|link)\b|کہاں|دکھا|أين', text)
    feature = re.search(r'\b(qibla|calculator|tracker|quiz|tasbeeh|contact|tajweed|maps|qaris)\b|قبلہ|تسبیح|رابطہ', text)
    return bool(navigation and feature)


def get_catalog(query):
    words = set(tokens(query))
    language = requested_language(query)
    book_request = bool(words & set(PAGES[0][2].split()))
    lecture_request = bool(words & {'lecture','lectures','bayan','taqreer','بیان','تقریر'})
    video_request = bool(words & {'video','videos','ویڈیو','فيديو'})
    image_request = bool(words & {'image','images','pictures','تصاویر','صور'})
    narrowed = book_request or lecture_request or video_request or image_request
    pages = []
    for label, url, keywords in PAGES:
        score = len(words & set(keywords.split()))
        if score:
            pages.append({'label':label, 'url':url, 'score':score})
    pages.sort(key=lambda page: -page['score'])
    if book_request:
        pages.sort(key=lambda page: page['url'] != '/books')
    language_params = {'language': language} if language else {}
    for page in pages:
        if page['url'] == '/books' and language:
            page['url'] += '?' + urlencode(language_params)
    resources = []
    kinds = [
        (BookMedia, 'books', '/books', ['title','author','description','category__name'], book_request),
        (TaqreerAudio, 'lectures', '/quran', ['title','arabic_title','speaker','description','category__name'], lecture_request),
        (VideoMedia, 'videos', '/videos', ['title','speaker','description','category__name'], video_request),
        (ImageMedia, 'images', '/images', ['title','description','category__name'], image_request),
        (QuranAudio, 'quran', '/quran', ['surah_name_english','surah_name_arabic','reciter'], False),
    ]
    for model, kind, path, fields, explicit in kinds:
        if narrowed and not explicit:
            continue
        condition = metadata_matches(query, fields)
        if not condition and not explicit:
            continue
        queryset = model.objects.all()
        if kind == 'quran':
            queryset = queryset.exclude(destination_folder__startswith='taqreer_')
        if language and kind in ('books','lectures','quran'):
            code = language if kind == 'books' else {'en':'english','ur':'urdu','ar':'arabic','br':'brahui'}[language]
            queryset = queryset.filter(language=code)
        if condition:
            queryset = queryset.filter(condition)
            rank = Value(0, output_field=IntegerField())
            for word in search_words(query):
                rank += Case(When(**{f'{fields[0]}__icontains':word}, then=Value(3)), default=Value(0), output_field=IntegerField())
            queryset = queryset.annotate(search_rank=rank).order_by('-search_rank','pk')
        for item in queryset[:6]:
            title = getattr(item, 'title', '') or item.surah_name_english
            params = {'q':title}
            if kind == 'books':
                params['language'] = item.language
            if kind == 'lectures':
                params['section'] = 'lectures'
                params['language'] = item.language
            resources.append({'id':item.pk,'kind':kind,'title':title,'url':path+'?'+urlencode(params),
                              'description':getattr(item,'description','')[:450],
                              'author':getattr(item,'author',getattr(item,'speaker',getattr(item,'reciter','')))})
    topics = Topic.objects.filter(is_published=True)
    topic_condition = metadata_matches(query, ['title','description'])
    if topic_condition:
        topics = topics.filter(topic_condition)
    elif not words & {'topic','topics','موضوعات','موضوع'}:
        topics = topics.none()
    for topic in topics[:6]:
        pages.append({'label':topic.title, 'url':'/topics?'+urlencode({'topic':topic.slug}), 'score':1})
    overview = bool(re.search(r'what.*(website|site|have|offer|data)|website.*(data|content)|کیا.*(ویب|مواد)', query.lower()))
    if overview:
        pages = [{'label':label,'url':url,'score':0} for label,url,_ in PAGES]
    # Keep the result bounded; more resources remain accessible through the named pages.
    count_question = bool(re.search(r'how many|count|total|کتنی|کتنے|عدد', query.lower()))
    return {'count_question':count_question, 'pages':pages[:10], 'resources':resources[:18], 'overview':overview,
            'counts':{'books':BookMedia.objects.count(),'lectures':TaqreerAudio.objects.count(),
                      'quran_audio':QuranAudio.objects.exclude(destination_folder__startswith='taqreer_').count(),
                      'videos':VideoMedia.objects.count(),'images':ImageMedia.objects.count(),
                      'topics':Topic.objects.filter(is_published=True).count(),
                      'hadith':Hadith.objects.count(),'tafseer':Tafseer.objects.count()}}


def catalog_context(catalog):
    return 'LIVE WEBSITE CATALOG (metadata, not full book contents):\n' + json.dumps(catalog,ensure_ascii=False)


def catalog_fallback(catalog, language):
    introductions = {'ur':'آپ ویب سائٹ کے ان صفحات پر جا سکتے ہیں:', 'ar':'يمكنك زيارة هذه الصفحات على الموقع:',
                     'ur_roman':'Aap website ke in safhon par ja sakte hain:'}
    text = introductions.get(language, 'Here are the website pages and resources you can open:')
    if catalog.get('count_question'):
        text = 'Current website catalog: ' + ', '.join(f'{count} {kind.replace("_", " ")}' for kind, count in catalog['counts'].items()) + '.\n\n' + text
    links = [{'label':p['label'],'url':p['url']} for p in catalog['pages'][:6]]
    links += [{'label':r['title'],'url':r['url']} for r in catalog['resources'][:6]]
    if not catalog['resources'] and not catalog['overview']:
        text += '\n' + {'ur':'اس تلاش میں کوئی مماثل فائل نہیں ملی۔ آپ نیچے دیے گئے صفحات پر مزید دیکھ سکتے ہیں۔',
                        'ar':'لم أجد ملفات مطابقة لهذا البحث. يمكنك تصفح الصفحات أدناه.'}.get(language,
                        'I did not find matching files in the current catalog. You can browse the pages below.')
    if not links:
        links = [{'label':'Books & Documents','url':'/books'},{'label':'Explore Topics','url':'/topics'}]
    text += '\n\n' + '\n'.join(f"• [{link['label'].replace('[','').replace(']','')}]({link['url']})" for link in links)
    return {'intent':'WEBSITE_SEARCH','answer':text,'actions':links,'suggested_questions':[]}
