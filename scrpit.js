// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.getElementById('navbar');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
    icon.textContent = mobileMenu.classList.contains('active') ? 'close' : 'menu';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Search functionality
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        alert('الرجاء إدخال اسم السيارة للبحث');
        return;
    }
    
    const carCards = document.querySelectorAll('.car-card');
    let found = false;
    
    carCards.forEach(card => {
        const carName = card.getAttribute('data-name').toLowerCase();
        if (carName.includes(searchTerm)) {
            card.style.display = 'flex';
            found = true;
            // Scroll to first match
            if (!found) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            card.style.display = 'none';
        }
    });
    
    if (!found) {
        alert('لم يتم العثور على نتائج. جرب البحث بكلمات أخرى.');
        carCards.forEach(card => card.style.display = 'flex');
    }
}

// Allow search on Enter key
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Fleet navigation
function scrollFleet(direction) {
    const fleetGrid = document.getElementById('fleetGrid');
    const scrollAmount = 400;
    
    if (direction === 'next') {
        fleetGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        fleetGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.car-card, .offer-card, .about-card').forEach(el => {
    observer.observe(el);
});

// Special Offers Carousel Functionality
const offersSlider = document.getElementById('offersSlider');
const offersArrowLeft = document.getElementById('offersArrowLeft');
const offersArrowRight = document.getElementById('offersArrowRight');
const offersIndicators = document.querySelectorAll('.carousel-indicators .indicator');

console.log('🎪 Carousel Init:', {
    slider: !!offersSlider,
    arrowLeft: !!offersArrowLeft,
    arrowRight: !!offersArrowRight,
    indicators: offersIndicators.length
});

if (offersSlider) {
    function getScrollAmount() {
        const offerItems = document.querySelectorAll('.offer-item');
        if (offerItems.length === 0) return 0;
        
        const cardWidth = offerItems[0].offsetWidth;
        const computedGap = window.getComputedStyle(offersSlider).gap;
        let gap = 0;
        
        if (computedGap && computedGap !== 'normal') {
            gap = parseInt(computedGap) || 0;
        }
        
        const scrollAmount = cardWidth + gap;
        console.log('📏 Scroll Amount:', { cardWidth, gap, total: scrollAmount });
        return scrollAmount;
    }

    function updateIndicators() {
        const scrollLeft = offersSlider.scrollLeft;
        const scrollAmount = getScrollAmount();
        const activeIndex = Math.round(scrollLeft / scrollAmount);
        const totalCards = document.querySelectorAll('.offer-item').length;
        
        offersIndicators.forEach((indicator, index) => {
            const isActive = index === (activeIndex % totalCards);
            indicator.classList.toggle('active', isActive);
        });
    }

    if (offersArrowLeft) {
        offersArrowLeft.addEventListener('click', () => {
            console.log('⬅️ Left Arrow Clicked - Scroll Right');
            const scrollAmount = getScrollAmount();
            offersSlider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(updateIndicators, 300);
        });
    }

    if (offersArrowRight) {
        offersArrowRight.addEventListener('click', () => {
            console.log('➡️ Right Arrow Clicked - Scroll Left');
            const scrollAmount = getScrollAmount();
            offersSlider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(updateIndicators, 300);
        });
    }

    // Indicator click functionality
    offersIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            console.log('🔘 Indicator Clicked:', index);
            const scrollAmount = getScrollAmount();
            const targetScroll = scrollAmount * index;
            offersSlider.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
            setTimeout(updateIndicators, 300);
        });
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    offersSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    offersSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            console.log('👆 Swipe Right');
            offersArrowRight?.click();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            console.log('👆 Swipe Left');
            offersArrowLeft?.click();
        }
    }

    // Update indicators on scroll (for manual scrolling)
    offersSlider.addEventListener('scroll', () => {
        updateIndicators();
    });

    // Initialize indicators after a small delay to ensure elements are loaded
    setTimeout(updateIndicators, 100);
}

// Observer for offers section animation
const offersSection = document.querySelector('.special-offers-section');
if (offersSection) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    sectionObserver.observe(offersSection);
}

// Console welcome message
console.log('%c🏜️ مرحباً بك في قيلات أجا', 'font-size: 20px; font-weight: bold; color: #cf5702;');
console.log('%cتجربة صحراوية فاخرة', 'font-size: 14px; color: #e8dccd;');