// Shared JavaScript for Eliana website

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('open');
    });
    // Close menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  // Set current year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  // ===================== STATS COUNT-UP ANIMATION =====================
function animateNumbers() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const originalText = stat.innerText;
    const numberMatch = originalText.match(/\d+/);
    
    if (numberMatch) {
      const targetNumber = parseInt(numberMatch[0]);
      const hasPlus = originalText.includes('+');
      const hasSlash = originalText.includes('/');
      
      let current = 0;
      const duration = 1500; // 1.5 seconds
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = targetNumber / steps;
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          current = targetNumber;
          let finalText = Math.floor(current);
          if (hasPlus) finalText += '+';
          if (hasSlash) finalText += '/7';
          stat.innerText = finalText;
          clearInterval(counter);
        } else {
          let displayValue = Math.floor(current);
          if (hasPlus) displayValue += '+';
          if (hasSlash) displayValue += '/7';
          stat.innerText = displayValue;
        }
      }, stepTime);
    }
  });
}

// Trigger count-up when stats come into view
const statsSection = document.querySelector('.stats');
let animated = false;

if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateNumbers();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(statsSection);
}

  // ===================== WHATSAPP CHAT BUTTON =====================
document.addEventListener('DOMContentLoaded', function() {
  const whatsappButton = document.getElementById('whatsappButton');
  
  // Client's WhatsApp number (without + or spaces)
  const phoneNumber = '14389890714';
  const welcomeMessage = 'Hello! I would like to learn more about Eliana Home Care & Staffing.';
  
  if (whatsappButton) {
    whatsappButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const encodedMessage = encodeURIComponent(welcomeMessage);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    });
  }
});

  // Share button functionality (cross-browser)
  const shareBtn = document.getElementById('shareBtn');
  const shareFeedback = document.getElementById('shareFeedback');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const url = window.location.href;
      const title = document.title;
      // Check if native share is available (mobile)
      if (navigator.share) {
        navigator.share({
          title: title,
          text: 'Check out this job opportunity at Eliana Home Care & Staffing',
          url: url
        }).catch((err) => {
          if (err.name !== 'AbortError') {
            fallbackShare(url, title);
          }
        });
      } else {
        fallbackShare(url, title);
      }
    });
  }

  function fallbackShare(url, title) {
    // Fallback for desktop: copy link to clipboard
    navigator.clipboard.writeText(url).then(() => {
      if (shareFeedback) {
        shareFeedback.textContent = '✓ Link copied to clipboard!';
        setTimeout(() => {
          shareFeedback.textContent = '';
        }, 3000);
      } else {
        alert('Link copied to clipboard: ' + url);
      }
    }).catch(() => {
      alert('Share this link: ' + url);
    });
  }
// Multi-step form handling (for job application pages)
const formContainer = document.querySelector('.multi-step-form');
if (formContainer) {
  const steps = document.querySelectorAll('.form-step');
  const indicators = document.querySelectorAll('.step-indicator');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const submitBtn = document.getElementById('submitBtn');
  let currentStep = 1;
  const totalSteps = steps.length;

  function updateStep(step) {
    // Hide all steps
    steps.forEach(s => s.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));
    // Show current step
    const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
    if (targetStep) targetStep.classList.add('active');
    const targetIndicator = document.querySelector(`.step-indicator[data-step="${step}"]`);
    if (targetIndicator) targetIndicator.classList.add('active');

    // Show/hide navigation buttons
    if (step === 1) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'inline-flex';
    }
    if (step === totalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }
    currentStep = step;
  }

  function validateStep(step) {
    const stepDiv = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredFields = stepDiv.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#dc2626';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    // Special case for checkbox in step 3
    const checkbox = stepDiv.querySelector('input[type="checkbox"][required]');
    if (checkbox && !checkbox.checked) {
      checkbox.style.outline = '1px solid #dc2626';
      valid = false;
    } else if (checkbox) {
      checkbox.style.outline = '';
    }
    if (!valid) {
      alert('Please fill all required fields before continuing.');
    }
    return valid;
  }

  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      updateStep(currentStep + 1);
    }
  });
  prevBtn.addEventListener('click', () => {
    updateStep(currentStep - 1);
  });

  // Handle final submit
  const jobForm = document.getElementById('jobApplicationForm');
  if (jobForm) {
    jobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateStep(totalSteps)) return;
      // Simulate submission
      alert('Application submitted! We will contact you within 48 hours.');
      jobForm.reset();
      document.getElementById('formSuccess').style.display = 'block';
      // Optionally reset form steps
      updateStep(1);
    });
  }
}

  // Form handler function
  function handleFormSubmit(formId, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#dc2626';
          isValid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (!isValid) {
        alert('Please fill in all required fields.');
        return;
      }
      // Simulate submission (replace with actual fetch)
      alert(successMessage);
      form.reset();
      const successDiv = document.getElementById('formSuccess');
      if (successDiv) successDiv.style.display = 'block';
    });
  }

  handleFormSubmit('careRequestForm', 'Thank you! A Care Manager will call you within 1 business hour.');
  handleFormSubmit('staffRequestForm', 'Thanks! Our staffing team will reach out the same business day.');
  handleFormSubmit('jobApplicationForm', 'Application received! We\'ll contact you within 48 hours.');
});