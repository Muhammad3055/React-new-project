from django.contrib import admin
from .models import Category, QuranAudio, VideoMedia, BookMedia, Tafseer, Hadith, Bookmark, ContentReport, ContactMessage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(QuranAudio)
class QuranAudioAdmin(admin.ModelAdmin):
    list_display = ('surah_number', 'surah_name_english', 'surah_name_arabic', 'reciter', 'revelation_place', 'duration')
    list_filter = ('revelation_place', 'reciter')
    search_fields = ('surah_name_english', 'surah_name_arabic', 'reciter')


@admin.register(VideoMedia)
class VideoMediaAdmin(admin.ModelAdmin):
    list_display = ('title', 'speaker', 'category', 'created_at')
    list_filter = ('category', 'speaker')
    search_fields = ('title', 'speaker', 'description')


@admin.register(BookMedia)
class BookMediaAdmin(admin.ModelAdmin):
    list_display = ('title', 'file_type', 'author', 'category', 'pages_count', 'language', 'created_at')
    list_filter = ('file_type', 'category', 'language')
    search_fields = ('title', 'author', 'description')


@admin.register(Tafseer)
class TafseerAdmin(admin.ModelAdmin):
    list_display = ('surah_number', 'surah_name', 'ayah_number', 'scholar_name')
    list_filter = ('scholar_name', 'surah_number')
    search_fields = ('surah_name', 'translation', 'tafseer_text')


@admin.register(Hadith)
class HadithAdmin(admin.ModelAdmin):
    list_display = ('book_name', 'hadith_number', 'chapter', 'grade', 'narrated_by')
    list_filter = ('book_name', 'grade')
    search_fields = ('translation', 'arabic_text', 'narrated_by', 'chapter')


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'surah_number', 'ayah_number', 'created_at')
    list_filter = ('user', 'surah_number')
    search_fields = ('user__username', 'surah_number', 'ayah_number')


@admin.register(ContentReport)
class ContentReportAdmin(admin.ModelAdmin):
    list_display = ('content_type', 'content_id', 'reported_by', 'is_resolved', 'created_at')
    list_filter = ('is_resolved', 'content_type', 'created_at')
    search_fields = ('content_id', 'description', 'reported_by__username')
    actions = ['mark_as_resolved']

    def mark_as_resolved(self, request, queryset):
        queryset.update(is_resolved=True)
    mark_as_resolved.short_description = "Mark selected reports as resolved"


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    actions = ['mark_as_read']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected messages as read"


