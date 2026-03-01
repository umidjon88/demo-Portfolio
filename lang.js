// Language switching logic
document.addEventListener('DOMContentLoaded', () => {
  const langBtns = document.querySelectorAll('.lang-btn');
  const currentLang = localStorage.getItem('language') || 'en';

  // Set initial language
  setLanguage(currentLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
      localStorage.setItem('language', lang);
    });
  });
});

function setLanguage(lang) {
  const elements = document.querySelectorAll('[data-i18n]');

  // 1. Add fade-out effect
  elements.forEach(el => el.classList.add('lang-changing'));

  // 2. Update active state of buttons immediately
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // 3. Wait for fade-out, then change text and fade-in
  setTimeout(() => {
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        // If it's an input or textarea, update placeholder
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[lang][key];
        } else {
          el.textContent = translations[lang][key];
        }
      }
      // Remove class to fade back in
      el.classList.remove('lang-changing');
    });

    // Update intl-tel-input if it exists (on contact page)
    if (window.iti) {
      window.iti.setCountry(lang === 'ru' ? 'ru' : 'uz');
    }

    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', lang);
  }, 300); // Matches the CSS transition time
}
