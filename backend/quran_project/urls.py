from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

# Customize the admin interface
admin.site.site_header = "Islamic Zikr"
admin.site.site_title = "Admin Portal"
admin.site.index_title = "Welcome to the Islamic Dashboard"

def root_health_view(request):
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

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', root_health_view, name='root_health'),
    path('', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])

