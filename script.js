document.addEventListener("DOMContentLoaded", function() {
    // ==================== MOBILE NAVIGATION ====================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    hamburger.addEventListener('click', function() {
        console.log('Hamburger clicked!');
        toggleMobileMenu();
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // ==================== SCROLL TO TOP ====================
    const scrollTopBtn = document.getElementById('scrollTop');
    
    function handleScroll() {
        scrollTopBtn.classList.toggle('active', window.pageYOffset > 300);
    }
    
    window.addEventListener('scroll', handleScroll);
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==================== SMOOTH SCROLLING ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });

    // ==================== SECTION OBSERVER ====================
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                section.classList.add('show');
                sectionObserver.unobserve(section); // Stop observing after shown
                
                // Highlight active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.toggle('active-nav', 
                        link.getAttribute('href') === `#${section.id}`);
                });
                
                // Trigger specific section animations
                const animationFunctions = {
                    'home': animateHomeSection,
                    'about': animateAboutSection,
                    'services': animateServicesSection,
                    'skills': animateSkillsSection,
                    'projects': animateProjectsSection,
                    'certifications': animateCertificationsSection,
                    'contact': animateContactSection
                };
                
                const animationFn = animationFunctions[section.id];
                if (animationFn && typeof animationFn === 'function') {
                    animationFn();
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // ==================== SECTION ANIMATIONS ====================
    function animateHomeSection() {
        animateElementsSequentially('.home-content h3, .home-content h1, .home-content p, .social-icon');
    }

    function animateAboutSection() {
        const aboutImg = document.querySelector('.about-img img');
        if (aboutImg) {
            aboutImg.style.animationPlayState = 'running';
        }
        animateElementsSequentially('.about-content h1, .about-content h2, .about-content p, .open-resume');
    }

    function animateServicesSection() {
        animateElementsSequentially('.service-box', 200);
    }

    function animateSkillsSection() {
        document.querySelectorAll('.skill-level').forEach(level => {
            if (!level.style.width) {
                level.style.width = level.dataset.level + '%';
            }
        });
    }

    function animateProjectsSection() {
        animateElementsSequentially('.project-card', 200);
    }

    function animateCertificationsSection() {
        animateElementsSequentially('.certificate-item', 200);
    }

    function animateContactSection() {
        animateElementsSequentially('.contact-form input, .contact-form textarea, .contact-form button', 150);
    }

    // Helper function for sequential animations
    function animateElementsSequentially(selector, delay = 300) {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.style.willChange = 'transform, opacity';
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                // Remove will-change after animation completes
                setTimeout(() => el.style.willChange = 'auto', delay);
            }, index * delay);
        });
    }

    // ==================== FORM HANDLING ====================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Basic form validation
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                alert('Please fill in all fields');
                return;
            }
            
            if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
                alert('Please enter a valid email address');
                return;
            }
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Simulate form submission (replace with actual fetch)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                alert(`Thank you, ${formData.get('name')}! Your message has been sent.`);
                this.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Error sending message. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // ==================== HOVER EFFECTS ====================
    function setupHoverEffect(selector, enterStyles, leaveStyles) {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('mouseenter', () => {
                Object.assign(element.style, enterStyles);
            });
            element.addEventListener('mouseleave', () => {
                Object.assign(element.style, leaveStyles);
            });
        });
    }

    setupHoverEffect('.project-card', {
        transform: 'scale(1.03)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    }, {
        transform: 'scale(1)',
        boxShadow: ''
    });

    setupHoverEffect('.service-box', {
        transform: 'translateY(-10px)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
    }, {
        transform: 'translateY(0)',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    });

    // ==================== RIPPLE EFFECT ====================
    document.querySelectorAll('[data-ripple]').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });

    // ==================== INITIAL ANIMATIONS ====================
    function runInitialAnimations() {
        const visibleSection = document.querySelector('section.show') || 
                             document.querySelector('section');
        
        if (visibleSection) {
            const animationFunctions = {
                'home': animateHomeSection,
                'about': animateAboutSection,
                'services': animateServicesSection,
                'skills': animateSkillsSection,
                'projects': animateProjectsSection,
                'certifications': animateCertificationsSection,
                'contact': animateContactSection
            };
            
            const animationFn = animationFunctions[visibleSection.id];
            if (animationFn && typeof animationFn === 'function') {
                animationFn();
            }
        }
    }

    // Run after a short delay to allow CSS to load
    setTimeout(runInitialAnimations, 100);

    // ==================== PERFORMANCE OPTIMIZATIONS ====================
    // Debounce scroll events
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            // Handle scroll-end actions here if needed
        }, 100);
    }, false);

    // Preload important images
    function preloadImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }
    
    // Run after main content loads
    setTimeout(preloadImages, 2000);
});