"""
Django Management Command: seed_hadith_tafseer
Usage: python manage.py seed_hadith_tafseer

Adds 5 sample Hadith and 5 sample Tafseer records to the database
if they do not already exist. Safe to run multiple times (idempotent).
"""
from django.core.management.base import BaseCommand
from core.models import Hadith, Tafseer


SAMPLE_HADITHS = [
    {
        "book_name": "Sahih Bukhari",
        "chapter": "The Book of Revelation",
        "hadith_number": 1,
        "arabic_text": "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
        "translation": (
            "Actions are judged by intentions, and every person will get "
            "the reward according to what he has intended. So whoever emigrated "
            "for Allah and His Messenger, his emigration will be for Allah and "
            "His Messenger; and whoever emigrated for worldly benefits or for a "
            "woman to marry, his emigration would be for what he emigrated for."
        ),
        "narrated_by": "Umar ibn Al-Khattab (R.A)",
        "grade": "Sahih",
    },
    {
        "book_name": "Sahih Bukhari",
        "chapter": "The Book of Faith (Iman)",
        "hadith_number": 13,
        "arabic_text": "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
        "translation": (
            "None of you truly believes until he loves for his brother "
            "what he loves for himself."
        ),
        "narrated_by": "Anas ibn Malik (R.A)",
        "grade": "Sahih",
    },
    {
        "book_name": "Sahih Bukhari",
        "chapter": "The Virtues of the Quran",
        "hadith_number": 5027,
        "arabic_text": "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
        "translation": (
            "The best of you are those who learn the Quran and teach it."
        ),
        "narrated_by": "Uthman ibn Affan (R.A)",
        "grade": "Sahih",
    },
    {
        "book_name": "Sahih Bukhari",
        "chapter": "The Book of Faith (Iman)",
        "hadith_number": 38,
        "arabic_text": (
            "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ"
        ),
        "translation": (
            "Whoever fasts during Ramadan with sincere faith and hoping "
            "for its reward from Allah, will have all of his previous sins forgiven."
        ),
        "narrated_by": "Abu Hurairah (R.A)",
        "grade": "Sahih",
    },
    {
        "book_name": "Sahih Bukhari",
        "chapter": "The Book of Knowledge",
        "hadith_number": 69,
        "arabic_text": "يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا",
        "translation": (
            "Make things easy and do not make them hard. Give glad tidings "
            "and do not drive people away."
        ),
        "narrated_by": "Anas ibn Malik (R.A)",
        "grade": "Sahih",
    },
]


SAMPLE_TAFSEERS = [
    {
        "surah_number": 1,
        "surah_name": "Al-Fatihah",
        "ayah_number": 1,
        "arabic_text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "translation": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        "tafseer_text": (
            "Ibn Kathir explains: Starting in the name of Allah means we begin with "
            "the name of Allah, seeking His blessings. 'Ar-Rahman' refers to the "
            "vastness of Allah's mercy that encompasses all of creation, while "
            "'Ar-Raheem' refers specifically to His mercy reserved for the believers "
            "on the Day of Judgment. The Prophet (ﷺ) said: 'Every matter of importance "
            "that does not begin with Bismillah is cut off from blessing.' "
            "(Abu Dawud)"
        ),
        "scholar_name": "Tafseer Ibn Kathir",
    },
    {
        "surah_number": 1,
        "surah_name": "Al-Fatihah",
        "ayah_number": 2,
        "arabic_text": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        "translation": "All praise is due to Allah, Lord of the worlds.",
        "tafseer_text": (
            "Ibn Kathir explains: 'Al-Hamd' (all praise) is for Allah alone, "
            "the One Who created all worlds and sustains them. 'Rabb' means the "
            "Creator, the Owner, and the One Who takes care of all His creation. "
            "'Al-'Alamin' refers to everything that exists apart from Allah — humans, "
            "jinn, angels, animals and all of creation. Allah alone deserves every "
            "form of praise because He is the only One who bestows all blessings."
        ),
        "scholar_name": "Tafseer Ibn Kathir",
    },
    {
        "surah_number": 1,
        "surah_name": "Al-Fatihah",
        "ayah_number": 3,
        "arabic_text": "الرَّحْمَٰنِ الرَّحِيمِ",
        "translation": "The Entirely Merciful, the Especially Merciful.",
        "tafseer_text": (
            "Ibn Kathir explains: These two names of Allah both derive from "
            "'Rahma' (mercy). 'Ar-Rahman' is more intensive than 'Ar-Raheem'. "
            "Ar-Rahman refers to Allah's mercy that encompasses all creation in "
            "this world — believer and disbeliever alike receive sustenance, health "
            "and blessings. Ar-Raheem refers to the special mercy Allah reserves "
            "exclusively for the believers in the Hereafter. Together these names "
            "show that Allah's mercy is both universal and specially dedicated."
        ),
        "scholar_name": "Tafseer Ibn Kathir",
    },
    {
        "surah_number": 1,
        "surah_name": "Al-Fatihah",
        "ayah_number": 4,
        "arabic_text": "مَالِكِ يَوْمِ الدِّينِ",
        "translation": "Sovereign of the Day of Recompense.",
        "tafseer_text": (
            "Ibn Kathir explains: 'Malik' means the King and Owner. 'Yawm Ad-Deen' "
            "is the Day of Recompense — the Day of Judgment — when every soul will "
            "be recompensed for its deeds. On that Day, no king will have dominion "
            "except Allah. Every person, prophet, king, and ordinary believer will "
            "stand before Allah alone. This ayah reminds us to prepare for that Day "
            "by doing righteous deeds and seeking Allah's forgiveness."
        ),
        "scholar_name": "Tafseer Ibn Kathir",
    },
    {
        "surah_number": 1,
        "surah_name": "Al-Fatihah",
        "ayah_number": 5,
        "arabic_text": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        "translation": "It is You we worship and You we ask for help.",
        "tafseer_text": (
            "Ibn Kathir explains: This ayah is the heart of Al-Fatihah. It is the "
            "covenant between the servant and his Lord. 'Iyyaka na'budu' — You alone "
            "we worship, meaning we do not associate any partner with Allah in worship. "
            "'Wa iyyaka nasta'een' — from You alone we seek help, meaning we rely "
            "only on Allah for all our affairs. This ayah teaches us that worship "
            "and seeking help must both be directed exclusively to Allah, which is "
            "the essence of Tawheed (Islamic monotheism)."
        ),
        "scholar_name": "Tafseer Ibn Kathir",
    },
]


class Command(BaseCommand):
    help = "Seeds the database with 5 sample Hadith and 5 sample Tafseer entries."

    def handle(self, *args, **kwargs):
        # --- Seed Hadiths ---
        hadith_created = 0
        for h in SAMPLE_HADITHS:
            obj, created = Hadith.objects.get_or_create(
                book_name=h["book_name"],
                hadith_number=h["hadith_number"],
                defaults={
                    "chapter": h["chapter"],
                    "arabic_text": h["arabic_text"],
                    "translation": h["translation"],
                    "narrated_by": h["narrated_by"],
                    "grade": h["grade"],
                },
            )
            if created:
                hadith_created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"[OK] Hadith seeding complete: {hadith_created} new record(s) added "
                f"(skipped {len(SAMPLE_HADITHS) - hadith_created} existing)."
            )
        )

        # --- Seed Tafseers ---
        tafseer_created = 0
        for tf in SAMPLE_TAFSEERS:
            obj, created = Tafseer.objects.get_or_create(
                surah_number=tf["surah_number"],
                ayah_number=tf["ayah_number"],
                scholar_name=tf["scholar_name"],
                defaults={
                    "surah_name": tf["surah_name"],
                    "arabic_text": tf["arabic_text"],
                    "translation": tf["translation"],
                    "tafseer_text": tf["tafseer_text"],
                },
            )
            if created:
                tafseer_created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"[OK] Tafseer seeding complete: {tafseer_created} new record(s) added "
                f"(skipped {len(SAMPLE_TAFSEERS) - tafseer_created} existing)."
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "\nSeed complete! You can now view Hadiths and Tafseers in the app."
            )
        )

