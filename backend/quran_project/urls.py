from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

from django.shortcuts import render

# Customize the admin interface
admin.site.site_header = "Islamic Zikr"
admin.site.site_title = "Admin Portal"
admin.site.index_title = "Welcome to the Islamic Dashboard"

def root_health_view(request):
    # If requested by API client or format=json, return JSON
    if 'application/json' in request.headers.get('Accept', '') or request.GET.get('format') == 'json':
        return JsonResponse({
            "status": "online",
            "service": "Quran Portal API Backend",
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
    path('admin', lambda req: redirect('/admin/', permanent=True)),
    path('admin/', admin.site.urls),
    path('', root_health_view, name='root_health'),
    path('', include('core.urls')),
    re_path(r'^.*$', root_health_view, name='spa_catchall'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
