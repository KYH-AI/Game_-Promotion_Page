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
