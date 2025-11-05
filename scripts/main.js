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
// WAITLIST FORM VALIDATION
// ========================================

/**
 * Handles waitlist form validation with real-time feedback
 * Provides client-side validation for all form fields
 */
(function initFormValidation() {
  const form = document.getElementById('waitlist-form');

  if (!form) {
    console.warn('Waitlist form not found');
    return;
  }

  // Form field elements
  const emailField = document.getElementById('email');
  const nameField = document.getElementById('name');
  const roleField = document.getElementById('role');
  const experienceField = document.getElementById('experience');
  const goalField = document.getElementById('goal');
  const successMessage = document.getElementById('form-success');

  // Error message elements
  const emailError = document.getElementById('email-error');
  const nameError = document.getElementById('name-error');
  const roleError = document.getElementById('role-error');
  const experienceError = document.getElementById('experience-error');
  const goalError = document.getElementById('goal-error');

  /**
   * Validates email format using regex
   */
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates individual field and displays error message
   */
  function validateField(field, errorElement, validationRules) {
    const value = field.value.trim();
    let errorMessage = '';

    // Check if field is required and empty
    if (validationRules.required && !value) {
      errorMessage = validationRules.requiredMessage || 'This field is required';
    }
    // Check minimum length
    else if (validationRules.minLength && value.length < validationRules.minLength) {
      errorMessage = validationRules.minLengthMessage || `Minimum ${validationRules.minLength} characters required`;
    }
    // Check email format
    else if (validationRules.email && !validateEmail(value)) {
      errorMessage = validationRules.emailMessage || 'Please enter a valid email address';
    }

    // Update field and error display
    if (errorMessage) {
      field.setAttribute('aria-invalid', 'true');
      field.classList.add('form__input--error');
      errorElement.textContent = errorMessage;
      return false;
    } else {
      field.setAttribute('aria-invalid', 'false');
      field.classList.remove('form__input--error');
      errorElement.textContent = '';
      return true;
    }
  }

  /**
   * Validation rules for each field
   */
  const fieldValidations = {
    email: {
      field: emailField,
      error: emailError,
      rules: {
        required: true,
        email: true,
        requiredMessage: 'Email address is required',
        emailMessage: 'Please enter a valid email address'
      }
    },
    name: {
      field: nameField,
      error: nameError,
      rules: {
        required: true,
        minLength: 2,
        requiredMessage: 'Full name is required',
        minLengthMessage: 'Name must be at least 2 characters'
      }
    },
    role: {
      field: roleField,
      error: roleError,
      rules: {
        required: true,
        requiredMessage: 'Current role is required'
      }
    },
    experience: {
      field: experienceField,
      error: experienceError,
      rules: {
        required: true,
        requiredMessage: 'Please select your years of experience'
      }
    },
    goal: {
      field: goalField,
      error: goalError,
      rules: {
        required: true,
        requiredMessage: 'Please select your primary goal'
      }
    }
  };

  /**
   * Real-time validation on input/blur events
   */
  function setupRealTimeValidation() {
    Object.values(fieldValidations).forEach(({ field, error, rules }) => {
      // Validate on blur (when user leaves field)
      field.addEventListener('blur', () => {
        validateField(field, error, rules);
      });

      // Validate on input (as user types)
      field.addEventListener('input', () => {
        // Only validate if field has been touched (has error)
        if (field.getAttribute('aria-invalid') === 'true') {
          validateField(field, error, rules);
        }
      });
    });
  }

  /**
   * Validates entire form
   */
  function validateForm() {
    let isValid = true;

    Object.values(fieldValidations).forEach(({ field, error, rules }) => {
      const fieldValid = validateField(field, error, rules);
      if (!fieldValid) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Handles form submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const isValid = validateForm();

    if (!isValid) {
      // Focus first invalid field
      const firstInvalidField = form.querySelector('[aria-invalid="true"]');
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    // Form is valid - show success message
    showSuccessMessage();

    // Log form data (for development/debugging)
    const formData = {
      email: emailField.value.trim(),
      name: nameField.value.trim(),
      role: roleField.value.trim(),
      experience: experienceField.value,
      goal: goalField.value
    };

    console.log('Form submitted successfully:', formData);

    // TODO: Backend integration
    // In production, send data to backend API
    // Example: fetch('/api/waitlist', { method: 'POST', body: JSON.stringify(formData) })
  }

  /**
   * Shows success message and hides form
   */
  function showSuccessMessage() {
    // Hide form fields
    form.querySelectorAll('.form__field').forEach(field => {
      field.style.display = 'none';
    });
    form.querySelector('.form__submit').style.display = 'none';

    // Show success message
    successMessage.classList.add('visible');

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Initialize real-time validation
  setupRealTimeValidation();

  // Handle form submission
  form.addEventListener('submit', handleFormSubmit);

  console.log('Form validation initialized');
})();

// ========================================
// EXTERNAL LINK HANDLING
// ========================================

/**
 * Handles external links to open in new tab
 * Adds rel="noopener noreferrer" for security
 */
(function initExternalLinks() {
  const externalLinks = document.querySelectorAll('a[target="_blank"]');

  externalLinks.forEach(link => {
    // Ensure security attributes are set
    if (!link.getAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  console.log(`External link handling initialized for ${externalLinks.length} links`);
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
