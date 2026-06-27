// 페이지를 떠났다가 다시 돌아왔을 때 스크롤 위치를 복원한다.
(function () {
  var SCROLL_KEY = 'scrollPos:' + location.pathname;

  function saveScroll() {
    try { sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)); } catch (e) { /* ignore */ }
  }
  function restoreScroll() {
    var saved = null;
    try { saved = sessionStorage.getItem(SCROLL_KEY); } catch (e) { /* ignore */ }
    if (saved !== null) window.scrollTo(0, parseInt(saved, 10) || 0);
  }

  var scrollSaveTimer = null;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollSaveTimer);
    scrollSaveTimer = setTimeout(saveScroll, 200);
  }, { passive: true });
  window.addEventListener('beforeunload', saveScroll);

  document.addEventListener('DOMContentLoaded', restoreScroll);
  window.addEventListener('load', restoreScroll);
})();

document.addEventListener('DOMContentLoaded', function () {
  if (window.AOS && typeof window.AOS.init === 'function') {
    window.AOS.init({ duration: 700, once: true, offset: 60 });
  } else {
    document.body.classList.add('no-aos');
  }

  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  var menuSwiperEl = document.querySelector('.menu-swiper');
  if (menuSwiperEl) {
    if (window.Swiper) {
      var menuSwiper = new window.Swiper('.menu-swiper', {
        loop: true,
        grabCursor: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
      });
      var menuImages = menuSwiperEl.querySelectorAll('img');
      menuImages.forEach(function (img) {
        if (img.complete) return;
        img.addEventListener('load', function () { menuSwiper.update(); });
      });
      window.addEventListener('load', function () { menuSwiper.update(); });
    } else {
      menuSwiperEl.classList.add('no-swiper');
    }
  }
});
