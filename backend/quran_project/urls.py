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

from django.shortcuts import render, redirect

urlpatterns = [
    path('favicon.ico', lambda req: redirect('/static/favicon.svg', permanent=True)),
    path('favicon.png', lambda req: redirect('/static/favicon.svg', permanent=True)),
    path('favicon.svg', lambda req: redirect('/static/favicon.svg', permanent=True)),
    path('logo.png', lambda req: redirect('/static/favicon.svg', permanent=True)),
    path('apple-touch-icon.png', lambda req: redirect('/static/favicon.svg', permanent=True)),
    path('favicon-16x16.png', lambda req: redirect('/static/favicon.svg', permanent=True)),
    path('favicon-32x32.png', lambda req: redirect('/static/favicon.svg', permanent=True)),
    path('favicon-48x48.png', lambda req: redirect('/static/favicon.svg', permanent=True)),
    path('favicon-96x96.png', lambda req: redirect('/static/favicon.svg', permanent=True)),
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
