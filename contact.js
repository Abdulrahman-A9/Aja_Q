// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactAttachment = document.getElementById('contactAttachment');
    const fileInputLabel = document.querySelector('.file-input-label');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');

    // File input label update
    if (contactAttachment) {
        contactAttachment.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name;
            if (fileName) {
                fileInputLabel.innerHTML = `
                    <span class="material-symbols-outlined">check_circle</span>
                    ${fileName}
                `;
                fileInputLabel.style.color = '#4caf50';
            }
        });
    }

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        if (!validateContactForm()) {
            errorMessage.style.display = 'flex';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
            return;
        }

        // Collect form data
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value,
            timestamp: new Date().toISOString()
        };

        // Simulate form submission
        console.log('Contact form data:', formData);

        // Save to localStorage for demo
        let contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        contactMessages.push(formData);
        localStorage.setItem('contactMessages', JSON.stringify(contactMessages));

        // Show success message
        successMessage.style.display = 'flex';
        
        // Reset form
        contactForm.reset();
        fileInputLabel.innerHTML = `
            <span class="material-symbols-outlined">attach_file</span>
            اختر ملف
        `;
        fileInputLabel.style.color = '';

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);

        // Scroll to message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    function validateContactForm() {
        const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value || (input.type === 'email' && !isValidEmail(input.value))) {
                isValid = false;
                input.style.borderColor = '#ef4444';
                input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                
                setTimeout(() => {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                }, 3000);
            }
        });

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
