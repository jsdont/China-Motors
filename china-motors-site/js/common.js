// /js/common.js
(() => {
  const onReady = () => {
    // Бургер-меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // Кнопка "Наверх"
    const toTopBtn = document.getElementById('toTopBtn');
    const updateToTop = () => {
      if (!toTopBtn) return;
      toTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    };
    if (toTopBtn) {
      window.addEventListener('scroll', updateToTop, { passive: true });
      toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      updateToTop();
    }

    // Tawk.to (одна инъекция вместо копипасты на каждой странице)
    // Тот же ID, что у тебя везде: 68480dddb0d263190ae16f29/1itcncalg
    // см. повторяющиеся блоки внизу страниц :contentReference[oaicite:7]{index=7} :contentReference[oaicite:8]{index=8}
    if (!document.getElementById('tawk_script')) {
      const s1 = document.createElement('script');
      s1.id = 'tawk_script';
      s1.async = true;
      s1.src = 'https://embed.tawk.to/68480dddb0d263190ae16f29/1itcncalg';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      document.body.appendChild(s1);
    }

    // Ленивая загрузка для всех картинок и видео, если атрибутов нет
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
    document
      .querySelectorAll('video[preload="auto"]')
      .forEach(v => v.setAttribute('preload', 'metadata'));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
