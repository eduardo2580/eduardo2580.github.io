// Prevent right-click context menu
      document.addEventListener('contextmenu', function(e) {
          e.preventDefault();
          return false;
      });
      
      // Prevent image dragging and new window opening
      document.querySelectorAll('img').forEach(img => {
          img.oncontextmenu = e => e.preventDefault();
          img.ondragstart = e => e.preventDefault();
          img.setAttribute('draggable', false);
      });
      
      // Prevent text selection and copying
      document.addEventListener('copy', e => {
          e.clipboardData.setData('text/plain', 'Copying is disabled');
          e.preventDefault();
      });
      
      document.addEventListener('cut', e => {
          e.preventDefault();
      });
      
      document.addEventListener('paste', e => {
          e.preventDefault();
      });
      
      // Disable keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)
      document.addEventListener('keydown', e => {
          if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              return false;
          }
      });
      
      // Disable printing
      window.addEventListener('beforeprint', (e) => {
          e.preventDefault();
          window.close();
      });
      
      // Prevent frame embedding
      if (window.top !== window.self) {
          window.top.location = window.self.location;
      }
      
      // Add CSS to disable text selection
      const antiCopyStyle = document.createElement('style');
      antiCopyStyle.textContent = `
          * {
              user-select: none !important;
              -webkit-user-select: none !important;
              -moz-user-select: none !important;
              -ms-user-select: none !important;
          }
      `;
      document.head.appendChild(antiCopyStyle);
      
      // File: animations.js - Add this as a separate file and link it in your HTML
document.addEventListener('DOMContentLoaded', function() {
  // Only run animations if JavaScript is enabled
  document.body.classList.add('js-enabled');
  
  // Fade in the header elements sequentially
  const headerElements = document.querySelectorAll('header h1, header nav a');
  headerElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('fade-in');
    }, 100 * index);
  });
  
  // Subtle hover effects for navigation
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.classList.add('hover-effect');
    });
    
    link.addEventListener('mouseleave', function() {
      this.classList.remove('hover-effect');
    });
  });
  
  // Animate introduction paragraph
  const introText = document.querySelector('.notice');
  if (introText) {
    // Add a subtle slide-in effect
    introText.classList.add('slide-in');
    
    // Add a typing effect to the introduction text
    const text = introText.textContent;
    if (text.length > 0) {
      introText.textContent = '';
      introText.style.opacity = '1';
      let i = 0;
      const typingSpeed = 30; // milliseconds per character
      
      function typeWriter() {
        if (i < text.length) {
          introText.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, typingSpeed);
        }
      }
      
      // Start typing effect with a slight delay
      setTimeout(typeWriter, 800);
    }
  }
  
  // Subtle animation for section headings when they come into view
  const sectionHeadings = document.querySelectorAll('section h2');
  
  // Simple function to check if an element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Animate elements when they come into view
  function animateOnScroll() {
    sectionHeadings.forEach(heading => {
      if (isInViewport(heading) && !heading.classList.contains('animated')) {
        heading.classList.add('animated', 'slide-in-from-left');
      }
    });
  }
  
  // Run once on load
  animateOnScroll();
  
  // Then on scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Footer animation
  const footerElements = document.querySelectorAll('footer p');
  footerElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('fade-up');
    }, 100 * index);
  });
});