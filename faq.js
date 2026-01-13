// FAQ Accordion and Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const faqSearch = document.getElementById('faqSearch');
    const faqGroups = document.querySelectorAll('.faq-group');

    // Accordion functionality
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isOpen = faqItem.classList.contains('active');

            // Close all other open items
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            // Toggle current item
            if (isOpen) {
                faqItem.classList.remove('active');
                faqAnswer.style.maxHeight = '0';
            } else {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });

    // Category filter
    faqCategoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;

            // Update active button
            faqCategoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter groups
            faqGroups.forEach(group => {
                if (category === 'all' || group.dataset.category === category) {
                    group.style.display = 'block';
                    setTimeout(() => group.style.opacity = '1', 10);
                } else {
                    group.style.opacity = '0';
                    setTimeout(() => group.style.display = 'none', 300);
                }
            });

            // Close all open items
            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = '0';
            });
        });
    });

    // Search functionality
    faqSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();

        faqGroups.forEach(group => {
            let hasMatch = false;
            const faqItems = group.querySelectorAll('.faq-item');

            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question span').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    hasMatch = true;
                } else {
                    item.style.display = 'none';
                }
            });

            if (hasMatch || searchTerm === '') {
                group.style.display = 'block';
                group.style.opacity = '1';
            } else {
                group.style.opacity = '0';
                setTimeout(() => group.style.display = 'none', 300);
            }
        });
    });

    // Add smooth transitions
    faqGroups.forEach(group => {
        group.style.transition = 'opacity 0.3s ease-in-out';
    });

    document.querySelectorAll('.faq-item').forEach(item => {
        item.style.transition = 'all 0.3s ease-in-out';
    });

    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.style.transition = 'max-height 0.3s ease-in-out';
        answer.style.overflow = 'hidden';
        answer.style.maxHeight = '0';
    });
});
