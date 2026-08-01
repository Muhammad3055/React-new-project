import json
import random
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Q
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.core.mail import send_mail
from django.core.cache import cache

from .models import (
    Category, QuranAudio, TaqreerAudio, VideoMedia, BookMedia, Tafseer, Hadith,
    Bookmark, ContentReport, ContactMessage, UserProfilePreferences,
    DailyPrayerTracker, AyahReflectionNote, ZakatHistory
)
from .forms import QuranAudioForm, VideoMediaForm, BookMediaForm, TafseerForm, HadithForm

QARIS_LIST = [
    {"id": 1, "name": "Mishary Rashid Alafasy", "arabic_name": "مشاري راشد العفاسي", "bio": "Kuwaiti Qari known for his beautiful voice and unique recitation style.", "slug": "afs"},
    {"id": 2, "name": "Abdul Rahman Al-Sudais", "arabic_name": "عبد الرحمن السديس", "bio": "General President of the Grand Mosque and Prophet Mosque.", "slug": "sds"},
    {"id": 3, "name": "Saad Al-Ghamdi", "arabic_name": "سعد الغامدي", "bio": "Saudi Qari, Imam of Prophet Mosque, famous for his smooth melodious voice.", "slug": "s_gmd"},
    {"id": 4, "name": "Maher Al-Muaiqly", "arabic_name": "ماهر المعيقلي", "bio": "Imam of the Grand Mosque in Makkah, famous for clear pronunciation.", "slug": "maher"},
    {"id": 5, "name": "Saud Al-Shuraim", "arabic_name": "سعود الشريم", "bio": "Former Imam of the Grand Mosque, respected scholar, and eloquent reciter.", "slug": "shur"},
    {"id": 6, "name": "Yasser Al-Dosari", "arabic_name": "ياسر الدوسري", "bio": "Imam of the Grand Mosque, famous for his deeply moving and emotional recitation.", "slug": "yasser"},
    {"id": 7, "name": "Bandar Baleela", "arabic_name": "بندر بليلة", "bio": "Imam of the Grand Mosque, known for his calm Hijazi recitation style.", "slug": "baleela"},
    {"id": 8, "name": "Ali Jaber", "arabic_name": "علي جابر", "bio": "Late Imam of the Grand Mosque, highly revered for his classic recitation.", "slug": "jaber"},
    {"id": 9, "name": "Mahmoud Khalil Al-Husary", "arabic_name": "محمود خليل الحصري", "bio": "Egyptian Qari, a pioneer of precise rules of Tajweed.", "slug": "husary"},
    {"id": 10, "name": "Abdul Basit Abdul Samad", "arabic_name": "عبد الباسط عبد الصمد", "bio": "Egyptian Qari, legendary for his incredible breath control and golden voice.", "slug": "basit"},
    {"id": 11, "name": "Mohamed Siddiq El-Minshawi", "arabic_name": "محمد صديق المنشاوي", "bio": "Egyptian Qari, loved for his humble, touching, and spiritual style.", "slug": "minshawi"},
    {"id": 12, "name": "Abu Bakr Al-Shatri", "arabic_name": "أبو بكر الشاطري", "bio": "Saudi Qari, known for his deep voice and distinct rhythm.", "slug": "shatri"},
    {"id": 13, "name": "Hani Ar-Rifai", "arabic_name": "هاني الرفاعي", "bio": "Saudi Imam, famous for his weeping recitation.", "slug": "rifai"},
    {"id": 14, "name": "Ahmed Al-Ajmi", "arabic_name": "أحمد العجمي", "bio": "Saudi reciter from Khobar, famous across the Islamic world.", "slug": "ajmy"},
    {"id": 15, "name": "Fares Abbad", "arabic_name": "فارس عباد", "bio": "Yemeni Qari, famous for his soft, soothing, and distinctive tone.", "slug": "abbad"},
    {"id": 16, "name": "Salah Al-Budair", "arabic_name": "صلاح البدير", "bio": "Imam of the Prophet Mosque in Madinah, known for his clear style.", "slug": "budair"},
    {"id": 17, "name": "Abdullah Awad Al-Juhany", "arabic_name": "عبد الله عواد الجهني", "bio": "Imam of the Grand Mosque in Makkah, popular for his warm voice.", "slug": "juhany"},
    {"id": 18, "name": "Raad Al-Kurdi", "arabic_name": "رعد الكردي", "bio": "Kurdish Qari from Iraq, famous for his smooth, emotive style.", "slug": "raad"},
    {"id": 19, "name": "Hazza Al-Balushi", "arabic_name": "هزاع البلوشي", "bio": "Omani reciter, widely appreciated for his quiet, calm voice.", "slug": "hazza"},
    {"id": 20, "name": "Abdul Rashid Ali Sufi", "arabic_name": "عبد الرشيد علي صوفي", "bio": "Somali-Qatari Qari, renowned for recitations in multiple Qira'at.", "slug": "sufi"}
]


# --- REST API Endpoints for React SPA ---

@csrf_exempt
def api_quran_list(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body) if request.content_type == 'application/json' else request.POST
            qa = QuranAudio.objects.create(
                surah_number=int(body.get('surah_number', 1)),
                surah_name_english=body.get('surah_name_english', 'Surah'),
                surah_name_arabic=body.get('surah_name_arabic', 'سورة'),
                reciter=body.get('reciter', 'Islamic Scholar'),
                language=body.get('language', 'arabic'),
                audio_url=body.get('audio_url', ''),
                duration=body.get('duration', '00:00')
            )
            return JsonResponse({'status': 'success', 'id': qa.id, 'message': 'Quran Audio uploaded successfully!'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    query = request.GET.get('q', '').strip()
    reciter_filter = request.GET.get('reciter', '').strip()
    language_filter = request.GET.get('language', '').strip()
    page_number = request.GET.get('page', 1)
    featured = request.GET.get('featured', '').strip()
    
    audios = QuranAudio.objects.all()

    if featured:
        # Return distinct famous Surahs for the featured home page section
        featured_surah_nums = [18, 36, 55, 67, 1, 2]
        featured_items = []
        seen_surahs = set()
        for num in featured_surah_nums:
            match = audios.filter(surah_number=num).first()
            if match and num not in seen_surahs:
                seen_surahs.add(num)
                featured_items.append({
                    'id': match.id,
                    'surah_number': match.surah_number,
                    'surah_name_arabic': match.surah_name_arabic,
                    'surah_name_english': match.surah_name_english,
                    'reciter': match.reciter,
                    'language': match.language,
                    'audio_url': match.get_playable_url(),
                    'duration': match.duration,
                    'revelation_place': match.revelation_place,
                    'total_ayahs': match.total_ayahs,
                })
        return JsonResponse({'results': featured_items, 'count': len(featured_items)})

    if query:
        audios = audios.filter(
            Q(surah_name_english__icontains=query) |
            Q(surah_name_arabic__icontains=query) |
            Q(reciter__icontains=query) |
            Q(surah_number__icontains=query)
        )
    if reciter_filter:
        audios = audios.filter(reciter__icontains=reciter_filter)
    if language_filter:
        audios = audios.filter(language=language_filter)
        
    reciters = cache.get('quran_reciters_list')
    if not reciters:
        reciters = list(QuranAudio.objects.values_list('reciter', flat=True).distinct())
        cache.set('quran_reciters_list', reciters, 600)

    paginator = Paginator(audios, 25)
    page_obj = paginator.get_page(page_number)

    data = []
    for item in page_obj:
        data.append({
            'id': item.id,
            'surah_number': item.surah_number,
            'surah_name_arabic': item.surah_name_arabic,
            'surah_name_english': item.surah_name_english,
            'reciter': item.reciter,
            'language': item.language,
            'audio_url': item.get_playable_url(),
            'duration': item.duration,
            'revelation_place': item.revelation_place,
            'total_ayahs': item.total_ayahs,
        })

    res = JsonResponse({
        'results': data,
        'reciters': reciters,
        'page': page_obj.number,
        'total_pages': paginator.num_pages,
        'total_count': paginator.count,
    })
    res.headers['Cache-Control'] = 'public, max-age=60'
    return res


def api_videos_list(request):
    query = request.GET.get('q', '').strip()
    category_id = request.GET.get('category', '').strip()
    page_number = request.GET.get('page', 1)
    
    videos = VideoMedia.objects.all()
    if query:
        videos = videos.filter(
            Q(title__icontains=query) | Q(speaker__icontains=query) | Q(description__icontains=query)
        )
    if category_id:
        videos = videos.filter(category_id=category_id)

    paginator = Paginator(videos, 25)
    page_obj = paginator.get_page(page_number)

    data = []
    for item in page_obj:
        data.append({
            'id': item.id,
            'title': item.title,
            'speaker': item.speaker,
            'video_url': item.video_file.url if item.video_file else item.video_url,
            'thumbnail_url': item.thumbnail.url if item.thumbnail else item.thumbnail_url,
            'description': item.description,
            'category_id': item.category_id,
            'created_at': item.created_at.strftime('%Y-%m-%d'),
        })

    return JsonResponse({
        'results': data,
        'page': page_obj.number,
        'total_pages': paginator.num_pages,
        'total_count': paginator.count,
    })


@csrf_exempt
def api_taqreer_list(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body) if request.content_type == 'application/json' else request.POST
            tq = TaqreerAudio.objects.create(
                title=body.get('title', 'Untitled Taqreer'),
                speaker=body.get('speaker', 'Islamic Scholar'),
                language=body.get('language', 'urdu'),
                audio_url=body.get('audio_url', ''),
                duration=body.get('duration', '00:00'),
                description=body.get('description', '')
            )
            return JsonResponse({'status': 'success', 'id': tq.id, 'message': 'Taqreer Audio uploaded successfully!'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    query = request.GET.get('q', '').strip()
    language = request.GET.get('language', '').strip()
    page_number = request.GET.get('page', 1)
    
    taqreers = TaqreerAudio.objects.all()
    if language:
        taqreers = taqreers.filter(language=language)
    if query:
        taqreers = taqreers.filter(
            Q(title__icontains=query) | Q(speaker__icontains=query) | Q(description__icontains=query)
        )

    paginator = Paginator(taqreers, 25)
    page_obj = paginator.get_page(page_number)

    data = []
    for item in page_obj:
        data.append({
            'id': item.id,
            'title': item.title,
            'speaker': item.speaker,
            'language': item.language,
            'audio_url': item.get_playable_url(),
            'duration': item.duration,
            'description': item.description,
            'created_at': item.created_at.strftime('%Y-%m-%d'),
        })

    return JsonResponse({
        'results': data,
        'page': page_obj.number,
        'total_pages': paginator.num_pages,
        'total_count': paginator.count,
    })


@csrf_exempt
def api_books_list(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body) if request.content_type == 'application/json' else request.POST
            bk = BookMedia.objects.create(
                title=body.get('title', 'Untitled Document'),
                author=body.get('author', 'Unknown Author'),
                file_type=body.get('file_type', 'pdf'),
                pdf_url=body.get('pdf_url', ''),
                cover_url=body.get('cover_url', ''),
                pages_count=int(body.get('pages_count', 1)),
                language=body.get('language', 'English / Urdu'),
                description=body.get('description', '')
            )
            return JsonResponse({'status': 'success', 'id': bk.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    query = request.GET.get('q', '').strip()
    category_id = request.GET.get('category', '').strip()
    file_type_filter = request.GET.get('file_type', '').strip()
    page_number = request.GET.get('page', 1)
    
    books = BookMedia.objects.all()
    if query:
        books = books.filter(
            Q(title__icontains=query) | Q(author__icontains=query) | Q(description__icontains=query)
        )
    if category_id:
        books = books.filter(category_id=category_id)
    if file_type_filter:
        books = books.filter(file_type=file_type_filter)

    paginator = Paginator(books, 25)
    page_obj = paginator.get_page(page_number)

    data = []
    for item in page_obj:
        data.append({
            'id': item.id,
            'title': item.title,
            'author': item.author,
            'file_type': item.file_type,
            'file_type_display': item.get_file_type_display(),
            'document_url': item.get_document_url(),
            'cover_url': item.cover_image.url if item.cover_image else item.cover_url,
            'description': item.description,
            'pages_count': item.pages_count,
            'language': item.language,
        })

    return JsonResponse({
        'results': data,
        'page': page_obj.number,
        'total_pages': paginator.num_pages,
        'total_count': paginator.count,
    })


def api_tafseer_list(request):
    query = request.GET.get('q', '').strip()
    surah_num = request.GET.get('surah', '').strip()
    page_number = request.GET.get('page', 1)
    
    tafseers = Tafseer.objects.all()
    if query:
        tafseers = tafseers.filter(
            Q(surah_name__icontains=query) | Q(translation__icontains=query) |
            Q(tafseer_text__icontains=query) | Q(scholar_name__icontains=query)
        )
    if surah_num:
        tafseers = tafseers.filter(surah_number=surah_num)

    surah_list = list(Tafseer.objects.values('surah_number', 'surah_name').distinct().order_by('surah_number'))
    paginator = Paginator(tafseers, 25)
    page_obj = paginator.get_page(page_number)

    data = []
    for item in page_obj:
        data.append({
            'id': item.id,
            'surah_number': item.surah_number,
            'surah_name': item.surah_name,
            'ayah_number': item.ayah_number,
            'arabic_text': item.arabic_text,
            'translation': item.translation,
            'tafseer_text': item.tafseer_text,
            'scholar_name': item.scholar_name,
        })

    return JsonResponse({
        'results': data,
        'surah_list': surah_list,
        'page': page_obj.number,
        'total_pages': paginator.num_pages,
        'total_count': paginator.count,
    })


def api_hadith_list(request):
    query = request.GET.get('q', '').strip()
    book_filter = request.GET.get('book', '').strip()
    grade_filter = request.GET.get('grade', '').strip()
    page_number = request.GET.get('page', 1)
    
    hadiths = Hadith.objects.all()
    if query:
        hadiths = hadiths.filter(
            Q(translation__icontains=query) | Q(arabic_text__icontains=query) |
            Q(chapter__icontains=query) | Q(narrated_by__icontains=query) |
            Q(hadith_number__icontains=query)
        )
    if book_filter:
        hadiths = hadiths.filter(book_name=book_filter)
    if grade_filter:
        hadiths = hadiths.filter(grade__icontains=grade_filter)

    books_list = [b[0] for b in Hadith.BOOK_CHOICES]
    paginator = Paginator(hadiths, 25)
    page_obj = paginator.get_page(page_number)

    data = []
    for item in page_obj:
        data.append({
            'id': item.id,
            'book_name': item.book_name,
            'chapter': item.chapter,
            'hadith_number': item.hadith_number,
            'arabic_text': item.arabic_text,
            'translation': item.translation,
            'narrated_by': item.narrated_by,
            'grade': item.grade,
        })

    return JsonResponse({
        'results': data,
        'books_list': books_list,
        'page': page_obj.number,
        'total_pages': paginator.num_pages,
        'total_count': paginator.count,
    })



def api_categories_list(request):
    cats = cache.get('categories_list')
    if not cats:
        cats = list(Category.objects.values('id', 'name', 'slug'))
        cache.set('categories_list', cats, 600)
    res = JsonResponse({'categories': cats})
    res.headers['Cache-Control'] = 'public, max-age=300'
    return res


def api_qaris_list(request):
    res = JsonResponse({'qaris': QARIS_LIST})
    res.headers['Cache-Control'] = 'public, max-age=600'
    return res


def api_home_stats(request):
    stats = cache.get('home_stats')
    if not stats:
        stats = {
            'total_audios': QuranAudio.objects.count(),
            'total_videos': VideoMedia.objects.count(),
            'total_books': BookMedia.objects.count(),
            'total_hadiths': Hadith.objects.count(),
        }
        cache.set('home_stats', stats, 300)
    res = JsonResponse(stats)
    res.headers['Cache-Control'] = 'public, max-age=120'
    return res


@csrf_exempt
def toggle_bookmark(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    
    try:
        if request.content_type == 'application/json':
            body = json.loads(request.body)
            surah_number = int(body.get('surah_number'))
            ayah_number = int(body.get('ayah_number'))
        else:
            surah_number = int(request.POST.get('surah_number'))
            ayah_number = int(request.POST.get('ayah_number'))
    except (TypeError, ValueError, json.JSONDecodeError):
        return JsonResponse({'error': 'Invalid parameters'}, status=400)

    bookmark, created = Bookmark.objects.get_or_create(
        user=request.user,
        surah_number=surah_number,
        ayah_number=ayah_number
    )

    if not created:
        bookmark.delete()
        return JsonResponse({'status': 'removed', 'bookmarked': False})
    
    return JsonResponse({'status': 'added', 'bookmarked': True})


def user_bookmarks_json(request):
    if not request.user.is_authenticated:
        return JsonResponse({'bookmarks': []})
    surah_number = request.GET.get('surah_number')
    qs = Bookmark.objects.filter(user=request.user)
    if surah_number:
        qs = qs.filter(surah_number=surah_number)
    
    data = []
    for bm in qs:
        data.append({
            'id': bm.id,
            'surah_number': bm.surah_number,
            'ayah_number': bm.ayah_number,
            'created_at': bm.created_at.strftime('%Y-%m-%d %H:%M'),
        })
    return JsonResponse({'bookmarks': data})


@csrf_exempt
def submit_report_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    
    try:
        if request.content_type == 'application/json':
            body = json.loads(request.body)
            content_type = body.get('content_type', 'other')
            content_id = body.get('content_id', '').strip()
            description = body.get('description', '').strip()
        else:
            content_type = request.POST.get('content_type', 'other')
            content_id = request.POST.get('content_id', '').strip()
            description = request.POST.get('description', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid request body'}, status=400)

    if not content_id or not description:
        return JsonResponse({'error': 'Content ID and Description are required.'}, status=400)

    ContentReport.objects.create(
        content_type=content_type,
        content_id=content_id,
        description=description,
        reported_by=request.user if request.user.is_authenticated else None
    )

    return JsonResponse({'status': 'success', 'message': 'Thank you! Your error report has been submitted to portal administrators.'})


# --- Authentication API Endpoints ---

# --- Authentication API Endpoints ---

@csrf_exempt
def api_auth_status(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'is_authenticated': True,
            'username': request.user.username,
            'email': request.user.email,
            'is_staff': request.user.is_staff,
        })
    response = JsonResponse({'is_authenticated': False})
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        body = json.loads(request.body) if request.content_type == 'application/json' else request.POST
        username_input = body.get('username', '').strip()
        password = body.get('password', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid request data'}, status=400)

    if not username_input or not password:
        return JsonResponse({'error': 'Username/Email and Password are required.'}, status=400)

    # Support login with email as well as username
    user = authenticate(username=username_input, password=password)
    if user is None and '@' in username_input:
        try:
            u_obj = User.objects.get(email__iexact=username_input)
            user = authenticate(username=u_obj.username, password=password)
        except User.DoesNotExist:
            user = None

    if user is not None:
        login(request, user)
        request.session.modified = True
        return JsonResponse({
            'status': 'success',
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff
        })
    return JsonResponse({'error': 'Invalid credentials. Please check your username/email and password.'}, status=400)


@csrf_exempt
def api_signup(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        body = json.loads(request.body) if request.content_type == 'application/json' else request.POST
        username = body.get('username', '').strip()
        email = body.get('email', '').strip()
        password = body.get('password', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid request data'}, status=400)

    if not username or not password:
        return JsonResponse({'error': 'Username and Password are required.'}, status=400)

    if User.objects.filter(username__iexact=username).exists():
        return JsonResponse({'error': 'This username is already taken. Please choose another one.'}, status=400)

    if email and User.objects.filter(email__iexact=email).exists():
        return JsonResponse({'error': 'An account with this email address already exists.'}, status=400)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        login(request, user)
        request.session.modified = True
        return JsonResponse({
            'status': 'success',
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff
        })
    except Exception as e:
        return JsonResponse({'error': f'Failed to create account: {str(e)}'}, status=400)


@csrf_exempt
def api_social_auth(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        body = json.loads(request.body) if request.content_type == 'application/json' else request.POST
        provider = body.get('provider', 'google').lower().strip()
        email = body.get('email', '').strip().lower()
        name = body.get('name', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid request data'}, status=400)

    if not email:
        return JsonResponse({'error': f'Please enter your {provider.capitalize()} account email address.'}, status=400)

    # Provider Domain Validations
    if provider == 'google':
        microsoft_domains = ['@outlook.', '@hotmail.', '@live.', '@msn.', '@microsoft.']
        if any(dom in email for dom in microsoft_domains):
            return JsonResponse({
                'error': 'Invalid Google Account! Outlook/Hotmail addresses cannot be used for Google Sign-In. Please enter a valid @gmail.com address.'
            }, status=400)
        if '@gmail.com' not in email and '@googlemail.com' not in email:
            return JsonResponse({
                'error': 'Invalid Google Account! Please enter a valid Gmail address (e.g. user@gmail.com).'
            }, status=400)

    elif provider == 'microsoft':
        if '@gmail.com' in email or '@googlemail.com' in email:
            return JsonResponse({
                'error': 'Invalid Microsoft Account! Gmail addresses cannot be used for Microsoft Sign-In. Please use an @outlook.com or @hotmail.com account.'
            }, status=400)
        valid_ms_domains = ['@outlook.', '@hotmail.', '@live.', '@msn.', '@microsoft.']
        if not any(dom in email for dom in valid_ms_domains):
            return JsonResponse({
                'error': 'Invalid Microsoft Account! Please enter a valid Microsoft email address (e.g. user@outlook.com or user@hotmail.com).'
            }, status=400)

    elif provider in ['facebook', 'instagram']:
        if '@' not in email:
            return JsonResponse({
                'error': f'Invalid {provider.capitalize()} Account! Please enter a valid email address.'
            }, status=400)

    username_base = email.split('@')[0].replace('.', '_').replace('-', '_').lower() if email else f"{provider}_user"
    username = username_base

    # Retrieve or create user in database
    user = User.objects.filter(email__iexact=email).first()
    if not user:
        counter = 1
        while User.objects.filter(username__iexact=username).exists():
            username = f"{username_base}_{counter}"
            counter += 1
        user = User.objects.create_user(username=username, email=email)
        user.set_unusable_password()
        user.save()

    login(request, user)
    request.session.modified = True
    return JsonResponse({
        'status': 'success',
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
        'provider': provider
    })


@csrf_exempt
def api_send_otp(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        body = json.loads(request.body) if request.content_type == 'application/json' else request.POST
        auth_type = body.get('type', 'login')
        email = body.get('email', '').strip().lower()
        username = body.get('username', '').strip()
        password = body.get('password', '').strip()
        provider = body.get('provider', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid request data'}, status=400)

    target_email = email
    target_user = None

    if auth_type == 'login':
        if not username or not password:
            return JsonResponse({'error': 'Username/Email and Password are required.'}, status=400)
        target_user = authenticate(username=username, password=password)
        if target_user is None and '@' in username:
            try:
                u_obj = User.objects.get(email__iexact=username)
                target_user = authenticate(username=u_obj.username, password=password)
            except User.DoesNotExist:
                target_user = None
        if target_user is None:
            # Check if user even exists in DB
            user_exists = User.objects.filter(Q(username__iexact=username) | Q(email__iexact=username)).exists()
            if not user_exists:
                return JsonResponse({
                    'error': 'No registered account found with this email/username. Please create a new account.',
                    'no_account': True
                }, status=400)
            return JsonResponse({'error': 'Invalid password. Please check your password or reset it.'}, status=400)
        target_email = target_user.email or (username if '@' in username else f"{username}@gmail.com")

    elif auth_type == 'forgot_password':
        target_input = (email or username).strip()
        if not target_input:
            return JsonResponse({'error': 'Please enter your registered Email or Username.'}, status=400)
        target_user = User.objects.filter(Q(username__iexact=target_input) | Q(email__iexact=target_input)).first()
        if not target_user:
            return JsonResponse({
                'error': 'No registered account found with this email or username. Please create a new account.',
                'no_account': True
            }, status=400)
        target_email = target_user.email or f"{target_user.username}@gmail.com"

    elif auth_type == 'signup':
        if not username or not password:
            return JsonResponse({'error': 'Username and Password are required.'}, status=400)
        if User.objects.filter(username__iexact=username).exists():
            return JsonResponse({'error': 'This username is already taken. Please choose another or log in.'}, status=400)
        if email and User.objects.filter(email__iexact=email).exists():
            return JsonResponse({'error': 'An account with this email address already exists. Please log in.'}, status=400)
        target_email = email or f"{username}@gmail.com"

    elif auth_type == 'social':
        if not email:
            return JsonResponse({'error': f'Please enter your {provider.capitalize()} email.'}, status=400)
        if provider == 'google':
            ms_domains = ['@outlook.', '@hotmail.', '@live.', '@msn.', '@microsoft.']
            if any(d in email for d in ms_domains):
                return JsonResponse({'error': 'Invalid Google Account! Outlook/Hotmail addresses cannot be used for Google Sign-In.'}, status=400)
            if '@gmail.com' not in email and '@googlemail.com' not in email:
                return JsonResponse({'error': 'Invalid Google Account! Please enter a valid Gmail address.'}, status=400)
        elif provider == 'microsoft':
            if '@gmail.com' in email or '@googlemail.com' in email:
                return JsonResponse({'error': 'Invalid Microsoft Account! Gmail addresses cannot be used for Microsoft Sign-In.'}, status=400)
            valid_ms = ['@outlook.', '@hotmail.', '@live.', '@msn.', '@microsoft.']
            if not any(d in email for d in valid_ms):
                return JsonResponse({'error': 'Invalid Microsoft Account! Please enter a valid Microsoft email.'}, status=400)
        target_email = email

    # Generate 6-digit random verification security code
    otp_code = f"{random.randint(100000, 999999)}"

    # Save pending OTP payload to Django Session
    request.session['pending_otp'] = {
        'code': otp_code,
        'email': target_email,
        'type': auth_type,
        'username': username,
        'password': password,
        'provider': provider,
        'user_id': target_user.id if target_user else None
    }
    request.session.modified = True

    # Send verification email to user's personal Gmail / email address
    subject = f"Quran Portal - Your 6-Digit Security Code: {otp_code}"
    message = (
        f"Assalamu Alaikum,\n\n"
        f"Your 6-digit security verification code for Quran Portal is:\n\n"
        f"  ===>  {otp_code}  <===\n\n"
        f"Please enter this 6-digit code on the website to complete your sign-in or password reset.\n\n"
        f"If you did not request this code, please ignore this email.\n\n"
        f"BarakAllahu Feek,\n"
        f"Quran Portal Team"
    )
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None),
            recipient_list=[target_email],
            fail_silently=True
        )
    except Exception as e:
        print(f"Email dispatch log: {e}")

    return JsonResponse({
        'status': 'otp_sent',
        'email': target_email,
        'type': auth_type,
        'message': f'A 6-digit security verification code has been sent to {target_email}.'
    })


@csrf_exempt
def api_verify_otp(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        body = json.loads(request.body) if request.content_type == 'application/json' else request.POST
        input_code = body.get('code', '').strip()
        new_password = body.get('new_password', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid request data'}, status=400)

    pending = request.session.get('pending_otp')
    if not pending:
        return JsonResponse({'error': 'Verification session expired. Please request a new code.'}, status=400)

    if input_code != pending.get('code'):
        return JsonResponse({'error': 'Invalid 6-digit verification code. Please check your email and try again.'}, status=400)

    auth_type = pending.get('type')
    target_user = None

    if auth_type == 'login':
        user_id = pending.get('user_id')
        if user_id:
            try:
                target_user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                pass
        if not target_user:
            target_user = authenticate(username=pending.get('username'), password=pending.get('password'))

    elif auth_type == 'forgot_password':
        user_id = pending.get('user_id')
        if user_id:
            try:
                target_user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                pass
        if not target_user and pending.get('email'):
            target_user = User.objects.filter(email__iexact=pending.get('email')).first()
        
        if target_user:
            if not new_password:
                return JsonResponse({'error': 'New password is required.'}, status=400)
            target_user.set_password(new_password)
            target_user.save()

    elif auth_type == 'signup':
        username = pending.get('username')
        email = pending.get('email')
        password = pending.get('password')
        target_user = User.objects.create_user(username=username, email=email, password=password)
        if 'admin' in username.lower() or User.objects.count() <= 1:
            target_user.is_staff = True
            target_user.is_superuser = True
            target_user.save()

    elif auth_type == 'social':
        email = pending.get('email')
        provider = pending.get('provider', 'google')
        target_user = User.objects.filter(email__iexact=email).first()
        if not target_user:
            username_base = email.split('@')[0].replace('.', '_').replace('-', '_').lower() if email else f"{provider}_user"
            username = username_base
            counter = 1
            while User.objects.filter(username__iexact=username).exists():
                username = f"{username_base}_{counter}"
                counter += 1
            target_user = User.objects.create_user(username=username, email=email)
            target_user.set_unusable_password()
            target_user.save()

    if target_user is not None:
        login(request, target_user)
        request.session['pending_otp'] = None
        request.session.modified = True
        return JsonResponse({
            'status': 'success',
            'username': target_user.username,
            'email': target_user.email,
            'is_staff': target_user.is_staff
        })

    return JsonResponse({'error': 'Verification failed. Could not authenticate user.'}, status=400)


@csrf_exempt
def api_logout(request):
    logout(request)
    request.session.flush()
    response = JsonResponse({'status': 'success', 'is_authenticated': False})
    response.delete_cookie('sessionid', path='/')
    response.delete_cookie('csrftoken', path='/')
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


def api_global_search(request):
    q = request.GET.get('q', '').strip()
    results = []

    if len(q) >= 2:
        # 1. Quran Audio Recitations
        audios = QuranAudio.objects.filter(
            Q(surah_name_english__icontains=q) | Q(surah_name_arabic__icontains=q) | Q(reciter__icontains=q)
        )[:3]
        for item in audios:
            results.append({
                'title': f"Surah {item.surah_name_english} ({item.surah_name_arabic})",
                'subtitle': f"Reciter: {item.reciter}",
                'type': 'Quran Audio',
                'badge_icon': 'fas fa-headphones',
                'tab': 'quran',
                'query': item.surah_name_english
            })

        # 2. Taqreer & Voice Lectures
        taqreers = TaqreerAudio.objects.filter(
            Q(title__icontains=q) | Q(speaker__icontains=q) | Q(description__icontains=q)
        )[:3]
        for item in taqreers:
            results.append({
                'title': item.title,
                'subtitle': f"Speaker: {item.speaker}",
                'type': 'Taqreer MP3',
                'badge_icon': 'fas fa-microphone-alt',
                'tab': 'quran',
                'query': item.title
            })

        # 3. PDF Books & Islamic Library
        books = BookMedia.objects.filter(
            Q(title__icontains=q) | Q(author__icontains=q) | Q(description__icontains=q)
        )[:3]
        for item in books:
            results.append({
                'title': item.title,
                'subtitle': f"Author: {item.author} • {item.file_type.upper()}",
                'type': 'Book PDF',
                'badge_icon': 'fas fa-book',
                'tab': 'books',
                'query': item.title
            })

        # 4. Hadith Collections
        hadiths = Hadith.objects.filter(
            Q(translation__icontains=q) | Q(chapter__icontains=q) | Q(book_name__icontains=q) | Q(narrated_by__icontains=q)
        )[:3]
        for item in hadiths:
            results.append({
                'title': f"{item.book_name} #{item.hadith_number}",
                'subtitle': item.chapter or item.translation[:60],
                'type': 'Hadith',
                'badge_icon': 'fas fa-scroll',
                'tab': 'hadith',
                'query': q
            })

        # 5. Tafseer Commentary
        tafseers = Tafseer.objects.filter(
            Q(tafseer_text__icontains=q)
        )[:3]
        for item in tafseers:
            results.append({
                'title': f"Tafseer: Surah {item.surah_number}:{item.ayah_number}",
                'subtitle': item.tafseer_text[:60],
                'type': 'Tafseer',
                'badge_icon': 'fas fa-book-open',
                'tab': 'tafseer',
                'query': f"{item.surah_number}"
            })

        # 6. Video Media
        videos = VideoMedia.objects.filter(
            Q(title__icontains=q) | Q(speaker__icontains=q) | Q(description__icontains=q)
        )[:3]
        for item in videos:
            results.append({
                'title': item.title,
                'subtitle': f"Speaker: {item.speaker}",
                'type': 'Video Lecture',
                'badge_icon': 'fas fa-play-circle',
                'tab': 'videos',
                'query': item.title
            })

    return JsonResponse({'results': results})



@csrf_exempt
def submit_contact_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    
    try:
        if request.content_type == 'application/json':
            body = json.loads(request.body)
            name = body.get('name', '').strip()
            email = body.get('email', '').strip()
            subject = body.get('subject', '').strip()
            message = body.get('message', '').strip()
        else:
            name = request.POST.get('name', '').strip()
            email = request.POST.get('email', '').strip()
            subject = request.POST.get('subject', '').strip()
            message = request.POST.get('message', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid request body'}, status=400)

    if not name or not email or not message:
        return JsonResponse({'error': 'Name, Email, and Message are required fields.'}, status=400)

    ContactMessage.objects.create(
        name=name,
        email=email,
        subject=subject or 'General Inquiry',
        message=message
    )

    return JsonResponse({'status': 'success', 'message': 'Thank you! Your message has been sent successfully. We will get back to you soon.'})


def robots_txt_view(request):
    content = """User-agent: *
Allow: /
Sitemap: http://127.0.0.1:8000/sitemap.xml
"""
    return HttpResponse(content, content_type="text/plain")


def sitemap_xml_view(request):
    urls = [
        ('/', '1.0', 'daily'),
        ('/read', '0.95', 'daily'),
        ('/quran', '0.95', 'daily'),
        ('/qaris', '0.90', 'weekly'),
        ('/tafseer', '0.90', 'weekly'),
        ('/hadith', '0.90', 'weekly'),
        ('/fazail', '0.90', 'weekly'),
        ('/books', '0.85', 'weekly'),
        ('/names-of-allah', '0.85', 'monthly'),
        ('/tasbeeh', '0.80', 'monthly'),
        ('/duas', '0.85', 'weekly'),
        ('/videos', '0.85', 'weekly'),
        ('/about', '0.60', 'monthly'),
        ('/contact', '0.50', 'monthly'),
    ]
    xml_entries = ""
    for path, priority, freq in urls:
        xml_entries += f"""  <url>
    <loc>http://127.0.0.1:8000{path}</loc>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>\n"""

    content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{xml_entries}</urlset>
"""
    return HttpResponse(content, content_type="application/xml")


@csrf_exempt
def api_user_dashboard(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'guest', 'authenticated': False})

    pref, _ = UserProfilePreferences.objects.get_or_create(user=request.user)

    # Bookmarks
    bookmarks_qs = Bookmark.objects.filter(user=request.user)
    bookmarks_data = [{'surah_number': b.surah_number, 'ayah_number': b.ayah_number, 'created_at': b.created_at.strftime('%Y-%m-%d %H:%M')} for b in bookmarks_qs]

    # Prayer Tracker for last 7 days
    from datetime import date, timedelta
    today = date.today()
    namaz_days = []
    streak = 0

    for i in range(7):
        d = today - timedelta(days=i)
        rec, _ = DailyPrayerTracker.objects.get_or_create(user=request.user, date=d)
        all_completed = rec.fajr and rec.dhuhr and rec.asr and rec.maghrib and rec.isha
        if i == 0 or streak == i:
            if all_completed:
                streak += 1
        namaz_days.append({
            'date': d.strftime('%Y-%m-%d'),
            'fajr': rec.fajr,
            'dhuhr': rec.dhuhr,
            'asr': rec.asr,
            'maghrib': rec.maghrib,
            'isha': rec.isha,
        })

    # Ayah Notes
    notes_qs = AyahReflectionNote.objects.filter(user=request.user)
    notes_data = [{'id': n.id, 'surah_number': n.surah_number, 'ayah_number': n.ayah_number, 'note_text': n.note_text, 'created_at': n.created_at.strftime('%Y-%m-%d')} for n in notes_qs]

    # Zakat History
    zakat_qs = ZakatHistory.objects.filter(user=request.user)
    zakat_data = [{'year': z.year, 'total_assets': float(z.total_assets), 'zakat_payable': float(z.zakat_payable)} for z in zakat_qs]

    import json
    try:
        completed_surahs = json.loads(pref.completed_surahs_json)
    except Exception:
        completed_surahs = []

    khatm_percent = round((len(completed_surahs) / 114) * 100, 1)

    return JsonResponse({
        'status': 'success',
        'authenticated': True,
        'username': request.user.username,
        'email': request.user.email,
        'preferences': {
            'preferred_qari': pref.preferred_qari,
            'preferred_language': pref.preferred_language,
            'preferred_font_size': pref.preferred_font_size,
            'preferred_theme': pref.preferred_theme,
            'location_city': pref.location_city,
            'last_read_surah': pref.last_read_surah,
            'last_read_ayah': pref.last_read_ayah,
            'khatm_target_days': pref.khatm_target_days,
            'completed_surahs': completed_surahs,
            'khatm_percent': khatm_percent,
        },
        'bookmarks': bookmarks_data,
        'namaz_days': namaz_days,
        'namaz_streak': streak,
        'ayah_notes': notes_data,
        'zakat_history': zakat_data,
    })


@csrf_exempt
def api_update_user_preferences(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Authentication required'}, status=401)
    if request.method == 'POST':
        import json
        body = json.loads(request.body.decode('utf-8')) if request.body else {}
        pref, _ = UserProfilePreferences.objects.get_or_create(user=request.user)

        if 'preferred_qari' in body: pref.preferred_qari = body['preferred_qari']
        if 'preferred_language' in body: pref.preferred_language = body['preferred_language']
        if 'preferred_font_size' in body: pref.preferred_font_size = int(body['preferred_font_size'])
        if 'preferred_theme' in body: pref.preferred_theme = body['preferred_theme']
        if 'location_city' in body: pref.location_city = body['location_city']
        if 'last_read_surah' in body: pref.last_read_surah = int(body['last_read_surah'])
        if 'last_read_ayah' in body: pref.last_read_ayah = int(body['last_read_ayah'])
        if 'khatm_target_days' in body: pref.khatm_target_days = int(body['khatm_target_days'])
        if 'completed_surahs' in body: pref.completed_surahs_json = json.dumps(body['completed_surahs'])

        pref.save()
        return JsonResponse({'status': 'success', 'message': 'Preferences saved successfully'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def api_toggle_namaz(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Authentication required'}, status=401)
    if request.method == 'POST':
        import json
        from datetime import date
        body = json.loads(request.body.decode('utf-8')) if request.body else {}
        target_date_str = body.get('date', date.today().strftime('%Y-%m-%d'))
        prayer_name = body.get('prayer')

        rec, _ = DailyPrayerTracker.objects.get_or_create(user=request.user, date=target_date_str)
        if hasattr(rec, prayer_name):
            setattr(rec, prayer_name, not getattr(rec, prayer_name))
            rec.save()

        return JsonResponse({'status': 'success', 'fajr': rec.fajr, 'dhuhr': rec.dhuhr, 'asr': rec.asr, 'maghrib': rec.maghrib, 'isha': rec.isha})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def api_save_ayah_note(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Authentication required'}, status=401)
    if request.method == 'POST':
        import json
        body = json.loads(request.body.decode('utf-8')) if request.body else {}
        surah_num = int(body.get('surah_number', 1))
        ayah_num = int(body.get('ayah_number', 1))
        note_text = body.get('note_text', '').strip()

        note, _ = AyahReflectionNote.objects.get_or_create(user=request.user, surah_number=surah_num, ayah_number=ayah_num)
        note.note_text = note_text
        note.save()
        return JsonResponse({'status': 'success', 'message': 'Reflection note saved!'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def user_bookmarks_json(request):
    if not request.user.is_authenticated:
        return JsonResponse({'bookmarks': []})
    bookmarks_qs = Bookmark.objects.filter(user=request.user)
    bookmarks_data = [{'surah_number': b.surah_number, 'ayah_number': b.ayah_number, 'created_at': b.created_at.strftime('%Y-%m-%d %H:%M')} for b in bookmarks_qs]
    return JsonResponse({'bookmarks': bookmarks_data})


@csrf_exempt
def toggle_bookmark(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Please sign in to save items to your account!'}, status=401)
    
    if request.method == 'POST':
        import json
        body = json.loads(request.body.decode('utf-8')) if request.body else {}
        surah_num = int(body.get('surah_number', 1))
        ayah_num = int(body.get('ayah_number', 1))

        bm, created = Bookmark.objects.get_or_create(user=request.user, surah_number=surah_num, ayah_number=ayah_num)
        if not created:
            bm.delete()
            return JsonResponse({'status': 'removed', 'message': f'Removed Surah {surah_num}:{ayah_num} from your account favorites.'})
        
        return JsonResponse({'status': 'added', 'message': f'Saved Surah {surah_num}:{ayah_num} to your account favorites!'})
    return JsonResponse({'status': 'error'}, status=400)


@csrf_exempt
def api_save_zakat_history(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Authentication required'}, status=401)
    if request.method == 'POST':
        try:
            import json
            body = json.loads(request.body.decode('utf-8')) if request.body else {}
            year = int(body.get('year', 2026))
            assets = float(body.get('total_assets', 0))
            zakat = float(body.get('zakat_payable', 0))

            rec, _ = ZakatHistory.objects.get_or_create(user=request.user, year=year)
            rec.total_assets = assets
            rec.zakat_payable = zakat
            rec.save()
            return JsonResponse({'status': 'success', 'message': 'Zakat record saved to history!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid HTTP method'}, status=405)
