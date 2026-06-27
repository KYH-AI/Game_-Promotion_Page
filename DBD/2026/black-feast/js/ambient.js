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

// 휠 스크롤 또는 클릭이 한 번이라도 발생하면 무조건 재생을 시도한다.
// (toggleAudio처럼 일시정지로 분기하지 않고 항상 startAudio만 호출하므로,
//  버튼 클릭과 동시에 발생해도 "재생 후 즉시 정지"되는 충돌이 생기지 않는다.
//  pointerdown/touchstart는 버튼의 click과 순서가 겹쳐 그 충돌을 유발하므로 제외한다.)
// 두 이벤트를 각각 독립적으로 once 처리한다 — 휠 이벤트는 브라우저 자동재생 정책상
// 재생 권한으로 인정되지 않는 경우가 많아 실패할 수 있는데, 같은 핸들러를 공유하면
// 휠이 먼저 발생해 실패하면서 click 리스너까지 함께 제거되어 버리는 문제가 있었다.
document.addEventListener('click', function onFirstClick() {
  startAudio();
  document.removeEventListener('click', onFirstClick);
}, { once: true, passive: true });
document.addEventListener('wheel', function onFirstWheel() {
  startAudio();
  document.removeEventListener('wheel', onFirstWheel);
}, { once: true, passive: true });

// 이전 페이지에서 재생 중이었다면, 새 페이지 로드 시 같은 위치에서 이어서 자동 재생을 시도한다.
// (브라우저 자동재생 정책상 차단될 수 있으며, 차단되면 다음 클릭 시 이어듣기로 대체된다.)
(function () {
  var saved = readSavedState();
  if (saved && saved.playing) {
    startAudio();
  }
})();
