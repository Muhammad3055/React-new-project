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
        <div className="player-info">
          <div className="player-icon">
            <i className="fas fa-volume-up"></i>
          </div>
          <div className="player-text">
            <span className="player-title">{currentTrack.title}</span>
            <span className="player-reciter">{currentTrack.reciter}</span>
          </div>
        </div>

        <div className="player-controls">
          <div className="control-buttons" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Speed Button */}
            <button
              onClick={cycleSpeed}
              title="Change Playback Speed"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--accent-gold)',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {playbackRate}x
            </button>

            {/* Main Play/Pause Button */}
            <button className="btn-player-main" onClick={() => setIsPlaying(!isPlaying)}>
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>

            {/* Stop / Cancel Audio Button */}
            <button
              onClick={handleStop}
              title="Stop & Close Audio Player"
              style={{
                background: '#ef4444',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.8rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fas fa-stop"></i>
            </button>

            {/* Loop Repeater Button */}
            <button
              onClick={toggleLoop}
              title={isLooping ? 'Repeat Mode: Active' : 'Repeat Mode: Disabled'}
              style={{
                background: isLooping ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: isLooping ? 'var(--primary-dark)' : '#ffffff',
                fontSize: '0.85rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-redo"></i>
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
            />
            <span className="time-stamp">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="volume-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <i className="fas fa-volume-down" style={{ color: '#cbd5e1', fontSize: '0.9rem' }}></i>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>

          {/* Far Right Cancel / Close Player Button */}
          <button
            onClick={handleStop}
            title="Cancel Playback & Close Player"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: '1rem',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#ef4444';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
