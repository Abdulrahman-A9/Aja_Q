// Booking Form Multi-Step Functionality
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const formSections = document.querySelectorAll('.form-section');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    let currentStep = 1;
    const totalSteps = formSections.length;

    // Package prices
    const packagePrices = {
        weekend: 2150,
        luxury: 5500,
        family: 3200,
        romantic: 6500
    };

    const packageNames = {
        weekend: 'رحلة نهاية الأسبوع',
        luxury: 'تجربة الفخامة',
        family: 'مغامرة عائلية',
        romantic: 'رومانسية الصحراء'
    };

    const packageDescriptions = {
        weekend: '3 أيام مغامرة',
        luxury: 'مع سائق خبير',
        family: 'آمنة وممتعة',
        romantic: 'تحت النجوم'
    };

    // Show/Hide form sections
    function showStep(step) {
        formSections.forEach((section, index) => {
            section.classList.remove('active');
            if (index === step - 1) {
                section.classList.add('active');
            }
        });

        // Update button visibility
        if (step === 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        } else if (step === totalSteps) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }

        updateSummary();
    }

    // Update summary sidebar
    function updateSummary() {
        const selectedPackage = document.querySelector('input[name="package"]:checked');
        const startDate = document.getElementById('startDate').value;
        const duration = document.getElementById('duration').value;
        const guestCount = document.getElementById('guestCount').value;

        if (selectedPackage) {
            const packageValue = selectedPackage.value;
            const packageName = packageNames[packageValue];
            const packagePrice = packagePrices[packageValue];
            const packageDesc = packageDescriptions[packageValue];

            document.getElementById('summaryPackageName').textContent = packageName;
            document.getElementById('summaryPackageDesc').textContent = packageDesc;

            // Calculate prices
            const totalPrice = packagePrice * (duration || 1);
            document.getElementById('pricePackage').textContent = packagePrice.toLocaleString() + ' ر.س';
            document.getElementById('priceDays').textContent = '×' + (duration || '1');
            document.getElementById('totalPrice').textContent = totalPrice.toLocaleString() + ' ر.س';
        }

        if (startDate && duration) {
            document.getElementById('summaryStart').textContent = new Date(startDate).toLocaleDateString('ar-SA');
            
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + parseInt(duration) - 1);
            document.getElementById('summaryEnd').textContent = endDate.toLocaleDateString('ar-SA');
            
            document.getElementById('summaryDays').textContent = duration + ' أيام';
            document.getElementById('summaryDaysCount').textContent = duration;
        }

        if (startDate && duration) {
            document.getElementById('summaryPeriod').textContent = 
                new Date(startDate).toLocaleDateString('ar-SA') + ' - ' +
                new Date(new Date(startDate).setDate(new Date(startDate).getDate() + parseInt(duration) - 1)).toLocaleDateString('ar-SA');
        }

        if (guestCount) {
            const guestText = guestCount === '7' ? '7 أشخاص أو أكثر' : guestCount + ' أشخاص';
            document.getElementById('summaryGuests').textContent = guestText;
        }
    }

    // Update summary on input change
    document.querySelectorAll('input[name="package"], #startDate, #duration, #guestCount').forEach(input => {
        input.addEventListener('change', updateSummary);
    });

    // Previous button
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            window.scrollTo(0, 0);
        }
    });

    // Next button
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
                window.scrollTo(0, 0);
            }
        }
    });

    // Validate form step
    function validateStep(step) {
        const activeSection = document.querySelector(`.form-section[data-step="${step}"]`);
        const inputs = activeSection.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.style.borderColor = '#ef4444';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 3000);
            }
        });

        return isValid;
    }

    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateStep(currentStep)) {
            // Collect form data
            const formData = {
                package: document.querySelector('input[name="package"]:checked').value,
                startDate: document.getElementById('startDate').value,
                duration: document.getElementById('duration').value,
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                guestCount: document.getElementById('guestCount').value,
                notes: document.getElementById('notes').value,
                timestamp: new Date().toISOString()
            };

            // Save to localStorage
            localStorage.setItem('bookingData', JSON.stringify(formData));

            // Show success message
            showBookingSuccess(formData);
        }
    });

    function showBookingSuccess(data) {
        const successHtml = `
            <div class="booking-success" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                z-index: 1000;
                text-align: center;
                max-width: 500px;
                color: #181410;
            ">
                <div style="font-size: 64px; margin-bottom: 20px;">✓</div>
                <h2 style="margin: 20px 0; color: #cf5702;">تم استقبال الحجز بنجاح!</h2>
                <p style="margin: 10px 0; color: #666;">شكراً لاختيارك قيلات أجا</p>
                <div style="
                    background: #f5f5f5;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: right;
                ">
                    <p><strong>رقم الحجز:</strong> BK-${Date.now()}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
                    <p><strong>سيتم التأكيد قريباً عبر البريد الإلكتروني والرسالة النصية</strong></p>
                </div>
                <button onclick="window.location.href='index2.html'" style="
                    background: #cf5702;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 20px;
                ">العودة للرئيسية</button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', successHtml);
        
        // Disable form
        bookingForm.style.display = 'none';
    }

    // Initialize
    showStep(currentStep);
});
