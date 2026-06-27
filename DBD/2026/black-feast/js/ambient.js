// 검은 연회 배경음악 — "Banquet of Bone"
// 페이지 이동(index <-> media) 시에도 재생 위치/재생 여부를 기억해 이어듣기를 시도한다.
var bgmAudio = null;
var isPlaying = false;
var BGM_STORAGE_KEY = 'blackFeastBgmState';
var saveTimer = null;

function readSavedState() {
  try {
    var raw = sessionStorage.getItem(BGM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveState() {
  if (!bgmAudio) return;
  try {
    sessionStorage.setItem(BGM_STORAGE_KEY, JSON.stringify({
      time: bgmAudio.currentTime,
      playing: !bgmAudio.paused
    }));
  } catch (e) { /* ignore */ }
}

function getBgmAudio() {
  if (!bgmAudio) {
    bgmAudio = new Audio('./audio/banquet-of-bone.mp3');
    bgmAudio.loop = true;
    bgmAudio.volume = 0.5;
    bgmAudio.preload = 'auto';

    var saved = readSavedState();
    if (saved && saved.time) {
      bgmAudio.addEventListener('loadedmetadata', function () {
        bgmAudio.currentTime = saved.time;
      }, { once: true });
    }

    bgmAudio.addEventListener('pause', saveState);
    window.addEventListener('beforeunload', saveState);
    saveTimer = setInterval(saveState, 1500);
  }
  return bgmAudio;
}

function startAudio() {
  var audio = getBgmAudio();
  audio.play().then(function () {
    isPlaying = true;
    updateAudioBtn(true);
  }).catch(function (e) {
    console.warn('Audio start failed:', e);
  });
}

function updateAudioBtn(on) {
  document.querySelectorAll('.audio-toggle-btn').forEach(function (btn) {
    if (btn.classList.contains('bgm-player')) {
      btn.classList.toggle('playing', on);
      var icon = btn.querySelector('.bgm-player-icon');
      if (icon) icon.textContent = on ? '⏸' : '▶';
      var label = btn.querySelector('.bgm-player-label');
      if (label) label.textContent = on ? 'BGM 재생 중' : 'BGM 재생';
    } else {
      btn.innerHTML = on ? '🔊 배경음 ON' : '🔇 배경음 OFF';
      btn.classList.toggle('audio-on', on);
    }
  });
}

function toggleAudio() {
  var audio = getBgmAudio();
  if (audio.paused) {
    startAudio();
  } else {
    audio.pause();
    isPlaying = false;
    updateAudioBtn(false);
  }
}

// 이전 페이지에서 재생 중이었다면, 새 페이지 로드 시 같은 위치에서 이어서 자동 재생을 시도한다.
// (브라우저 자동재생 정책상 차단될 수 있으며, 차단되면 다음 클릭 시 이어듣기로 대체된다.)
(function () {
  var saved = readSavedState();
  if (saved && saved.playing) {
    startAudio();
  }
})();
