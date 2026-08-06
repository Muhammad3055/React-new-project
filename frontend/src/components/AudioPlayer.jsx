import React, { useRef, useEffect, useState } from 'react';

export default function AudioPlayer({ currentTrack, isPlaying, setIsPlaying, setCurrentTrack }) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (currentTrack) {
        audioRef.current.src = currentTrack.url;
        audioRef.current.playbackRate = playbackRate;
        if (isPlaying) {
          audioRef.current.play().catch(err => console.error("Playback error:", err));
        }
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentTrack) {
      document.body.classList.add('has-audio-player');
    } else {
      document.body.classList.remove('has-audio-player');
    }
    return () => {
      document.body.classList.remove('has-audio-player');
    };
  }, [currentTrack]);

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    if (setCurrentTrack) {
      setCurrentTrack(null);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = e.target.value;
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackRate(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const toggleLoop = () => {
    const newLoopState = !isLooping;
    setIsLooping(newLoopState);
    if (audioRef.current) {
      audioRef.current.loop = newLoopState;
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleShareAudio = () => {
    if (!currentTrack) return;
    const shareText = `Listen to ${currentTrack.title} (${currentTrack.reciter}) on Maktaba Tul Muslim:\nhttps://maktabatulmuslim.com`;
    if (navigator.share) {
      navigator.share({
        title: currentTrack.title,
        text: shareText,
        url: currentTrack.url || window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\nAudio Direct Link: ${currentTrack.url}`);
      alert(`Audio link for ${currentTrack.title} copied to clipboard!`);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="audio-player-bar">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (currentTrack && currentTrack.onEnded) {
            currentTrack.onEnded();
          }
          if (!isLooping) setIsPlaying(false);
        }}
        loop={isLooping}
      />
      <div className="player-container">
        {/* Track Info */}
        <div className="player-info">
          <div className="player-icon">
            <i className="fas fa-volume-up"></i>
          </div>
          <div className="player-text">
            <span className="player-title" title={currentTrack.title}>{currentTrack.title}</span>
            <span className="player-reciter" title={currentTrack.reciter}>{currentTrack.reciter}</span>
          </div>
          {/* Mobile close button inside info bar */}
          <button
            onClick={handleStop}
            title="Stop & Close Audio Player"
            className="player-close-btn mobile-only-close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Controls & Progress */}
        <div className="player-controls">
          <div className="control-buttons">
            <button
              onClick={cycleSpeed}
              title="Change Playback Speed"
              className="player-speed-btn"
            >
              {playbackRate}x
            </button>

            <button
              className="btn-player-main"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>

            <button
              onClick={toggleLoop}
              title={isLooping ? 'Repeat Mode: Active' : 'Repeat Mode: Disabled'}
              className={`player-loop-btn ${isLooping ? 'active' : ''}`}
            >
              <i className="fas fa-redo"></i>
            </button>

            <button
              onClick={handleShareAudio}
              title="Share this MP3 Audio"
              className="player-loop-btn"
              style={{ color: 'var(--accent-gold)' }}
            >
              <i className="fas fa-share-alt"></i>
            </button>

            <button
              onClick={handleStop}
              title="Stop & Close Audio Player"
              className="player-stop-btn"
            >
              <i className="fas fa-stop"></i>
            </button>
          </div>

          <div className="progress-container">
            <span className="time-stamp">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="progress-bar-input"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              aria-label="Audio Progress"
            />
            <span className="time-stamp">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Desktop Close Button */}
        <div className="volume-wrapper">
          <div className="volume-inner">
            <i className="fas fa-volume-down volume-icon"></i>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume"
            />
          </div>

          <button
            onClick={handleStop}
            title="Cancel Playback & Close Player"
            className="player-close-btn desktop-only-close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
