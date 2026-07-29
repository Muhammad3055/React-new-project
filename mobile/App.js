import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Linking
} from 'react-native';

// Django Backend API Base URL (Local IP / Live Server URL)
const API_BASE_URL = 'http://127.0.0.1:8000';

const FAZAIL_SAMPLE = [
  {
    id: 1,
    title: 'The Best of People / بہترین انسان',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'The best among you are those who learn the Quran and teach it.',
    reference: 'Sahih al-Bukhari 5027'
  },
  {
    id: 2,
    title: '10 Good Deeds Per Letter / ہر حرف پر ۱۰ نیکیاں',
    arabic: 'مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا',
    translation: 'Whoever recites a letter from the Book of Allah gets a 10-fold reward.',
    reference: 'Sunan at-Tirmidhi 2910'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('read'); // 'read' | 'mp3' | 'books' | 'fazail' | 'hadith'
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [audios, setAudios] = useState([]);
  const [taqreers, setTaqreers] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const [activeAudio, setActiveAudio] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch PDF / Word Books
      const booksRes = await fetch(`${API_BASE_URL}/api/books/`);
      const booksData = await booksRes.json();
      setBooks(booksData.results || []);

      // 2. Fetch Quran Audios
      const audiosRes = await fetch(`${API_BASE_URL}/api/quran/?featured=1`);
      const audiosData = await audiosRes.json();
      setAudios(audiosData.results || []);

      // 3. Fetch Taqreer Speeches
      const taqreerRes = await fetch(`${API_BASE_URL}/api/taqreer/`);
      const taqreerData = await taqreerRes.json();
      setTaqreers(taqreerData.results || []);

      // 4. Fetch Hadiths
      const hadithsRes = await fetch(`${API_BASE_URL}/api/hadith/`);
      const hadithsData = await hadithsRes.json();
      setHadiths(hadithsData.results || []);
    } catch (e) {
      console.log('Django Backend API Fetch Notice:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={styles.loadingText}>Loading Islamic Portal Mobile Data...</Text>
        </View>
      );
    }

    if (activeTab === 'read') {
      return (
        <ScrollView style={styles.tabContent}>
          <View style={styles.dailyCard}>
            <Text style={styles.badgeText}>✨ Daily Quranic Reflection</Text>
            <Text style={styles.arabicText}>
              الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
            </Text>
            <Text style={styles.translationText}>
              "Unquestionably, by the remembrance of Allah do hearts find peace." [Ar-Ra'd 13:28]
            </Text>
            <Text style={styles.urduText}>
              اردو: "سن لو! اللہ کے ذکر ہی سے دلوں کو اطمینان ملتا ہے۔"
            </Text>
          </View>

          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>📖 Interactive Quran Portal</Text>
            <Text style={styles.infoText}>
              Read Holy Quran with side-by-side Brahui, Urdu & English translations, Tafseer commentary, and Qari audio recitations.
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryActionButton}>
            <Text style={styles.primaryActionButtonText}>📖 Open Full Quran Reader</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    if (activeTab === 'mp3') {
      return (
        <ScrollView style={styles.tabContent}>
          <Text style={styles.sectionTitle}>🎧 Quran Recitations & Taqreers</Text>
          <Text style={styles.subTitle}>Listen to Arabic Tilawat, Brahui & Urdu translations, and voice notes.</Text>

          {audios.length > 0 ? (
            audios.map((item) => (
              <View key={`audio-${item.id}`} style={styles.audioCard}>
                <View style={styles.audioInfo}>
                  <Text style={styles.cardTitle}>Surah {item.surah_name_english} ({item.surah_name_arabic})</Text>
                  <Text style={styles.cardSubTitle}>Qari: {item.reciter}</Text>
                </View>
                <TouchableOpacity
                  style={styles.goldPlayBtn}
                  onPress={() => {
                    setActiveAudio(item.audio_url);
                    Linking.openURL(item.audio_url);
                  }}
                >
                  <Text style={styles.goldPlayBtnText}>▶ Play MP3</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Surah Al-Fatiha & Al-Kahf MP3 Recitations Available</Text>
            </View>
          )}

          {taqreers.map((tq) => (
            <View key={`tq-${tq.id}`} style={styles.audioCard}>
              <View style={styles.audioInfo}>
                <Text style={styles.cardTitle}>{tq.title}</Text>
                <Text style={styles.cardSubTitle}>Speaker: {tq.speaker} ({tq.language.toUpperCase()})</Text>
              </View>
              <TouchableOpacity
                style={styles.goldPlayBtn}
                onPress={() => Linking.openURL(tq.audio_url)}
              >
                <Text style={styles.goldPlayBtnText}>▶ Play Taqreer</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      );
    }

    if (activeTab === 'books') {
      return (
        <ScrollView style={styles.tabContent}>
          <Text style={styles.sectionTitle}>📚 PDF & Word Books Library</Text>
          <Text style={styles.subTitle}>Read authentic Islamic literature, Tafseer, and tajweed guides.</Text>

          {books.length > 0 ? (
            books.map((b) => (
              <View key={`book-${b.id}`} style={styles.bookCard}>
                <Text style={styles.cardTitle}>{b.title}</Text>
                <Text style={styles.cardSubTitle}>By {b.author} &bull; {b.language}</Text>
                <TouchableOpacity
                  style={styles.emeraldButton}
                  onPress={() => Linking.openURL(b.document_url || `${API_BASE_URL}/media/books/30_sabab_saadah.pdf`)}
                >
                  <Text style={styles.emeraldButtonText}>📄 Open PDF / Word Document</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.bookCard}>
              <Text style={styles.cardTitle}>Holy Quran Brahui & Urdu Translation</Text>
              <Text style={styles.cardSubTitle}>Digital PDF Library Document</Text>
              <TouchableOpacity
                style={styles.emeraldButton}
                onPress={() => Linking.openURL(`${API_BASE_URL}/media/books/Holy_Quran_Translation_in_Brahui_Language.pdf`)}
              >
                <Text style={styles.emeraldButtonText}>📄 Open Brahui PDF Book</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      );
    }

    if (activeTab === 'fazail') {
      return (
        <ScrollView style={styles.tabContent}>
          <Text style={styles.sectionTitle}>🌟 Fazail & Virtues of Quran (فضائل)</Text>
          <Text style={styles.subTitle}>Authentic Hadith virtues for reciting Quran and good deeds.</Text>

          {FAZAIL_SAMPLE.map((fz) => (
            <View key={fz.id} style={styles.fazailCard}>
              <Text style={styles.fazailTitle}>{fz.title}</Text>
              <Text style={styles.arabicText}>{fz.arabic}</Text>
              <Text style={styles.translationText}>"{fz.translation}"</Text>
              <Text style={styles.refText}>Reference: {fz.reference}</Text>
            </View>
          ))}
        </ScrollView>
      );
    }

    if (activeTab === 'hadith') {
      return (
        <ScrollView style={styles.tabContent}>
          <Text style={styles.sectionTitle}>📜 Authentic Hadith Collections</Text>
          <Text style={styles.subTitle}>Sahih Bukhari, Sahih Muslim, Riyad As-Salihin & more.</Text>

          {hadiths.map((h) => (
            <View key={h.id} style={styles.hadithCard}>
              <Text style={styles.hadithBadge}>{h.book_name} #{h.hadith_number} ({h.grade})</Text>
              <Text style={styles.arabicText}>{h.arabic_text}</Text>
              <Text style={styles.translationText}>"{h.translation}"</Text>
            </View>
          ))}
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#022c22" />

      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</Text>
        <Text style={styles.headerSubtitle}>Holy Quran & Islamic Media Portal</Text>
      </View>

      {/* Body Area */}
      <View style={styles.body}>{renderContent()}</View>

      {/* Bottom Navigation Tabs Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.navItem, activeTab === 'read' && styles.navItemActive]} onPress={() => setActiveTab('read')}>
          <Text style={styles.navIcon}>📖</Text>
          <Text style={[styles.navLabel, activeTab === 'read' && styles.navLabelActive]}>Read</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, activeTab === 'mp3' && styles.navItemActive]} onPress={() => setActiveTab('mp3')}>
          <Text style={styles.navIcon}>🎧</Text>
          <Text style={[styles.navLabel, activeTab === 'mp3' && styles.navLabelActive]}>MP3</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, activeTab === 'books' && styles.navItemActive]} onPress={() => setActiveTab('books')}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={[styles.navLabel, activeTab === 'books' && styles.navLabelActive]}>Books</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, activeTab === 'fazail' && styles.navItemActive]} onPress={() => setActiveTab('fazail')}>
          <Text style={styles.navIcon}>🌟</Text>
          <Text style={[styles.navLabel, activeTab === 'fazail' && styles.navLabelActive]}>Fazail</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, activeTab === 'hadith' && styles.navItemActive]} onPress={() => setActiveTab('hadith')}>
          <Text style={styles.navIcon}>📜</Text>
          <Text style={[styles.navLabel, activeTab === 'hadith' && styles.navLabelActive]}>Hadith</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011c16',
  },
  header: {
    backgroundColor: '#022c22',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  body: {
    flex: 1,
    backgroundColor: '#011c16',
  },
  tabContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#f59e0b',
    marginTop: 12,
    fontSize: 14,
  },
  dailyCard: {
    backgroundColor: '#064e3b',
    borderColor: '#f59e0b',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  badgeText: {
    color: '#f59e0b',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 8,
  },
  arabicText: {
    color: '#ffffff',
    fontSize: 19,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  translationText: {
    color: '#fef3c7',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  urduText: {
    color: '#6ee7b7',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
  },
  cardHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 14,
  },
  infoText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
  primaryActionButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 14,
  },
  primaryActionButtonText: {
    color: '#022c22',
    fontWeight: 'bold',
    fontSize: 15,
  },
  audioCard: {
    backgroundColor: '#064e3b',
    borderColor: 'rgba(245,158,11,0.35)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioInfo: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardSubTitle: {
    color: '#cbd5e1',
    fontSize: 13,
    marginTop: 4,
  },
  goldPlayBtn: {
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  goldPlayBtnText: {
    color: '#022c22',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bookCard: {
    backgroundColor: '#064e3b',
    borderColor: 'rgba(245,158,11,0.35)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  emeraldButton: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  emeraldButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  fazailCard: {
    backgroundColor: '#064e3b',
    borderColor: '#f59e0b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  fazailTitle: {
    color: '#f59e0b',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  refText: {
    color: '#6ee7b7',
    fontSize: 12,
    marginTop: 8,
    fontWeight: 'bold',
  },
  hadithCard: {
    backgroundColor: '#064e3b',
    borderColor: 'rgba(245,158,11,0.35)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  hadithBadge: {
    color: '#022c22',
    backgroundColor: '#f59e0b',
    fontWeight: 'bold',
    fontSize: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  emptyCard: {
    padding: 20,
    textAlign: 'center',
  },
  emptyText: {
    color: '#cbd5e1',
    fontStyle: 'italic',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#022c22',
    borderTopWidth: 1,
    borderTopColor: 'rgba(245,158,11,0.35)',
    paddingVertical: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b',
  },
  navIcon: {
    fontSize: 17,
  },
  navLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#f59e0b',
    fontWeight: 'bold',
  },
});
