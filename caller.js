
/**
 * Flight Chalker — Score Caller Module
 * ---------------------------------------------------
 * Stage 1: TTS-only caller using the Web Speech API.
 * Built so a later "big moments" pre-recorded clip layer
 * can slot in without changing any call sites — see the
 * clipMap hook near the bottom, currently empty.
 *
 * Usage:
 *   <script src="caller.js"></script>
 *   ScoreCaller.unlock();               // call from a real user gesture (iOS requirement)
 *   ScoreCaller.callTurn({ turnTotal: 140, remaining: 261 });
 *   ScoreCaller.callTurn({ isBust: true });
 *   ScoreCaller.callTurn({ isGameShot: true, playerName: 'Adam' });
 */

const ScoreCaller = (() => {
  let enabled = localStorage.getItem('fc_caller_enabled') !== 'false'; // default ON
  let voice = null;
  let rate = parseFloat(localStorage.getItem('fc_caller_rate')) || 1.0;
  let pitch = parseFloat(localStorage.getItem('fc_caller_pitch')) || 1.0;
  let unlocked = false;

  // ---- Voice selection -------------------------------------------------

  function pickVoice() {
    if (typeof speechSynthesis === 'undefined') return null;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return null;

    return (
      voices.find(v => /en-GB/i.test(v.lang) && /male/i.test(v.name)) ||
      voices.find(v => /en-GB/i.test(v.lang)) ||
      voices.find(v => /^en/i.test(v.lang)) ||
      voices[0]
    );
  }

  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = () => { voice = pickVoice(); };
  }

  // ---- iOS/Safari unlock -------------------------------------------------
  // Speech synthesis needs one real user gesture before it'll play
  // reliably on iOS Safari. We hook this into startGame() since that's
  // already a click handler — no extra "enable sound" button needed.

  function unlock() {
    if (unlocked || typeof speechSynthesis === 'undefined') return;
    const utter = new SpeechSynthesisUtterance('');
    utter.volume = 0;
    speechSynthesis.speak(utter);
    unlocked = true;
  }

  // ---- Core speak function -----------------------------------------------

  function speak(text, opts = {}) {
    if (!enabled || !text || typeof speechSynthesis === 'undefined') return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice || pickVoice();
    utter.rate = opts.rate || rate;
    utter.pitch = opts.pitch || pitch;

    speechSynthesis.cancel(); // avoid rapid-throw queue lag
    speechSynthesis.speak(utter);
  }

  // ---- Public call events --------------------------------------------

  function callDart(label) {
    speak(String(label)); // e.g. "Twenty", "Treble twenty", "Bullseye"
  }

  function callTurn({
    playerName,
    turnTotal,
    remaining,
    isBust = false,
    isCheckout = false,
    isGameShot = false
  } = {}) {
    // Reserved hook for Stage 2 pre-recorded clips:
    // if (playAudioClip({ turnTotal, isBust, isCheckout, isGameShot })) return;

    if (isGameShot) {
      speak(`Game shot! ${playerName || ''}`.trim(), { rate: 0.9, pitch: 1.15 });
      return;
    }

    if (isBust) {
      speak('No score.', { rate: 0.95 });
      return;
    }

    let text = String(turnTotal);
    if (turnTotal >= 100) text += '!';
    if (typeof remaining === 'number' && remaining > 0) {
      text += `. ${remaining} to go.`;
    }
    if (isCheckout) text += ' Checkout!';

    speak(text);
  }

  // ---- Settings ---------------------------------------------------------

  function setEnabled(value) {
    enabled = !!value;
    localStorage.setItem('fc_caller_enabled', enabled);
  }
  function isEnabled() { return enabled; }

  function toggle() {
    setEnabled(!enabled);
    return enabled;
  }

  function setRate(value) { rate = value; localStorage.setItem('fc_caller_rate', value); }
  function setPitch(value) { pitch = value; localStorage.setItem('fc_caller_pitch', value); }

  function setVoiceByName(name) {
    if (typeof speechSynthesis === 'undefined') return;
    const voices = speechSynthesis.getVoices();
    voice = voices.find(v => v.name === name) || null;
  }

  function getAvailableVoices() {
    return typeof speechSynthesis !== 'undefined' ? speechSynthesis.getVoices() : [];
  }

  // ---- Future hook: Stage 2 pre-recorded "big moment" clips --------------
  const clipMap = {
    // '180': ['/audio/caller/180-1.mp3', '/audio/caller/180-2.mp3'],
    // 'gameshot': ['/audio/caller/gameshot-1.mp3'],
  };

  return {
    unlock, callDart, callTurn,
    setEnabled, isEnabled, toggle, setRate, setPitch,
    setVoiceByName, getAvailableVoices, clipMap
  };
})();
