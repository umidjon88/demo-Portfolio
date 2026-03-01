/**
 * Premium Button Animations
 * Includes Ripple Effect and Magnetic Feel
 */

document.addEventListener('DOMContentLoaded', () => {
  initRippleEffect();
});

function initRippleEffect() {
  // Target all premium interactive elements
  const selectors = [
    '.btn-primary',
    '.btn-outline',
    '.lang-btn',
    '.theme-toggle',
    '.mobile-menu-toggle',
    '.t-btn',
    '.faq-toggle',
    '#back-to-top',
    '.portfolio-link',
    '.footer-social a',
    '.nav-links a'
  ];

  const elements = document.querySelectorAll(selectors.join(', '));

  elements.forEach(el => {
    el.classList.add('ripple-container');

    el.addEventListener('mousedown', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      // Positioning the ripple at the click point
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      // Remove ripple after animation finishes
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  initMagneticEffect();
  initTestAlert();
}

function initTestAlert() {
  const alertOverlay = document.getElementById('testAlert');
  const closeBtn = document.getElementById('closeAlert');

  // Check if alert was already shown in this session
  if (sessionStorage.getItem('premiumAlertShown')) {
    return;
  }

  if (alertOverlay && closeBtn) {
    // Show after a short delay
    setTimeout(() => {
      alertOverlay.classList.add('active');
      // Set the flag so it doesn't show again this session (until tab/window is closed)
      sessionStorage.setItem('premiumAlertShown', 'true');
      // Re-run lucide icons if needed
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 800);

    closeBtn.addEventListener('click', () => {
      alertOverlay.classList.remove('active');
    });

    // Close on overlay click
    alertOverlay.addEventListener('click', (e) => {
      if (e.target === alertOverlay) {
        alertOverlay.classList.remove('active');
      }
    });
  }
}

function initMagneticEffect() {
  const magneticElements = document.querySelectorAll('.btn-primary, .theme-toggle, .mobile-menu-toggle, .logo svg, .footer-social a');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Move the element slightly towards the cursor (strength of 15% - 25%)
      this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      if (this.classList.contains('btn-primary')) {
        this.style.transform += ' translateY(-4px) scale(1.02)';
      }
    });

    el.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
}
