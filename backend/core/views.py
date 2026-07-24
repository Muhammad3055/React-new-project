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

from .models import Category, QuranAudio, VideoMedia, BookMedia, Tafseer, Hadith, Bookmark, ContentReport, ContactMessage
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

def api_quran_list(request):
    query = request.GET.get('q', '').strip()
    reciter_filter = request.GET.get('reciter', '').strip()
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
        
    reciters = list(QuranAudio.objects.values_list('reciter', flat=True).distinct())

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
            'audio_url': item.get_playable_url(),
            'duration': item.duration,
            'revelation_place': item.revelation_place,
            'total_ayahs': item.total_ayahs,
        })

    return JsonResponse({
        'results': data,
        'reciters': reciters,
        'page': page_obj.number,
        'total_pages': paginator.num_pages,
        'total_count': paginator.count,
    })


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


def api_books_list(request):
    query = request.GET.get('q', '').strip()
    category_id = request.GET.get('category', '').strip()
    page_number = request.GET.get('page', 1)
    
    books = BookMedia.objects.all()
    if query:
        books = books.filter(
            Q(title__icontains=query) | Q(author__icontains=query) | Q(description__icontains=query)
        )
    if category_id:
        books = books.filter(category_id=category_id)

    paginator = Paginator(books, 25)
    page_obj = paginator.get_page(page_number)

    data = []
    for item in page_obj:
        data.append({
            'id': item.id,
            'title': item.title,
            'author': item.author,
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
    cats = list(Category.objects.values('id', 'name', 'slug'))
    return JsonResponse({'categories': cats})


def api_qaris_list(request):
    return JsonResponse({'qaris': QARIS_LIST})


def api_home_stats(request):
    return JsonResponse({
        'total_audios': QuranAudio.objects.count(),
        'total_videos': VideoMedia.objects.count(),
        'total_books': BookMedia.objects.count(),
        'total_hadiths': Hadith.objects.count(),
    })


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
            return JsonResponse({'error': 'Invalid credentials. Please check your username/email and password.'}, status=400)
        target_email = target_user.email or (username if '@' in username else f"{username}@gmail.com")

    elif auth_type == 'signup':
        if not username or not password:
            return JsonResponse({'error': 'Username and Password are required.'}, status=400)
        if User.objects.filter(username__iexact=username).exists():
            return JsonResponse({'error': 'This username is already taken. Please choose another.'}, status=400)
        if email and User.objects.filter(email__iexact=email).exists():
            return JsonResponse({'error': 'An account with this email address already exists.'}, status=400)
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

    return JsonResponse({
        'status': 'otp_sent',
        'email': target_email,
        'code': otp_code,
        'message': f'A 6-digit security verification code has been sent to {target_email}.'
    })


@csrf_exempt
def api_verify_otp(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        body = json.loads(request.body) if request.content_type == 'application/json' else request.POST
        input_code = body.get('code', '').strip()
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

    elif auth_type == 'signup':
        username = pending.get('username')
        email = pending.get('email')
        password = pending.get('password')
        target_user = User.objects.create_user(username=username, email=email, password=password)

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
        audios = QuranAudio.objects.filter(
            Q(surah_name_english__icontains=q) | Q(surah_name_arabic__icontains=q)
        )[:3]
        for item in audios:
            results.append({
                'title': f"Quran: Surah {item.surah_name_english} ({item.surah_name_arabic})",
                'type': 'Audio',
                'tab': 'quran',
                'query': item.surah_name_english
            })

        videos = VideoMedia.objects.filter(title__icontains=q)[:3]
        for item in videos:
            results.append({
                'title': f"Video: {item.title}",
                'type': 'Video',
                'tab': 'videos',
                'query': item.title
            })

        books = BookMedia.objects.filter(title__icontains=q)[:3]
        for item in books:
            results.append({
                'title': f"Book: {item.title}",
                'type': 'Book',
                'tab': 'books',
                'query': item.title
            })

        hadiths = Hadith.objects.filter(Q(translation__icontains=q) | Q(chapter__icontains=q))[:3]
        for item in hadiths:
            results.append({
                'title': f"Hadith: {item.book_name} #{item.hadith_number}",
                'type': 'Hadith',
                'tab': 'hadith',
                'query': q
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
    content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://127.0.0.1:8000/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>http://127.0.0.1:8000/read</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>http://127.0.0.1:8000/quran</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>http://127.0.0.1:8000/tafseer</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>http://127.0.0.1:8000/hadith</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>http://127.0.0.1:8000/books</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>http://127.0.0.1:8000/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
"""
    return HttpResponse(content, content_type="application/xml")
