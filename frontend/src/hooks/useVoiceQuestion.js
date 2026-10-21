import { useEffect, useRef, useState } from 'react';
import { getApiUrl } from '../utils/apiCache';

export function speechLocale(language, siteLanguage = 'en') {
  const code = language === 'auto' ? siteLanguage : language;
  return { ur: 'ur-PK', ar: 'ar-SA', br: 'ur-PK', en: 'en-US' }[code] || 'en-US';
}

export default function useVoiceQuestion({ language, siteLanguage, onTranscript, enabled, busy }) {
  const [isRecording, setRecording] = useState(false);
  const [isTranscribing, setTranscribing] = useState(false);
  const [voiceError, setError] = useState('');
  const [voiceStatus, setStatus] = useState('');
  const capture = useRef(null);
  const stream = useRef(null);
  const timer = useRef(null);
  const controller = useRef(null);
  const active = useRef(false);
  const pendingStart = useRef(false);
  const latest = useRef({ onTranscript, language, siteLanguage, busy });
  latest.current = { onTranscript, language, siteLanguage, busy };

  const release = () => {
    clearTimeout(timer.current);
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
  };
  const cancel = () => {
    active.current = false;
    pendingStart.current = false;
    capture.current?.abort?.();
    if (capture.current?.state === 'recording') capture.current.stop();
    capture.current = null;
    controller.current?.abort();
    release();
    setRecording(false);
    setTranscribing(false);
    setStatus('');
  };
  useEffect(() => { if (!enabled) cancel(); return cancel; }, [enabled]);

  const startRecorder = async () => {
    clearTimeout(timer.current);
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('Voice input is unavailable in this browser. Please use a supported browser or type your question.');
      return;
    }
    active.current = true;
    pendingStart.current = true;
    setStatus('Allow microphone access to record your question.');
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      pendingStart.current = false;
      if (!active.current) { audioStream.getTracks().forEach(track => track.stop()); return; }
      stream.current = audioStream;
      const mimeType = ['audio/webm', 'audio/mp4', 'audio/ogg'].find(type => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(audioStream, mimeType ? { mimeType } : undefined);
      capture.current = recorder;
      const chunks = [];
      let bytes = 0;
      let tooLarge = false;
      recorder.ondataavailable = event => {
        if (event.data.size) { chunks.push(event.data); bytes += event.data.size; }
        if (bytes > 8 * 1024 * 1024 && recorder.state === 'recording') { tooLarge = true; recorder.stop(); }
      };
      recorder.onerror = () => { cancel(); setError('Recording failed. Please try again.'); };
      recorder.onstop = async () => {
        release(); setRecording(false);
        if (!active.current) return;
        if (tooLarge) { setError('Recording is too large. Please record a shorter question.'); setStatus(''); return; }
        setTranscribing(true); setStatus('Converting your voice to text…');
        controller.current = new AbortController();
        const timeout = setTimeout(() => controller.current?.abort(), 55000);
        try {
          const type = recorder.mimeType || 'audio/webm';
          const body = new FormData();
          body.append('audio', new Blob(chunks, { type }), `question.${type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm'}`);
          body.append('language', latest.current.language === 'auto' ? '' : latest.current.language);
          const response = await fetch(getApiUrl('/api/ai-assistant/transcribe/'), { method: 'POST', body, credentials: 'include', signal: controller.current.signal });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Voice transcription failed.');
          if (active.current && data.text) latest.current.onTranscript(data.text);
        } catch (error) {
          if (active.current) setError(error.name === 'AbortError' ? 'Voice transcription timed out. Please try again.' : error.message);
        } finally {
          clearTimeout(timeout);
          if (active.current) { setTranscribing(false); setStatus(''); }
        }
      };
      recorder.start(500);
      setRecording(true); setStatus('Recording… Tap the microphone again to send.');
      timer.current = setTimeout(() => { if (recorder.state === 'recording') recorder.stop(); }, 60000);
    } catch (error) {
      pendingStart.current = false; release(); setRecording(false); setStatus('');
      setError(error.name === 'NotAllowedError' ? 'Microphone access was denied. Allow it in your browser settings and try again.' : 'Could not access the microphone. Please try again.');
    }
  };

  const toggleVoiceRecording = () => {
    if (busy || isTranscribing || pendingStart.current) return;
    setError('');
    if (isRecording) { capture.current?.stop(); return; }
    if (!window.isSecureContext) { setError('Microphone access requires HTTPS. Please open the secure website.'); return; }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { startRecorder(); return; }
    active.current = true;
    pendingStart.current = true;
    let transcript = '';
    let failed = false;
    const recognition = new Recognition();
    capture.current = recognition;
    recognition.lang = speechLocale(language, siteLanguage);
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => { pendingStart.current = false; setRecording(true); setStatus('Listening… Speak your question.'); };
    recognition.onresult = event => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) transcript += event.results[i][0].transcript + ' ';
        else interim += event.results[i][0].transcript;
      }
      setStatus(interim || transcript || 'Listening…');
    };
    recognition.onerror = event => {
      clearTimeout(timer.current); pendingStart.current = false;
      failed = true; setRecording(false); setStatus('');
      if (!active.current) return;
      if (event.error === 'network' || event.error === 'service-not-allowed') startRecorder();
      else setError(event.error === 'not-allowed' ? 'Microphone access was denied. Allow it in browser settings and try again.' : 'No speech was recognized. Tap the microphone to try again.');
    };
    recognition.onend = () => {
      if (failed || !active.current) return;
      pendingStart.current = false; clearTimeout(timer.current); setRecording(false); setStatus('');
      if (transcript.trim()) latest.current.onTranscript(transcript.trim());
      else setError('No speech was detected. Please try again.');
    };
    try { recognition.start(); timer.current = setTimeout(() => recognition.stop(), 60000); }
    catch { failed = true; recognition.abort(); startRecorder(); }
  };
  return { isRecording, isTranscribing, voiceError, voiceStatus, toggleVoiceRecording };
}
