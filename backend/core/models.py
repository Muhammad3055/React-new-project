from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class QuranAudio(models.Model):
    REVELATION_CHOICES = [
        ('Makki', 'Makki'),
        ('Madani', 'Madani'),
    ]

    surah_number = models.PositiveIntegerField()
    surah_name_arabic = models.CharField(max_length=100)
    surah_name_english = models.CharField(max_length=100)
    reciter = models.CharField(max_length=150, default="Mishary Rashid Alafasy")
    audio_file = models.FileField(upload_to="audio/", blank=True, null=True)
    audio_url = models.URLField(max_length=500, blank=True, help_text="Direct MP3 Audio Stream URL if no file uploaded")
    duration = models.CharField(max_length=20, default="00:00", blank=True)
    revelation_place = models.CharField(max_length=50, choices=REVELATION_CHOICES, default='Makki')
    total_ayahs = models.PositiveIntegerField(default=7)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['surah_number']
        verbose_name = "Quran Audio"
        verbose_name_plural = "Quran Audios"

    def __str__(self):
        return f"{self.surah_number}. {self.surah_name_english} ({self.surah_name_arabic}) - {self.reciter}"

    def get_playable_url(self):
        if self.audio_file:
            return self.audio_file.url
        return self.audio_url or "#"


class VideoMedia(models.Model):
    title = models.CharField(max_length=255)
    speaker = models.CharField(max_length=150, default="Islamic Scholar")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="videos")
    video_file = models.FileField(upload_to="videos/", blank=True, null=True)
    video_url = models.URLField(max_length=500, blank=True, help_text="YouTube Embed or Direct Video URL")
    thumbnail = models.ImageField(upload_to="covers/", blank=True, null=True)
    thumbnail_url = models.URLField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.speaker}"


class BookMedia(models.Model):
    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF Document'),
        ('doc', 'Word Document (.docx)'),
        ('ppt', 'PPT Presentation (.pptx)'),
        ('book', 'Printed / E-Book'),
    ]

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=150, default="Unknown Author")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="books")
    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES, default='pdf')
    pdf_file = models.FileField(upload_to="books/", blank=True, null=True)
    pdf_url = models.URLField(max_length=500, blank=True, help_text="Direct Document URL")
    cover_image = models.ImageField(upload_to="covers/", blank=True, null=True)
    cover_url = models.URLField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    pages_count = models.PositiveIntegerField(default=1, blank=True)
    language = models.CharField(max_length=50, default="Arabic / English")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        # Universal Auto-Analyzer for PDF, Word (.docx), and PPT (.pptx) files
        if self.pdf_file and (not self.pages_count or self.pages_count == 1):
            filename = self.pdf_file.name.lower()
            try:
                self.pdf_file.seek(0)
                file_bytes = self.pdf_file.read()
                self.pdf_file.seek(0)

                if filename.endswith('.pdf'):
                    # PDF Page Counter
                    import re
                    pages = len(re.findall(b"/Type\s*/Page[^s]", file_bytes))
                    if pages > 0:
                        self.pages_count = pages
                        self.file_type = 'book' if pages >= 100 else 'pdf'

                elif filename.endswith('.docx') or filename.endswith('.doc'):
                    # Word Document Page Counter
                    import zipfile, xml.etree.ElementTree as ET
                    try:
                        with zipfile.ZipFile(self.pdf_file, 'r') as z:
                            if 'docProps/app.xml' in z.namelist():
                                app_xml = z.read('docProps/app.xml')
                                root = ET.fromstring(app_xml)
                                for child in root:
                                    if 'Pages' in child.tag and child.text and child.text.isdigit():
                                        self.pages_count = int(child.text)
                                        break
                    except Exception:
                        pass
                    self.pdf_file.seek(0)
                    self.file_type = 'doc'

                elif filename.endswith('.pptx') or filename.endswith('.ppt'):
                    # PPT Presentation Slide Counter
                    import zipfile
                    try:
                        with zipfile.ZipFile(self.pdf_file, 'r') as z:
                            slides = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
                            if slides:
                                self.pages_count = len(slides)
                    except Exception:
                        pass
                    self.pdf_file.seek(0)
                    self.file_type = 'ppt'
            except Exception:
                pass

        # Automatic Classification Rule:
        # If document format is pdf or book: 100+ pages => 'book', <100 pages => 'pdf'
        if self.file_type in ['pdf', 'book']:
            if self.pages_count >= 100:
                self.file_type = 'book'
            else:
                self.file_type = 'pdf'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.get_file_type_display()}) by {self.author}"

    def get_document_url(self):
        if self.pdf_file:
            return self.pdf_file.url
        return self.pdf_url or "#"


class Tafseer(models.Model):
    surah_number = models.PositiveIntegerField()
    surah_name = models.CharField(max_length=100)
    ayah_number = models.PositiveIntegerField()
    arabic_text = models.TextField()
    translation = models.TextField()
    tafseer_text = models.TextField()
    scholar_name = models.CharField(max_length=150, default="Tafseer Ibn Kathir")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['surah_number', 'ayah_number']
        verbose_name_plural = "Tafseers"

    def __str__(self):
        return f"Surah {self.surah_name} ({self.surah_number}:{self.ayah_number}) - {self.scholar_name}"


class Hadith(models.Model):
    BOOK_CHOICES = [
        ('Sahih Bukhari', 'Sahih Al-Bukhari'),
        ('Sahih Muslim', 'Sahih Muslim'),
        ('Sunan An-Nasa\'i', 'Sunan An-Nasa\'i'),
        ('Sunan Abu Dawud', 'Sunan Abu Dawud'),
        ('Jami` At-Tirmidhi', 'Jami` At-Tirmidhi'),
        ('Sunan Ibn Majah', 'Sunan Ibn Majah'),
        ('Riyad As-Salihin', 'Riyad As-Salihin'),
    ]

    book_name = models.CharField(max_length=100, choices=BOOK_CHOICES, default='Sahih Bukhari')
    chapter = models.CharField(max_length=255, blank=True)
    hadith_number = models.PositiveIntegerField()
    arabic_text = models.TextField()
    translation = models.TextField()
    narrated_by = models.CharField(max_length=150, blank=True)
    grade = models.CharField(max_length=50, default="Sahih")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['book_name', 'hadith_number']
        verbose_name_plural = "Hadiths"

    def __str__(self):
        return f"{self.book_name} #{self.hadith_number} ({self.grade})"


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    surah_number = models.PositiveIntegerField()
    ayah_number = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'surah_number', 'ayah_number')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - Surah {self.surah_number}:{self.ayah_number}"


class ContentReport(models.Model):
    REPORT_TYPES = [
        ('ayah', 'Ayah / Quran Text'),
        ('tafseer', 'Tafseer Commentary'),
        ('hadith', 'Hadith Translation'),
        ('other', 'Other Content'),
    ]

    content_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    content_id = models.CharField(max_length=255)
    description = models.TextField()
    reported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reports')
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.get_content_type_display()}] {self.content_id} - {'Resolved' if self.is_resolved else 'Pending'}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"From {self.name} ({self.email}) - {self.subject}"


