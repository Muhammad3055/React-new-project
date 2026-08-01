document.addEventListener('DOMContentLoaded', () => {
  const audio = new Audio();
  const playerBar = document.getElementById('global-audio-player');
  const playBtn = document.getElementById('player-play-btn');
  const playIcon = playBtn ? playBtn.querySelector('i') : null;
  const titleElem = document.getElementById('player-title');
  const reciterElem = document.getElementById('player-reciter');
  const progressBar = document.getElementById('player-progress');
  const currTimeElem = document.getElementById('player-curr-time');
  const durTimeElem = document.getElementById('player-dur-time');
  const volumeSlider = document.getElementById('player-volume');

  let currentSurahList = [];
  let currentTrackIndex = -1;

  // Global Function to Play Audio Track
  window.playAudioTrack = function(url, surahName, reciter, trackIndex = -1, surahList = []) {
    if (!url || url === '#') {
      alert('Audio file or stream URL is not available for this item.');
      return;
    }

    if (surahList.length > 0) {
      currentSurahList = surahList;
      currentTrackIndex = trackIndex;
    }

    audio.src = url;
    audio.play();

    if (titleElem) titleElem.textContent = surahName;
    if (reciterElem) reciterElem.textContent = reciter;
    if (playIcon) {
      playIcon.className = 'fas fa-pause';
    }

    if (playerBar) {
      playerBar.style.display = 'flex';
    }
  };

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!audio.src) return;
      if (audio.paused) {
        audio.play();
        if (playIcon) playIcon.className = 'fas fa-pause';
      } else {
        audio.pause();
        if (playIcon) playIcon.className = 'fas fa-play';
      }
    });
  }

  // Audio Progress Update
  audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      if (progressBar) progressBar.value = progressPercent;
      
      if (currTimeElem) currTimeElem.textContent = formatTime(audio.currentTime);
      if (durTimeElem) durTimeElem.textContent = formatTime(audio.duration);
    }
  });

  if (progressBar) {
    progressBar.addEventListener('input', () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      audio.volume = volumeSlider.value / 100;
    });
  }

  // Auto Play Next Track in List if available
  audio.addEventListener('ended', () => {
    if (playIcon) playIcon.className = 'fas fa-play';
    if (currentSurahList.length > 0 && currentTrackIndex >= 0 && currentTrackIndex < currentSurahList.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      const nextTrack = currentSurahList[nextIndex];
      window.playAudioTrack(nextTrack.url, nextTrack.title, nextTrack.reciter, nextIndex, currentSurahList);
    }
  });

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
});
