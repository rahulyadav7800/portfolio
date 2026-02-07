/**
 * Portfolio Website JavaScript
 * Features: Typing animation, smooth scrolling, scroll reveal, mobile navigation
 */

// ===== CONFIGURATION =====
const CONFIG = {
    typingSpeed: 100,
    deletingSpeed: 50,
    delayBetweenWords: 2000,
    scrollOffset: 100,
    skillAnimationDelay: 200
};

// ===== GLOBAL STATE =====
let currentWordIndex = 0;
let isDeleting = false;
let isTypingPaused = false;

// ===== DOM ELEMENTS =====
const elements = {
    typedText: document.getElementById('typed-text'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('nav-menu'),
    navbar: document.getElementById('navbar'),
    contactForm: document.getElementById('contact-form'),
    navLinks: document.querySelectorAll('.nav-link'),
    revealElements: document.querySelectorAll('.reveal-text, .reveal-left, .reveal-right, .reveal-up'),
    skillBars: document.querySelectorAll('.skill-progress')
};

// ===== TYPING ANIMATION =====
const words = [
    'Computer Science Student',
    'Full Stack Developer',
    'Problem Solver',
    'Tech Enthusiast'
];

class TypingAnimation {
    constructor(element, words, config) {
        this.element = element;
        this.words = words;
        this.config = config;
        this.currentWordIndex = 0;
        this.isDeleting = false;
        this.currentText = '';
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.currentText = currentWord.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = currentWord.substring(0, this.currentText.length + 1);
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.isDeleting ? this.config.deletingSpeed : this.config.typingSpeed;

        if (!this.isDeleting && this.currentText === currentWord) {
            typeSpeed = this.config.delayBetweenWords;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveNav();
    }

    bindEvents() {
        // Mobile menu toggle
        elements.hamburger?.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile menu when clicking on nav links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Scroll event for navbar styling and active nav update
        window.addEventListener('scroll', this.throttle(() => {
            this.updateNavbarOnScroll();
            this.updateActiveNav();
        }, 16));

        // Smooth scrolling for navigation links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });
    }

    toggleMobileMenu() {
        elements.hamburger.classList.toggle('active');
        elements.navMenu.classList.toggle('active');
        document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        elements.hamburger.classList.remove('active');
        elements.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateNavbarOnScroll() {
        if (window.scrollY > 50) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + CONFIG.scrollOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                elements.navLinks.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    }

    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// ===== SCROLL REVEAL ANIMATION =====
class ScrollReveal {
    constructor() {
        this.init();
    }

    init() {
        this.revealOnScroll();
        window.addEventListener('scroll', this.throttle(() => this.revealOnScroll(), 16));
    }

    revealOnScroll() {
        elements.revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// ===== SKILL BARS ANIMATION =====
class SkillBars {
    constructor() {
        this.animated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', this.throttle(() => this.checkSkillsInView(), 16));
    }

    checkSkillsInView() {
        if (this.animated) return;

        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const sectionTop = skillsSection.getBoundingClientRect().top;
        
        if (sectionTop < window.innerHeight - 200) {
            this.animateSkillBars();
            this.animated = true;
        }
    }

    animateSkillBars() {
        elements.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const percent = bar.getAttribute('data-percent');
                bar.style.width = percent + '%';
            }, index * CONFIG.skillAnimationDelay);
        });
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}
// ===== CONTACT FORM (FORMPREE WORKING VERSION) =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('.btn-submit');
        const formData = new FormData(this.form);

        // Loading ON
        this.setLoadingState(submitBtn, true);

        try {
            const response = await fetch(this.form.action, {
                method: this.form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showNotification(
                    "Message sent successfully! I’ll get back to you soon.",
                    "success"
                );
                this.form.reset();
            } else {
                throw new Error("Form submission failed");
            }
        } catch (error) {
            console.error(error);
            this.showNotification(
                "Something went wrong. Please try again.",
                "error"
            );
        } finally {
            // Loading OFF
            this.setLoadingState(submitBtn, false);
        }
    }

    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 4 sec
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});


// ===== PERFORMANCE OPTIMIZATION =====
class Performance {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalAssets();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalAssets() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardNavigation();
        this.addSkipLink();
        this.handleReducedMotion();
    }

    addKeyboardNavigation() {
        // Enhanced focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu on escape
                const nav = new Navigation();
                nav.closeMobileMenu();
            }
        });

        // Add focus-visible polyfill behavior
        document.addEventListener('mousedown', () => {
            document.body.classList.add('using-mouse');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        });
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            transition: top 0.3s;
            z-index: 10001;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    handleReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Disable animations for users who prefer reduced motion
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    if (elements.typedText) {
        new TypingAnimation(elements.typedText, words, CONFIG);
    }
    
    new Navigation();
    new ScrollReveal();
    new SkillBars();
    new ContactForm();
    new Performance();
    new Accessibility();

    // Add loading complete class
    document.body.classList.add('loaded');

    console.log('🚀 Portfolio website initialized successfully!');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// ===== LOADING PERFORMANCE =====
window.addEventListener('load', () => {
    // Hide loading spinner if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
});
