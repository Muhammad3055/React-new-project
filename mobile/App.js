import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Linking
} from 'react-native';

// Set your Django API URL (Change to your live domain or local IP)
const API_BASE_URL = 'http://127.0.0.1:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('read'); // 'read' | 'mp3' | 'books' | 'hadith'
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [audios, setAudios] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const [activeAudio, setActiveAudio] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Books
      const booksRes = await fetch(`${API_BASE_URL}/api/books/`);
      const booksData = await booksRes.json();
      setBooks(booksData.results || []);

      // Fetch Quran Audios
      const audiosRes = await fetch(`${API_BASE_URL}/api/quran/?featured=1`);
      const audiosData = await audiosRes.json();
      setAudios(audiosData.results || []);

      // Fetch Hadiths
      const hadithsRes = await fetch(`${API_BASE_URL}/api/hadith/`);
      const hadithsData = await hadithsRes.json();
      setHadiths(hadithsData.results || []);
    } catch (e) {
      console.log('Error fetching data from Django backend:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={styles.loadingText}>Loading Islamic Portal Data...</Text>
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
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📖 Interactive Quran Reading</Text>
          </View>
          <Text style={styles.infoText}>
            Select Surahs and read Arabic text with Brahui, Urdu & English translations side-by-side.
          </Text>
        </ScrollView>
      );
    }

    if (activeTab === 'mp3') {
      return (
        <ScrollView style={styles.tabContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎧 Quran & Taqreer MP3 Audios</Text>
          </View>
          {audios.map((item) => (
            <View key={item.id} style={styles.audioCard}>
              <View style={styles.audioInfo}>
                <Text style={styles.surahTitle}>Surah {item.surah_name_english} ({item.surah_name_arabic})</Text>
                <Text style={styles.reciterName}>Qari: {item.reciter}</Text>
              </View>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => setActiveAudio(item.audio_url)}
              >
                <Text style={styles.playButtonText}>
                  {activeAudio === item.audio_url ? '⏸ Playing' : '▶ Play MP3'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      );
    }

    if (activeTab === 'books') {
      return (
        <ScrollView style={styles.tabContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📚 PDF Books & Library</Text>
          </View>
          {books.map((b) => (
            <View key={b.id} style={styles.bookCard}>
              <Text style={styles.bookTitle}>{b.title}</Text>
              <Text style={styles.authorName}>By {b.author} ({b.language})</Text>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => Linking.openURL(b.document_url || `${API_BASE_URL}/media/books/30_sabab_saadah.pdf`)}
              >
                <Text style={styles.downloadButtonText}>📖 Read / Open PDF Document</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      );
    }

    if (activeTab === 'hadith') {
      return (
        <ScrollView style={styles.tabContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📜 Authentic Hadiths</Text>
          </View>
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

      {/* Mobile Top Header Banner */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</Text>
        <Text style={styles.headerSubtitle}>Holy Quran & Islamic Portal</Text>
      </View>

      {/* Body View */}
      <View style={styles.body}>{renderContent()}</View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'read' && styles.navItemActive]}
          onPress={() => setActiveTab('read')}
        >
          <Text style={[styles.navIcon, activeTab === 'read' && styles.navIconActive]}>📖</Text>
          <Text style={[styles.navLabel, activeTab === 'read' && styles.navLabelActive]}>Read</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'mp3' && styles.navItemActive]}
          onPress={() => setActiveTab('mp3')}
        >
          <Text style={[styles.navIcon, activeTab === 'mp3' && styles.navIconActive]}>🎧</Text>
          <Text style={[styles.navLabel, activeTab === 'mp3' && styles.navLabelActive]}>MP3</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'books' && styles.navItemActive]}
          onPress={() => setActiveTab('books')}
        >
          <Text style={[styles.navIcon, activeTab === 'books' && styles.navIconActive]}>📚</Text>
          <Text style={[styles.navLabel, activeTab === 'books' && styles.navLabelActive]}>Books</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'hadith' && styles.navItemActive]}
          onPress={() => setActiveTab('hadith')}
        >
          <Text style={[styles.navIcon, activeTab === 'hadith' && styles.navIconActive]}>📜</Text>
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
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
    padding: 18,
    marginBottom: 16,
  },
  badgeText: {
    color: '#f59e0b',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 10,
  },
  arabicText: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: 12,
  },
  translationText: {
    color: '#fef3c7',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  infoText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  audioCard: {
    backgroundColor: '#064e3b',
    borderColor: 'rgba(245,158,11,0.3)',
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
  surahTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  reciterName: {
    color: '#cbd5e1',
    fontSize: 13,
    marginTop: 4,
  },
  playButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  playButtonText: {
    color: '#022c22',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bookCard: {
    backgroundColor: '#064e3b',
    borderColor: 'rgba(245,158,11,0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  bookTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorName: {
    color: '#f59e0b',
    fontSize: 13,
    marginVertical: 6,
  },
  downloadButton: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  downloadButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  hadithCard: {
    backgroundColor: '#064e3b',
    borderColor: 'rgba(245,158,11,0.3)',
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
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#022c22',
    borderTopWidth: 1,
    borderTopColor: 'rgba(245,158,11,0.3)',
    paddingVertical: 8,
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
    fontSize: 18,
  },
  navIconActive: {
    fontSize: 20,
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
