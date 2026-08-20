from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

from django.shortcuts import render

# Customize the admin interface
admin.site.site_header = "Maktaba tul Muslim — Admin Studio"
admin.site.site_title = "Maktaba tul Muslim"
admin.site.index_title = "Maktaba tul Muslim Content & Library Management"

def root_health_view(request):
    # If requested by API client or format=json, return JSON
    if 'application/json' in request.headers.get('Accept', '') or request.GET.get('format') == 'json':
        return JsonResponse({
            "status": "online",
            "service": "Maktaba tul Muslim API Backend",
            "version": "1.0.0",
            "admin_panel": "/admin/",
            "api_endpoints": {
                "quran": "/api/quran/",
                "books": "/api/books/",
                "hadith": "/api/hadith/",
                "qaris": "/api/qaris/",
                "stats": "/api/stats/"
            }
        })
    
    # If opened in browser, render full website HTML template
    return render(request, 'index.html', {
        'total_audios': 114,
        'total_videos': 50,
        'total_books': 35,
        'total_hadith': 7000
    })

import os
from django.http import FileResponse, Http404, JsonResponse
from django.shortcuts import render, redirect

def serve_static_root_file(filename, content_type):
    def view(request):
        file_path = os.path.join(settings.BASE_DIR, 'static', filename)
        if not os.path.exists(file_path):
            file_path = os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', filename)
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), content_type=content_type)
        raise Http404(f"{filename} not found")
    return view

urlpatterns = [
    path('favicon.ico', serve_static_root_file('favicon.ico', 'image/x-icon')),
    path('favicon.svg', serve_static_root_file('favicon.svg', 'image/svg+xml')),
    path('favicon.png', serve_static_root_file('favicon-96x96.png', 'image/png')),
    path('favicon-16x16.png', serve_static_root_file('favicon-16x16.png', 'image/png')),
    path('favicon-32x32.png', serve_static_root_file('favicon-32x32.png', 'image/png')),
    path('favicon-48x48.png', serve_static_root_file('favicon-48x48.png', 'image/png')),
    path('favicon-96x96.png', serve_static_root_file('favicon-96x96.png', 'image/png')),
    path('apple-touch-icon.png', serve_static_root_file('apple-touch-icon.png', 'image/png')),
    path('pwa-192x192.png', serve_static_root_file('pwa-192x192.png', 'image/png')),
    path('pwa-512x512.png', serve_static_root_file('pwa-512x512.png', 'image/png')),
    path('logo.png', serve_static_root_file('logo.png', 'image/png')),
    path('robots.txt', serve_static_root_file('robots.txt', 'text/plain')),
    path('sitemap.xml', serve_static_root_file('sitemap.xml', 'application/xml')),
    path('admin', lambda req: redirect('/admin/', permanent=True)),
    path('admin/', admin.site.urls),
    
    # Primary & SPA Named URL patterns for HTML template rendering
    path('', root_health_view, name='home'),
    path('health/', root_health_view, name='root_health'),
    path('read/', root_health_view, name='read'),
    path('quran/', root_health_view, name='quran'),
    path('videos/', root_health_view, name='videos'),
    path('books/', root_health_view, name='books'),
    path('tafseer/', root_health_view, name='tafseer'),
    path('hadith/', root_health_view, name='hadith'),
    path('qaris/', root_health_view, name='qaris'),
    path('zakat/', root_health_view, name='zakat'),
    path('hajj-umrah/', root_health_view, name='hajj_umrah'),
    path('tajweed/', root_health_view, name='tajweed'),
    path('names/', root_health_view, name='names'),
    path('inheritance/', root_health_view, name='inheritance'),
    path('ramadan/', root_health_view, name='ramadan'),
    path('card-creator/', root_health_view, name='card_creator'),
    path('live/', root_health_view, name='live'),
    path('world-clock/', root_health_view, name='world_clock'),
    path('quran-words/', root_health_view, name='quran_words'),
    path('brahui/', root_health_view, name='brahui'),
    path('contact/', root_health_view, name='contact'),
    path('upload/', root_health_view, name='upload'),
    path('login/', root_health_view, name='login'),
    path('signup/', root_health_view, name='signup'),
    path('logout/', root_health_view, name='logout'),

    path('', include('core.urls')),
    re_path(r'^.*$', root_health_view, name='spa_catchall'),
]



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
