document.addEventListener('DOMContentLoaded', function() {
    const downloadForm = document.getElementById('download-form');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const successMessage = document.getElementById('success-message');
    
    downloadForm.addEventListener('submit', function(e) {
        // Don't prevent default form submission - let Netlify handle it
        // But we'll still validate email format
        
        // Validate email
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            e.preventDefault(); // Prevent submission only if validation fails
            emailError.style.display = 'block';
            return;
        }
        
        emailError.style.display = 'none';
        
        // For direct form submission to Netlify, we don't need to manually show success
        // But for local testing, we can add this event listener
        
        // Note: In production with Netlify, this code won't actually run since
        // the page will be redirected by Netlify after form submission
        
        // This is mainly for local testing
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
            e.preventDefault();
            downloadForm.reset();
            successMessage.style.display = 'block';
        }
    });
    
    // Clear error on input
    emailInput.addEventListener('input', function() {
        emailError.style.display = 'none';
    });
});

if (document.getElementById('download-form')) {
    document.getElementById('download-form').addEventListener('submit', function(e) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        e.preventDefault();
        // Simulate form submission locally
        window.location.href = '/success.html';
      }
    });
  }