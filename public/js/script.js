document.addEventListener('DOMContentLoaded', function () {

    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');

    hamburgerToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    sidebarClose.addEventListener('click', function() {
        sidebar.classList.remove('open');
    });
    document.addEventListener('click', function (e) {
        if (!sidebar.contains(e.target) && !hamburgerToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    
    const navLinks = document.querySelectorAll('a[href^="#"], .sidebar-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 50, // Adjust for navbar height
                behavior: 'smooth'
            });
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    const form = document.getElementById('contactForm');
    const successToast = document.getElementById('successToast');
    const errorToast = document.getElementById('errorToast');
    const backButton = document.getElementById('backButton');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();  // Prevent form from redirecting or refreshing the page
  
      const formData = new FormData(form);
      const data = new URLSearchParams(formData);
  
      try {
        const response = await fetch('/contact', {
          method: 'POST',
          body: data,
        });
  
        const result = await response.json();
        
        if (result.success) {
          // Show success toast
          successToast.classList.add('show');
          
          // Reset form after successful submission
          form.reset();
  
          // Hide toast after 3 seconds
          setTimeout(() => successToast.classList.remove('show'), 3000);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error sending form data:', error);
        
        // Show error toast if submission fails
        errorToast.classList.add('show');
        setTimeout(() => errorToast.classList.remove('show'), 3000);
      }
    });
});