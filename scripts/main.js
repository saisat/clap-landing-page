/**
 * Project Tribe Landing Page - Main JavaScript
 * Pure vanilla JavaScript (ES6+) for header scroll behavior and interactions
 */

// ========================================
// HEADER SCROLL BEHAVIOR
// ========================================

/**
 * Implements sticky header show/hide behavior based on scroll direction
 * Header hides when scrolling down and shows when scrolling up
 */
(function initHeaderScrollBehavior() {
  const header = document.getElementById('header');

  if (!header) {
    console.warn('Header element not found');
    return;
  }

  let lastScrollY = window.scrollY;
  let ticking = false;

  /**
   * Updates header visibility based on scroll direction
   */
  function updateHeaderVisibility() {
    const currentScrollY = window.scrollY;

    // Show header when at top of page
    if (currentScrollY <= 100) {
      header.classList.remove('header--hidden');
    }
    // Hide header when scrolling down
    else if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.classList.add('header--hidden');
    }
    // Show header when scrolling up
    else if (currentScrollY < lastScrollY) {
      header.classList.remove('header--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  /**
   * Throttle scroll events using requestAnimationFrame
   */
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderVisibility);
      ticking = true;
    }
  }

  // Listen for scroll events
  window.addEventListener('scroll', onScroll, { passive: true });

  console.log('Header scroll behavior initialized');
})();

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

/**
 * Implements smooth scrolling for all anchor links
 * Enhances native scroll-behavior: smooth with custom behavior
 */
(function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#" or empty
      if (!href || href === '#') {
        return;
      }

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        // Smooth scroll to target
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update URL without jumping
        history.pushState(null, null, href);

        // Set focus for accessibility
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  console.log(`Smooth scroll initialized for ${anchorLinks.length} anchor links`);
})();

// ========================================
// MOBILE MENU TOGGLE (Placeholder)
// ========================================

/**
 * Handles mobile menu toggle functionality
 * Note: Mobile menu navigation will be implemented in Phase 2
 */
(function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');

  if (!menuToggle) {
    return;
  }

  menuToggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);

    // Toggle menu visibility (to be implemented with actual menu in Phase 2)
    console.log('Mobile menu toggle clicked');
  });

  console.log('Mobile menu toggle initialized');
})();

// ========================================
// INTERSECTION OBSERVER (Scroll Animations)
// ========================================

/**
 * Observes sections and adds animation classes when they enter viewport
 * Provides progressive disclosure of content
 */
(function initScrollAnimations() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    console.warn('Intersection Observer not supported');
    return;
  }

  const sections = document.querySelectorAll('section');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of section is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section--visible');
        // Optionally unobserve after animation to improve performance
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  console.log(`Scroll animations initialized for ${sections.length} sections`);
})();

// ========================================
// KEYBOARD NAVIGATION ENHANCEMENTS
// ========================================

/**
 * Enhances keyboard navigation experience
 * Handles escape key for mobile menu and other interactions
 */
(function initKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
      const menuToggle = document.getElementById('mobile-menu-toggle');
      if (menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    }
  });

  console.log('Keyboard navigation initialized');
})();

// ========================================
// PERFORMANCE MONITORING (Development)
// ========================================

/**
 * Logs page load performance metrics to console
 * Useful for development and optimization
 */
(function logPerformanceMetrics() {
  window.addEventListener('load', () => {
    // Use Performance API to get timing metrics
    if ('performance' in window) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      console.group('Performance Metrics');
      console.log(`Page Load Time: ${pageLoadTime}ms`);
      console.log(`Connection Time: ${connectTime}ms`);
      console.log(`Render Time: ${renderTime}ms`);
      console.groupEnd();
    }
  });
})();

// ========================================
// DOCUMENT READY
// ========================================

/**
 * Logs when all scripts have been initialized
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Project Tribe Landing Page - All scripts initialized successfully');
});
