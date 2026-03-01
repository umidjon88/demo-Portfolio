lucide.createIcons();

// ═══════════════════════════════════════
// PREMIUM UI ELEMENTS LOGIC
// ═══════════════════════════════════════

// Handle Feedback Reason from Home Alert
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reason = urlParams.get('reason');
  if (reason === 'feedback') {
    const feedbackCheck = document.querySelector('input[name="interest"][value="Feedback"]');
    if (feedbackCheck) {
      feedbackCheck.checked = true;
      // Scroll to form smoothly
      feedbackCheck.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

// Page Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('fade-out');
  }
});

// Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline) {
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });

  const interactables = document.querySelectorAll('a, button, .info-card, .p-stat, .faq-item');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// Scroll Progress Bar
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
  });
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateIcons(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateIcons(theme);
  });
}

function updateIcons(theme) {
  if (sunIcon && moonIcon) {
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  if (question) {
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  }
});

// Header Scroll
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll Animations
const animatedEls = document.querySelectorAll('.animate-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
animatedEls.forEach(el => observer.observe(el));

// Mobile Menu Toggle Logic
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-links a');

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

if (mobileMenuClose && mobileMenu) {
  mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
}

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// AJAX Form Submission
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

// Phone Input with Country Selection
const phoneInput = document.querySelector('input[name="phone"]');
let iti;
if (phoneInput) {
  iti = window.intlTelInput(phoneInput, {
    initialCountry: localStorage.getItem('language') === 'ru' ? 'ru' : 'uz',
    preferredCountries: ['uz', 'ru', 'us', 'kz'],
    separateDialCode: true,
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
  });
  // Make iti global so lang.js can access it
  window.iti = iti;
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // FormSubmit AJAX endpoint works better with /ajax/ prefix
    const ajaxUrl = contactForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/");

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';
    formStatus.innerHTML = 'Submitting your message...';
    formStatus.style.color = 'var(--primary)';

    try {
      const response = await fetch(ajaxUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        formStatus.innerHTML = '✅ Message sent successfully! I will get back to you soon.';
        formStatus.style.color = '#22c55e';
        contactForm.reset();
        submitBtn.innerHTML = 'Sent';
      } else {
        const result = await response.json();
        formStatus.innerHTML = '❌ Oops! ' + (result.message || 'There was a problem submitting your form.');
        formStatus.style.color = '#ef4444';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send';
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      formStatus.innerHTML = '❌ Oops! Connection error. Please try again later.';
      formStatus.style.color = '#ef4444';
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send';
    }
  });
}

// Back to Top Logic
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
