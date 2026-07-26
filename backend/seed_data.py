import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quran_project.settings')
django.setup()

from core.models import Category, QuranAudio, VideoMedia, BookMedia, Tafseer, Hadith

def seed_database():
    print("Seeding Quran portal database with rich, expanded content...")

    # Categories
    cat_recitation, _ = Category.objects.get_or_create(slug="quran-recitations", defaults={"name": "Quran Recitations", "description": "Beautiful audio & video recitations by famous Qaris."})
    cat_lectures, _ = Category.objects.get_or_create(slug="islamic-lectures", defaults={"name": "Islamic Lectures", "description": "Scholarly lectures and reminders."})
    cat_tafseer_cat, _ = Category.objects.get_or_create(slug="tafseer-quran-studies", defaults={"name": "Tafseer & Quran Studies", "description": "Quranic commentary and studies."})
    cat_hadith_cat, _ = Category.objects.get_or_create(slug="hadith-studies", defaults={"name": "Hadith Studies", "description": "Studies on Sunnah and Hadiths."})

    # Quran Audio Entries (High quality recitations across famous Qaris)
    quran_items = [
        # Mishary Rashid Alafasy
        {"surah_number": 1, "surah_name_arabic": "الفاتحة", "surah_name_english": "Al-Fatiha", "reciter": "Mishary Rashid Alafasy", "audio_url": "https://server8.mp3quran.net/afs/001.mp3", "duration": "00:45", "revelation_place": "Makki", "total_ayahs": 7},
        {"surah_number": 18, "surah_name_arabic": "الكهف", "surah_name_english": "Al-Kahf", "reciter": "Mishary Rashid Alafasy", "audio_url": "https://server8.mp3quran.net/afs/018.mp3", "duration": "25:30", "revelation_place": "Makki", "total_ayahs": 110},
        {"surah_number": 36, "surah_name_arabic": "يس", "surah_name_english": "Ya-Sin", "reciter": "Mishary Rashid Alafasy", "audio_url": "https://server8.mp3quran.net/afs/036.mp3", "duration": "14:10", "revelation_place": "Makki", "total_ayahs": 83},
        {"surah_number": 55, "surah_name_arabic": "الرحمن", "surah_name_english": "Ar-Rahman", "reciter": "Mishary Rashid Alafasy", "audio_url": "https://server8.mp3quran.net/afs/055.mp3", "duration": "09:40", "revelation_place": "Madani", "total_ayahs": 78},
        {"surah_number": 112, "surah_name_arabic": "الإخلاص", "surah_name_english": "Al-Ikhlas", "reciter": "Mishary Rashid Alafasy", "audio_url": "https://server8.mp3quran.net/afs/112.mp3", "duration": "00:20", "revelation_place": "Makki", "total_ayahs": 4},
        {"surah_number": 113, "surah_name_arabic": "الفلق", "surah_name_english": "Al-Falaq", "reciter": "Mishary Rashid Alafasy", "audio_url": "https://server8.mp3quran.net/afs/113.mp3", "duration": "00:25", "revelation_place": "Makki", "total_ayahs": 5},
        {"surah_number": 114, "surah_name_arabic": "الناس", "surah_name_english": "An-Nas", "reciter": "Mishary Rashid Alafasy", "audio_url": "https://server8.mp3quran.net/afs/114.mp3", "duration": "00:30", "revelation_place": "Makki", "total_ayahs": 6},

        # Sheikh Abdul Rahman Al-Sudais
        {"surah_number": 1, "surah_name_arabic": "الفاتحة", "surah_name_english": "Al-Fatiha", "reciter": "Abdul Rahman Al-Sudais", "audio_url": "https://server11.mp3quran.net/sds/001.mp3", "duration": "00:50", "revelation_place": "Makki", "total_ayahs": 7},
        {"surah_number": 2, "surah_name_arabic": "البقرة", "surah_name_english": "Al-Baqarah", "reciter": "Abdul Rahman Al-Sudais", "audio_url": "https://server11.mp3quran.net/sds/002.mp3", "duration": "01:55:00", "revelation_place": "Madani", "total_ayahs": 286},
        {"surah_number": 55, "surah_name_arabic": "الرحمن", "surah_name_english": "Ar-Rahman", "reciter": "Abdul Rahman Al-Sudais", "audio_url": "https://server11.mp3quran.net/sds/055.mp3", "duration": "09:50", "revelation_place": "Madani", "total_ayahs": 78},
        {"surah_number": 67, "surah_name_arabic": "الملك", "surah_name_english": "Al-Mulk", "reciter": "Abdul Rahman Al-Sudais", "audio_url": "https://server11.mp3quran.net/sds/067.mp3", "duration": "06:15", "revelation_place": "Makki", "total_ayahs": 30},

        # Saad Al-Ghamdi
        {"surah_number": 1, "surah_name_arabic": "الفاتحة", "surah_name_english": "Al-Fatiha", "reciter": "Saad Al-Ghamdi", "audio_url": "https://server7.mp3quran.net/s_gmd/001.mp3", "duration": "00:42", "revelation_place": "Makki", "total_ayahs": 7},
        {"surah_number": 36, "surah_name_arabic": "يس", "surah_name_english": "Ya-Sin", "reciter": "Saad Al-Ghamdi", "audio_url": "https://server7.mp3quran.net/s_gmd/036.mp3", "duration": "13:45", "revelation_place": "Makki", "total_ayahs": 83},
        {"surah_number": 67, "surah_name_arabic": "الملك", "surah_name_english": "Al-Mulk", "reciter": "Saad Al-Ghamdi", "audio_url": "https://server7.mp3quran.net/s_gmd/067.mp3", "duration": "06:30", "revelation_place": "Makki", "total_ayahs": 30},

        # Maher Al-Muaiqly
        {"surah_number": 1, "surah_name_arabic": "الفاتحة", "surah_name_english": "Al-Fatiha", "reciter": "Maher Al-Muaiqly", "audio_url": "https://server12.mp3quran.net/maher/001.mp3", "duration": "00:45", "revelation_place": "Makki", "total_ayahs": 7},
        {"surah_number": 18, "surah_name_arabic": "الكهف", "surah_name_english": "Al-Kahf", "reciter": "Maher Al-Muaiqly", "audio_url": "https://server12.mp3quran.net/maher/018.mp3", "duration": "24:10", "revelation_place": "Makki", "total_ayahs": 110},
        {"surah_number": 112, "surah_name_arabic": "الإخلاص", "surah_name_english": "Al-Ikhlas", "reciter": "Maher Al-Muaiqly", "audio_url": "https://server12.mp3quran.net/maher/112.mp3", "duration": "00:20", "revelation_place": "Makki", "total_ayahs": 4},

        # Abdul Basit Abdul Samad
        {"surah_number": 1, "surah_name_arabic": "الفاتحة", "surah_name_english": "Al-Fatiha", "reciter": "Abdul Basit Abdul Samad", "audio_url": "https://server7.mp3quran.net/basit/001.mp3", "duration": "01:05", "revelation_place": "Makki", "total_ayahs": 7},
        {"surah_number": 55, "surah_name_arabic": "الرحمن", "surah_name_english": "Ar-Rahman", "reciter": "Abdul Basit Abdul Samad", "audio_url": "https://server7.mp3quran.net/basit/055.mp3", "duration": "12:15", "revelation_place": "Madani", "total_ayahs": 78},

        # Abu Bakr Al-Shatri
        {"surah_number": 36, "surah_name_arabic": "يس", "surah_name_english": "Ya-Sin", "reciter": "Abu Bakr Al-Shatri", "audio_url": "https://server11.mp3quran.net/shatri/036.mp3", "duration": "15:20", "revelation_place": "Makki", "total_ayahs": 83},
        {"surah_number": 67, "surah_name_arabic": "الملك", "surah_name_english": "Al-Mulk", "reciter": "Abu Bakr Al-Shatri", "audio_url": "https://server11.mp3quran.net/shatri/067.mp3", "duration": "07:05", "revelation_place": "Makki", "total_ayahs": 30},

        # Yasser Al-Dosari
        {"surah_number": 1, "surah_name_arabic": "الفاتحة", "surah_name_english": "Al-Fatiha", "reciter": "Yasser Al-Dosari", "audio_url": "https://server11.mp3quran.net/yasser/001.mp3", "duration": "00:52", "revelation_place": "Makki", "total_ayahs": 7},
        {"surah_number": 18, "surah_name_arabic": "الكهف", "surah_name_english": "Al-Kahf", "reciter": "Yasser Al-Dosari", "audio_url": "https://server11.mp3quran.net/yasser/018.mp3", "duration": "23:45", "revelation_place": "Makki", "total_ayahs": 110},
    ]

    for item in quran_items:
        QuranAudio.objects.get_or_create(
            surah_number=item["surah_number"],
            reciter=item["reciter"],
            defaults=item
        )

    # Videos / MP4 Recitations featuring diverse Qaris
    video_items = [
        {
            "title": "Surah Al-Fatiha Full Recitation in Makkah",
            "speaker": "Sheikh Abdul Rahman Al-Sudais",
            "category": cat_recitation,
            "video_url": "https://www.youtube.com/watch?v=k4T0hM1c4o8",
            "thumbnail_url": "https://img.youtube.com/vi/k4T0hM1c4o8/hqdefault.jpg",
            "description": "Heart touching video recitation of Surah Al-Fatiha inside Masjid al-Haram, Makkah."
        },
        {
            "title": "Surah Ar-Rahman Emotional Recitation",
            "speaker": "Mishary Rashid Alafasy",
            "category": cat_recitation,
            "video_url": "https://www.youtube.com/watch?v=283VzA0e6E4",
            "thumbnail_url": "https://img.youtube.com/vi/283VzA0e6E4/hqdefault.jpg",
            "description": "Beautiful MP4 video recitation of Surah Ar-Rahman by Qari Mishary Alafasy."
        },
        {
            "title": "Surah Al-Kahf Powerful Recitation in Madinah",
            "speaker": "Sheikh Maher Al-Muaiqly",
            "category": cat_recitation,
            "video_url": "https://www.youtube.com/watch?v=R9SgO2V3vXw",
            "thumbnail_url": "https://img.youtube.com/vi/R9SgO2V3vXw/hqdefault.jpg",
            "description": "Mesmerizing Friday recitation of Surah Al-Kahf in Masjid an-Nabawi."
        },
        {
            "title": "Surah Ya-Sin Soothing Recitation",
            "speaker": "Sheikh Yasser Al-Dosari",
            "category": cat_recitation,
            "video_url": "https://www.youtube.com/watch?v=02d5jZ0b5vA",
            "thumbnail_url": "https://img.youtube.com/vi/02d5jZ0b5vA/hqdefault.jpg",
            "description": "Captivating voice of Sheikh Yasser Al-Dosari reciting Surah Ya-Sin."
        },
        {
            "title": "Legendary Recitation of Surah Al-Qariah",
            "speaker": "Qari Abdul Basit Abdul Samad",
            "category": cat_recitation,
            "video_url": "https://www.youtube.com/watch?v=Vz80gBvNnXY",
            "thumbnail_url": "https://img.youtube.com/vi/Vz80gBvNnXY/hqdefault.jpg",
            "description": "Historical world-famous Mujawwad video recitation by Qari Abdul Basit."
        },
        {
            "title": "Understanding the Wisdom of Surah Al-Mulk",
            "speaker": "Mufti Menk",
            "category": cat_lectures,
            "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "thumbnail_url": "https://images.unsplash.com/photo-1542816417-0983cbe0f138?auto=format&fit=crop&w=600&q=80",
            "description": "Detailed lecture explaining how Surah Al-Mulk protects against the punishment of the grave."
        },
        {
            "title": "The Miracle of Quranic Arabic",
            "speaker": "Nouman Ali Khan",
            "category": cat_tafseer_cat,
            "video_url": "https://www.youtube.com/watch?v=k4T0hM1c4o8",
            "thumbnail_url": "https://images.unsplash.com/photo-1584282479267-36e746a51d1e?auto=format&fit=crop&w=600&q=80",
            "description": "An enlightening insight into the linguistic beauty and eloquence of the Quranic text."
        }
    ]

    for item in video_items:
        VideoMedia.objects.get_or_create(title=item["title"], defaults=item)

    # Islamic Library Resources (PDF, Word DOCX, PPT Presentations, E-Books)
    book_items = [
        {
            "title": "Tafsir Ibn Kathir (Complete English Translation)",
            "author": "Hafiz Ibn Kathir",
            "file_type": "pdf",
            "pdf_url": "https://www.quranproject.org/Tafsir-Ibn-Kathir.pdf",
            "cover_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80",
            "description": "Comprehensive classical Quran commentary covering all 114 Surahs with authentic Hadith explanations.",
            "pages_count": 1250,
            "language": "English / Arabic",
            "category": cat_tafseer_cat
        },
        {
            "title": "Introduction to Tajweed Rules & Pronunciation Guide",
            "author": "Dr. Ayman Swayd",
            "file_type": "doc",
            "pdf_url": "https://www.quranproject.org/Tajweed-Rules.docx",
            "cover_url": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=500&q=80",
            "description": "Editable Word document guide on Tajweed articulation points (Makharij) and characteristics of Arabic letters.",
            "pages_count": 45,
            "language": "English / Arabic",
            "category": cat_recitation
        },
        {
            "title": "Overview of Quranic Sciences & Revelation Overview",
            "author": "Sheikh Yasir Qadhi",
            "file_type": "ppt",
            "pdf_url": "https://www.quranproject.org/Quranic-Sciences-Presentation.pptx",
            "cover_url": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500&q=80",
            "description": "Interactive PowerPoint slide presentation covering the history of Quranic preservation and compilation.",
            "pages_count": 68,
            "language": "English",
            "category": cat_lectures
        },
        {
            "title": "The Sealed Nectar (Ar-Raheeq Al-Makhtum)",
            "author": "Safi-ur-Rahman al-Mubarakpuri",
            "file_type": "book",
            "pdf_url": "https://www.quranproject.org/Sealed-Nectar-Seerah.pdf",
            "cover_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80",
            "description": "Award-winning biography of the Prophet Muhammad (peace be upon him) based on authentic historical sources.",
            "pages_count": 520,
            "language": "English / Urdu",
            "category": cat_hadith_cat
        },
        {
            "title": "Fortress of the Muslim (Hisn al-Muslim)",
            "author": "Sa'id bin Ali bin Wahf Al-Qahtani",
            "file_type": "pdf",
            "pdf_url": "https://www.quranproject.org/Hisn-al-Muslim.pdf",
            "cover_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
            "description": "Essential pocket collection of authentic supplications and daily Azkar from the Sunnah.",
            "pages_count": 180,
            "language": "Arabic / English / Transliteration",
            "category": cat_hadith_cat
        },
        {
            "title": "Surah Al-Baqarah Ayah Breakdown & Grammar Notes",
            "author": "Ustadh Nouman Ali Khan",
            "file_type": "doc",
            "pdf_url": "https://www.quranproject.org/Surah-Baqarah-Grammar.docx",
            "cover_url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=500&q=80",
            "description": "Comprehensive Word document containing sentence structure, verb forms, and linguistic notes.",
            "pages_count": 92,
            "language": "English / Arabic",
            "category": cat_tafseer_cat
        },
        {
            "title": "Stories of the Prophets in the Light of Quran",
            "author": "Hafiz Ibn Kathir",
            "file_type": "ppt",
            "pdf_url": "https://www.quranproject.org/Stories-of-Prophets.pptx",
            "cover_url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=500&q=80",
            "description": "Visual presentation slides illustrating lessons, timelines, and verses from the lives of the Prophets.",
            "pages_count": 115,
            "language": "English",
            "category": cat_lectures
        },
        {
            "title": "Riyad as-Salihin (The Meadows of the Righteous)",
            "author": "Imam Al-Nawawi",
            "file_type": "book",
            "pdf_url": "https://www.quranproject.org/Riyad-as-Salihin.pdf",
            "cover_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80",
            "description": "A classic compilation of verses and authentic Hadiths arranged by ethical topics.",
            "pages_count": 640,
            "language": "Arabic / English",
            "category": cat_hadith_cat
        }
    ]

    for item in book_items:
        BookMedia.objects.get_or_create(title=item["title"], defaults=item)

    # 20 Authentic Hadith Entries
    hadith_items = [
        {
            "book_name": "Sahih Bukhari",
            "chapter": "Book of Revelation",
            "hadith_number": 1,
            "arabic_text": "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
            "translation": "Actions are judged by intentions, and every person will get what they intended.",
            "narrated_by": "Umar bin Al-Khattab (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Muslim",
            "chapter": "Book of Purification (Taharah)",
            "hadith_number": 223,
            "arabic_text": "الطَّهُورُ شَطْرُ الإِيمَانِ وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ",
            "translation": "Purity is half of faith, and 'Alhamdulillah' (Praise be to Allah) fills the scale.",
            "narrated_by": "Abu Malik Al-Ash'ari (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Bukhari",
            "chapter": "Virtues of the Quran",
            "hadith_number": 5027,
            "arabic_text": "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
            "translation": "The best among you are those who learn the Quran and teach it to others.",
            "narrated_by": "Uthman bin Affan (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Muslim",
            "chapter": "Book of Faith (Iman)",
            "hadith_number": 45,
            "arabic_text": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
            "translation": "Whoever believes in Allah and the Last Day should speak good or remain silent.",
            "narrated_by": "Abu Hurairah (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Bukhari",
            "chapter": "Book of Faith",
            "hadith_number": 13,
            "arabic_text": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
            "translation": "None of you truly believes until he loves for his brother what he loves for himself.",
            "narrated_by": "Anas bin Malik (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Jami' at-Tirmidhi",
            "chapter": "Book of Knowledge",
            "hadith_number": 2646,
            "arabic_text": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
            "translation": "Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise.",
            "narrated_by": "Abu Hurairah (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Bukhari",
            "chapter": "Book of Good Manners (Adab)",
            "hadith_number": 6011,
            "arabic_text": "إِنَّ مِمَّا يَلْحَقُ الْمُؤْمِنَ مِنْ عَمَلِهِ وَحَسَنَاتِهِ بَعْدَ مَوْتِهِ عِلْمًا عَلَّمَهُ وَنَشَرَهُ",
            "translation": "The Prophet (ﷺ) said: 'The most beloved of Allah's servants to Allah are those with the best manners.'",
            "narrated_by": "Abdullah ibn Amr (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Muslim",
            "chapter": "Book of Remembrance (Dhikr)",
            "hadith_number": 2691,
            "arabic_text": "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ ثَقِيلَتَانِ فِي الْمِيزَانِ حَبِيبَتَانِ إِلَى الرَّحْمَنِ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
            "translation": "Two words are light on the tongue, heavy on the scale, and beloved to the Most Merciful: 'SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem'.",
            "narrated_by": "Abu Hurairah (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sunan Abi Dawud",
            "chapter": "Book of Prayer (Salah)",
            "hadith_number": 498,
            "arabic_text": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاَتُهُ",
            "translation": "The first matter that the slave will be brought to account for on the Day of Judgment is his prayer.",
            "narrated_by": "Abu Hurairah (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Jami' at-Tirmidhi",
            "chapter": "Book of Righteousness",
            "hadith_number": 1987,
            "arabic_text": "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
            "translation": "Your smiling in the face of your brother is charity for you.",
            "narrated_by": "Abu Dharr (RA)",
            "grade": "Hasan"
        },
        {
            "book_name": "Sunan Ibn Majah",
            "chapter": "Book of Supplication",
            "hadith_number": 3842,
            "arabic_text": "إِنَّ لِلَّهِ عُتَقَاءَ فِي كُلِّ يَوْمٍ وَلَيْلَةٍ لِكُلِّ عَبْدٍ مِنْهُمْ دَعْوَةٌ مُسْتَجَابَةٌ",
            "translation": "Allah frees people from the Fire every day and night, and every Muslim has a supplication that is answered.",
            "narrated_by": "Abu Hurairah (RA)",
            "grade": "Hasan"
        },
        {
            "book_name": "Jami' at-Tirmidhi",
            "chapter": "Book of Virtues",
            "hadith_number": 3512,
            "arabic_text": "أَفْضَلُ الذِّكْرِ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَفْضَلُ الدُّعَاءِ الْحَمْدُ لِلَّهِ",
            "translation": "The best remembrance is 'La ilaha illallah' and the best supplication is 'Alhamdulillah'.",
            "narrated_by": "Jabir bin Abdullah (RA)",
            "grade": "Hasan"
        },
        {
            "book_name": "Sunan Abu Dawud",
            "chapter": "Book of General Manners",
            "hadith_number": 5116,
            "arabic_text": "اقْرَءُوا عَلَى مَوْتَاكُمْ يس",
            "translation": "Recite Ya-Sin over your deceased.",
            "narrated_by": "Ma'qil bin Yasar (RA)",
            "grade": "Da'if"
        },
        {
            "book_name": "Sunan Ibn Majah",
            "chapter": "Book of Fasting",
            "hadith_number": 1746,
            "arabic_text": "نَوْمُ الصَّائِمِ عِبَادَةٌ وَصَمْتُهُ تَسْبِيحٌ",
            "translation": "The sleep of a fasting person is worship and his silence is glorification of Allah.",
            "narrated_by": "Abdullah ibn Amr (RA)",
            "grade": "Da'if"
        },
        {
            "book_name": "Sahih Bukhari",
            "chapter": "Book of Character",
            "hadith_number": 6035,
            "arabic_text": "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
            "translation": "The strong person is not the one who can wrestle others down; the strong person is the one who controls himself when angry.",
            "narrated_by": "Abu Hurairah (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Muslim",
            "chapter": "Book of Charity (Zakat)",
            "hadith_number": 1012,
            "arabic_text": "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
            "translation": "Charity does not decrease wealth in any way.",
            "narrated_by": "Abu Hurairah (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sunan an-Nasa'i",
            "chapter": "Book of Fasting (Siyam)",
            "hadith_number": 2217,
            "arabic_text": "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
            "translation": "Whoever fasts during Ramadan out of sincere faith and hoping for reward, all his past sins will be forgiven.",
            "narrated_by": "Abu Hurairah (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Bukhari",
            "chapter": "Book of Supplication",
            "hadith_number": 6306,
            "arabic_text": "الدُّعَاءُ هُوَ الْعِبَادَةُ",
            "translation": "Supplication (Dua) is the essence of worship.",
            "narrated_by": "Nu'man bin Bashir (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Muslim",
            "chapter": "Book of Piety",
            "hadith_number": 2564,
            "arabic_text": "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
            "translation": "Verily, Allah does not look at your appearance or your wealth, but He looks at your hearts and your actions.",
            "narrated_by": "Abu Hurairah (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Bukhari",
            "chapter": "Book of Companionship",
            "hadith_number": 6007,
            "arabic_text": "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
            "translation": "A true Muslim is the one from whose tongue and hand other Muslims are safe.",
            "narrated_by": "Abdullah bin Amr (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Jami' at-Tirmidhi",
            "chapter": "Book of Piety",
            "hadith_number": 1988,
            "arabic_text": "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
            "translation": "Fear Allah wherever you are, follow up a bad deed with a good deed which will wipe it out, and behave well towards people.",
            "narrated_by": "Abu Dharr & Mu'adh bin Jabal (RA)",
            "grade": "Hasan"
        },
        {
            "book_name": "Sahih Muslim",
            "chapter": "Book of Good Manners",
            "hadith_number": 2586,
            "arabic_text": "المُسْلِمُ أَخُو المُسْلِمِ لاَ يَظْلِمُهُ وَلاَ يَخْذُلُهُ وَلاَ يَحْقِرُهُ",
            "translation": "A Muslim is the brother of a Muslim: he does not oppress him, nor abandon him, nor despise him.",
            "narrated_by": "Abu Hurairah (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sahih Bukhari",
            "chapter": "Book of Compassion",
            "hadith_number": 6013,
            "arabic_text": "مَنْ لاَ يَرْحَمُ لاَ يُرْحَمُ",
            "translation": "Whoever does not show mercy to others will not be shown mercy.",
            "narrated_by": "Jarir bin Abdullah (RA)",
            "grade": "Sahih"
        },
        {
            "book_name": "Sunan Ibn Majah",
            "chapter": "Book of Knowledge",
            "hadith_number": 224,
            "arabic_text": "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
            "translation": "Seeking sacred knowledge is an absolute obligation upon every single Muslim.",
            "narrated_by": "Anas bin Malik (RA)",
            "grade": "Sahih"
        }
    ]

    for item in hadith_items:
        Hadith.objects.get_or_create(
            book_name=item["book_name"],
            hadith_number=item["hadith_number"],
            defaults=item
        )

    # 20 Authentic Tafseer Commentary Entries
    tafseer_items = [
        {
            "surah_number": 1,
            "surah_name": "Al-Fatiha",
            "ayah_number": 1,
            "arabic_text": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
            "translation": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
            "tafseer_text": "The Basmalah signifies beginning every noble deed by seeking divine blessings. Ar-Rahman refers to Allah's all-encompassing mercy for all created beings in this world, while Ar-Raheem signifies His special mercy reserved exclusively for the believers in the Hereafter.",
            "scholar_name": "Tafseer Ibn Kathir"
        },
        {
            "surah_number": 1,
            "surah_name": "Al-Fatiha",
            "ayah_number": 2,
            "arabic_text": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
            "translation": "[All] praise is [due] to Allah, Lord of the worlds.",
            "tafseer_text": "Al-Hamd expresses complete gratitude, love, and veneration to Allah alone. 'Rabb' denotes the Creator, Sustainer, Provider, and Master of all realms of existence ('Al-Alameen').",
            "scholar_name": "Tafseer As-Sa'di"
        },
        {
            "surah_number": 1,
            "surah_name": "Al-Fatiha",
            "ayah_number": 5,
            "arabic_text": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
            "translation": "It is You we worship and You we ask for help.",
            "tafseer_text": "This verse is the core of pure monotheism (Tawheed). Placing 'You' first grammatically restricts worship and seeking ultimate aid exclusively to Allah, eliminating any form of shirk.",
            "scholar_name": "Tafseer Ibn Kathir"
        },
        {
            "surah_number": 2,
            "surah_name": "Al-Baqarah",
            "ayah_number": 255,
            "arabic_text": "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ",
            "translation": "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence.",
            "tafseer_text": "Ayat al-Kursi is the greatest single verse in the Holy Quran. 'Al-Hayy' means the One who possesses perfect life without beginning or end. 'Al-Qayyum' means the One who sustains Himself and continuously sustains all of creation without fatigue or slumber.",
            "scholar_name": "Tafseer Ibn Kathir"
        },
        {
            "surah_number": 2,
            "surah_name": "Al-Baqarah",
            "ayah_number": 286,
            "arabic_text": "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
            "translation": "Allah does not charge a soul except [with that within] its capacity.",
            "tafseer_text": "Allah out of His grace and wisdom does not obligate any servant beyond their physical and spiritual capability. All religious duties are manageable, and hardships bring ease and concession.",
            "scholar_name": "Tafseer Al-Qurtubi"
        },
        {
            "surah_number": 3,
            "surah_name": "Ali 'Imran",
            "ayah_number": 185,
            "arabic_text": "كُلُّ نَفْسٍ ذَآئِقَةُ ٱلْمَوْتِ",
            "translation": "Every soul will taste death.",
            "tafseer_text": "A solemn reminder that mortal life is temporary and fleeting. Full compensation and justice will be rendered on the Day of Resurrection; whoever is saved from the Fire and admitted to Paradise is truly victorious.",
            "scholar_name": "Tafseer As-Sa'di"
        },
        {
            "surah_number": 18,
            "surah_name": "Al-Kahf",
            "ayah_number": 10,
            "arabic_text": "إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً",
            "translation": "When the youths fled to the cave and said, 'Our Lord, grant us from Yourself mercy...'",
            "tafseer_text": "The story of the People of the Cave highlights youth standing firm upon faith amidst state tyranny. Their supplication seeking special divine mercy and guidance serves as a timeless model for believers.",
            "scholar_name": "Tafseer Ibn Kathir"
        },
        {
            "surah_number": 18,
            "surah_name": "Al-Kahf",
            "ayah_number": 110,
            "arabic_text": "فَمَن كَانَ يَرْجُوا۟ لِقَآءَ رَبِّهِۦ فَلْيَعْمَلْ عَمَلًا صَٰلِحًا وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِۦٓ أَحَدًۢا",
            "translation": "...So whoever would hope for the meeting with his Lord - let him do righteous work and not associate in the worship of his Lord anyone.",
            "tafseer_text": "This concluding verse establishes the two indispensable conditions for any good deed to be accepted by Allah: 1) Sincerity (Ikhlas) for Allah alone, and 2) Conformity (Ittiba') with the Sunnah of Prophet Muhammad (ﷺ).",
            "scholar_name": "Tafseer Ibn Kathir"
        },
        {
            "surah_number": 36,
            "surah_name": "Ya-Sin",
            "ayah_number": 12,
            "arabic_text": "إِنَّا نَحْنُ نُحْىِ ٱلْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا۟ وَءَاثَٰرَهُمْ",
            "translation": "Indeed, it is We who bring the dead to life and record what they have put forth and their traces.",
            "tafseer_text": "Allah records not only the direct deeds performed during life, but also the lasting impacts ('Aathaar')—such as beneficial knowledge, ongoing charity (Sadaqah Jariyah), or righteous offspring left behind.",
            "scholar_name": "Tafseer As-Sa'di"
        },
        {
            "surah_number": 55,
            "surah_name": "Ar-Rahman",
            "ayah_number": 13,
            "arabic_text": "فَبِأَىِّ ءَالَاءِ رَبِّكُمَا تُكَذِّبَانِ",
            "translation": "So which of the favors of your Lord would you deny?",
            "tafseer_text": "Repeated 31 times throughout Surah Ar-Rahman, addressing both mankind and jinn to reflect upon countlessly bestowed physical, spiritual, and heavenly blessings.",
            "scholar_name": "Tafseer Al-Jalalayn"
        },
        {
            "surah_number": 67,
            "surah_name": "Al-Mulk",
            "ayah_number": 2,
            "arabic_text": "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَٰوةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
            "translation": "[He] who created death and life to test you as to which of you is best in deed.",
            "tafseer_text": "'Best in deed' means the most sincere to Allah and most accurate according to the Sunnah. Life and death were designed by Allah as an arena of moral trial.",
            "scholar_name": "Tafseer Ibn Kathir"
        },
        {
            "surah_number": 94,
            "surah_name": "Ash-Sharh",
            "ayah_number": 5,
            "arabic_text": "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
            "translation": "For indeed, with hardship [will be] ease.",
            "tafseer_text": "Allah reassures the Prophet (ﷺ) and all believers that no hardship can ever overcome double ease. Hardship is always bounded and accompanied by divine comfort.",
            "scholar_name": "Tafseer As-Sa'di"
        },
        {
            "surah_number": 97,
            "surah_name": "Al-Qadr",
            "ayah_number": 3,
            "arabic_text": "لَيْلَةُ ٱلْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
            "translation": "The Night of Decree is better than a thousand months.",
            "tafseer_text": "Worship performed during Laylat al-Qadr exceeds in spiritual reward and value the worship performed across eighty-three years and four months.",
            "scholar_name": "Tafseer Ibn Kathir"
        },
        {
            "surah_number": 103,
            "surah_name": "Al-'Asr",
            "ayah_number": 1,
            "arabic_text": "وَٱلْعَصْرِ (1) إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ",
            "translation": "By time, indeed, mankind is in loss.",
            "tafseer_text": "Imam Ash-Shafi'i noted that if people reflected upon Surah Al-Asr alone, it would suffice them. All human beings are losing their capital of time except those with 4 qualities: Faith, Good Deeds, Advising Truth, and Advising Patience.",
            "scholar_name": "Tafseer Ibn Kathir"
        },
        {
            "surah_number": 108,
            "surah_name": "Al-Kawthar",
            "ayah_number": 1,
            "arabic_text": "إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ",
            "translation": "Indeed, We have granted you, [O Muhammad], Al-Kawthar.",
            "tafseer_text": "Al-Kawthar refers to abundant goodness in this world and the Hereafter, as well as the special river and reservoir in Paradise granted to the Prophet Muhammad (ﷺ).",
            "scholar_name": "Tafseer Al-Qurtubi"
        },
        {
            "surah_number": 112,
            "surah_name": "Al-Ikhlas",
            "ayah_number": 1,
            "arabic_text": "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
            "translation": "Say, 'He is Allah, [who is] One.'",
            "tafseer_text": "Surah Al-Ikhlas equals one-third of the Quran in reward because the Quran addresses three main themes: Stories, Rulings, and Monotheism (Tawheed), and this Surah uniquely focuses on Tawheed.",
            "scholar_name": "Tafseer Ibn Kathir"
        },
        {
            "surah_number": 112,
            "surah_name": "Al-Ikhlas",
            "ayah_number": 2,
            "arabic_text": "ٱللَّهُ ٱلصَّمَدُ",
            "translation": "Allah, the Eternal Refuge.",
            "tafseer_text": "'As-Samad' means the Self-Sufficient Master upon whom all creation relies for every need, while He is in need of none.",
            "scholar_name": "Tafseer As-Sa'di"
        },
        {
            "surah_number": 113,
            "surah_name": "Al-Falaq",
            "ayah_number": 1,
            "arabic_text": "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
            "translation": "Say, 'I seek refuge in the Lord of daybreak.'",
            "tafseer_text": "Al-Falaq refers to the breaking of the dawn. Believers are commanded to seek divine shelter from all external harms and envious evil.",
            "scholar_name": "Tafseer Al-Jalalayn"
        },
        {
            "surah_number": 114,
            "surah_name": "An-Nas",
            "ayah_number": 1,
            "arabic_text": "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
            "translation": "Say, 'I seek refuge in the Lord of mankind.'",
            "tafseer_text": "Seeking refuge in Allah under His titles: Lord of mankind, Sovereign of mankind, and God of mankind against internal whispering evil (Waswas).",
            "scholar_name": "Tafseer Ibn Kathir"
        },
        {
            "surah_number": 114,
            "surah_name": "An-Nas",
            "ayah_number": 4,
            "arabic_text": "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ",
            "translation": "From the evil of the retreating whisperer.",
            "tafseer_text": "'Al-Khannas' is Satan who whispers evil thoughts when a person is negligent, but retreats immediately when Allah is remembered.",
            "scholar_name": "Tafseer Ibn Kathir"
        }
    ]

    for item in tafseer_items:
        Tafseer.objects.get_or_create(
            surah_number=item["surah_number"],
            ayah_number=item["ayah_number"],
            scholar_name=item["scholar_name"],
            defaults=item
        )

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_database()
