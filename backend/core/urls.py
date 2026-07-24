from django.urls import path
from . import views

urlpatterns = [
    # REST API endpoints for React Frontend
    path('api/quran/', views.api_quran_list, name='api_quran_list'),
    path('api/videos/', views.api_videos_list, name='api_videos_list'),
    path('api/books/', views.api_books_list, name='api_books_list'),
    path('api/tafseer/', views.api_tafseer_list, name='api_tafseer_list'),
    path('api/hadith/', views.api_hadith_list, name='api_hadith_list'),
    path('api/categories/', views.api_categories_list, name='api_categories_list'),
    path('api/qaris/', views.api_qaris_list, name='api_qaris_list'),
    path('api/stats/', views.api_home_stats, name='api_home_stats'),
    path('api/search/', views.api_global_search, name='api_global_search'),
    
    # Bookmarks, Reports & Contact
    path('api/bookmarks/', views.user_bookmarks_json, name='user_bookmarks_json'),
    path('api/bookmark/toggle/', views.toggle_bookmark, name='toggle_bookmark'),
    path('api/report/submit/', views.submit_report_view, name='submit_report'),
    path('api/contact/submit/', views.submit_contact_view, name='submit_contact'),

    # Authentication API
    path('api/auth/status/', views.api_auth_status, name='api_auth_status'),
    path('api/auth/login/', views.api_login, name='api_login'),
    path('api/auth/signup/', views.api_signup, name='api_signup'),
    path('api/auth/social/', views.api_social_auth, name='api_social_auth'),
    path('api/auth/logout/', views.api_logout, name='api_logout'),
    # SEO Endpoints
    path('robots.txt', views.robots_txt_view, name='robots_txt'),
    path('sitemap.xml', views.sitemap_xml_view, name='sitemap_xml'),
]
