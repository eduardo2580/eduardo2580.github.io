function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        navMenu.classList.remove('active');
    }
});

// Handle dropdown toggles on mobile
document.querySelectorAll('.nav-menu > li > a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const parent = this.parentElement;
            const hasDropdown = parent.querySelector('.dropdown-menu');
            
            if (hasDropdown) {
                e.preventDefault();
                parent.classList.toggle('active');
            }
        }
    });
});

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
  
  // Animate notice paragraph
  const noticeText = document.querySelector('.notice');
  if (noticeText) {
    noticeText.classList.add('slide-in');
  }
  
  // Animate details elements
  const detailsElements = document.querySelectorAll('details');
  
  // Add initial classes
  detailsElements.forEach((details, index) => {
    details.classList.add('details-animate');
    details.style.transitionDelay = (index * 100) + 'ms';
    
    // Add animation to summary elements
    const summary = details.querySelector('summary');
    if (summary) {
      summary.classList.add('summary-animate');
      
      // Add hover effect to summary elements
      summary.addEventListener('mouseenter', function() {
        this.classList.add('summary-hover');
      });
      
      summary.addEventListener('mouseleave', function() {
        this.classList.remove('summary-hover');
      });
    }
  });
  
  // Function to animate details when they come into view
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
    detailsElements.forEach(details => {
      if (isInViewport(details) && !details.classList.contains('details-visible')) {
        details.classList.add('details-visible');
      }
    });
  }
  
  // Run once on load
  animateOnScroll();
  
  // Then on scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Add click animations to details elements
  detailsElements.forEach(details => {
    details.addEventListener('toggle', function() {
      const content = this.querySelector('ul');
      if (content) {
        if (this.open) {
          // When opening, animate the content
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          
          setTimeout(() => {
            content.classList.add('content-visible');
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
          }, 10);
        } else {
          // When closing, animate the content away
          content.classList.remove('content-visible');
          content.style.maxHeight = '0';
          content.style.opacity = '0';
        }
      }
    });
  });
  
  // Enhance list items with subtle animations
  const listItems = document.querySelectorAll('details ul li');
  listItems.forEach((item, index) => {
    item.classList.add('list-item-animate');
    item.style.transitionDelay = (index * 50) + 'ms';
  });
  
  // Footer animation
  const footerElements = document.querySelectorAll('footer p');
  footerElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('fade-up');
    }, 100 * index);
  });
});
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