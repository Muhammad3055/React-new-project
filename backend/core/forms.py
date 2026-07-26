from django import forms
from .models import QuranAudio, VideoMedia, BookMedia, Tafseer, Hadith

class QuranAudioForm(forms.ModelForm):
    class Meta:
        model = QuranAudio
        fields = ['surah_number', 'surah_name_arabic', 'surah_name_english', 'reciter', 'audio_file', 'audio_url', 'duration', 'revelation_place', 'total_ayahs']
        widgets = {
            'surah_number': forms.NumberInput(attrs={'class': 'form-input', 'placeholder': 'e.g. 1'}),
            'surah_name_arabic': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'e.g. الفاتحة'}),
            'surah_name_english': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'e.g. Al-Fatiha'}),
            'reciter': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'e.g. Mishary Rashid Alafasy'}),
            'audio_file': forms.FileInput(attrs={'class': 'form-file'}),
            'audio_url': forms.URLInput(attrs={'class': 'form-input', 'placeholder': 'https://... direct mp3 link'}),
            'duration': forms.TextInput(attrs={'class': 'form-input', 'placeholder': '02:45'}),
            'revelation_place': forms.Select(attrs={'class': 'form-select'}),
            'total_ayahs': forms.NumberInput(attrs={'class': 'form-input'}),
        }


class VideoMediaForm(forms.ModelForm):
    class Meta:
        model = VideoMedia
        fields = ['title', 'speaker', 'category', 'video_file', 'video_url', 'thumbnail', 'thumbnail_url', 'description']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Video Title'}),
            'speaker': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Speaker Name'}),
            'category': forms.Select(attrs={'class': 'form-select'}),
            'video_file': forms.FileInput(attrs={'class': 'form-file'}),
            'video_url': forms.URLInput(attrs={'class': 'form-input', 'placeholder': 'YouTube embed or video URL'}),
            'thumbnail': forms.FileInput(attrs={'class': 'form-file'}),
            'thumbnail_url': forms.URLInput(attrs={'class': 'form-input', 'placeholder': 'Cover image URL'}),
            'description': forms.Textarea(attrs={'class': 'form-textarea', 'rows': 4}),
        }


class BookMediaForm(forms.ModelForm):
    class Meta:
        model = BookMedia
        fields = ['title', 'author', 'category', 'file_type', 'pdf_file', 'pdf_url', 'cover_image', 'cover_url', 'description', 'pages_count', 'language']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Book Title'}),
            'author': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Author Name'}),
            'category': forms.Select(attrs={'class': 'form-select'}),
            'file_type': forms.Select(attrs={'class': 'form-select'}),
            'pdf_file': forms.FileInput(attrs={'class': 'form-file'}),
            'pdf_url': forms.URLInput(attrs={'class': 'form-input', 'placeholder': 'Direct document link'}),
            'cover_image': forms.FileInput(attrs={'class': 'form-file'}),
            'cover_url': forms.URLInput(attrs={'class': 'form-input', 'placeholder': 'Cover Image URL'}),
            'description': forms.Textarea(attrs={'class': 'form-textarea', 'rows': 4}),
            'pages_count': forms.NumberInput(attrs={'class': 'form-input'}),
            'language': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'e.g. English'}),
        }


class TafseerForm(forms.ModelForm):
    class Meta:
        model = Tafseer
        fields = ['surah_number', 'surah_name', 'ayah_number', 'arabic_text', 'translation', 'tafseer_text', 'scholar_name']
        widgets = {
            'surah_number': forms.NumberInput(attrs={'class': 'form-input'}),
            'surah_name': forms.TextInput(attrs={'class': 'form-input'}),
            'ayah_number': forms.NumberInput(attrs={'class': 'form-input'}),
            'arabic_text': forms.Textarea(attrs={'class': 'form-textarea arabic-font', 'rows': 3}),
            'translation': forms.Textarea(attrs={'class': 'form-textarea', 'rows': 3}),
            'tafseer_text': forms.Textarea(attrs={'class': 'form-textarea', 'rows': 5}),
            'scholar_name': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Tafseer Scholar'}),
        }


class HadithForm(forms.ModelForm):
    class Meta:
        model = Hadith
        fields = ['book_name', 'chapter', 'hadith_number', 'arabic_text', 'translation', 'narrated_by', 'grade']
        widgets = {
            'book_name': forms.Select(attrs={'class': 'form-select'}),
            'chapter': forms.TextInput(attrs={'class': 'form-input'}),
            'hadith_number': forms.NumberInput(attrs={'class': 'form-input'}),
            'arabic_text': forms.Textarea(attrs={'class': 'form-textarea arabic-font', 'rows': 3}),
            'translation': forms.Textarea(attrs={'class': 'form-textarea', 'rows': 3}),
            'narrated_by': forms.TextInput(attrs={'class': 'form-input'}),
            'grade': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Sahih'}),
        }
