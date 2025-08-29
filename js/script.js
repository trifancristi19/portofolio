// Matrix Rain Animation - Performance Optimized
class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-2';
        this.canvas.style.opacity = '0.05';
        this.canvas.style.willChange = 'transform';
        document.body.appendChild(this.canvas);
        
        this.fontSize = 12;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = [];
        
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
        
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.floor(Math.random() * -100);
        }
        
        this.draw = this.draw.bind(this);
        this.resize = this.resize.bind(this);
        
        // Throttle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(this.resize, 100);
        });
        
        // Reduce animation frequency for better performance
        this.interval = setInterval(this.draw, 60);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.floor(Math.random() * -100);
        }
    }
    
    draw() {
        // Use requestAnimationFrame for better performance
        if (!this.animationFrame) {
            this.animationFrame = requestAnimationFrame(() => {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.ctx.fillStyle = '#0f0';
                this.ctx.font = `${this.fontSize}px monospace`;
                
                for (let i = 0; i < this.drops.length; i++) {
                    const text = this.chars[Math.floor(Math.random() * this.chars.length)];
                    
                    this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
                    
                    if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.98) {
                        this.drops[i] = 0;
                    }
                    
                    this.drops[i]++;
                }
                this.animationFrame = null;
            });
        }
    }
    
    destroy() {
        clearInterval(this.interval);
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.canvas.remove();
    }
}

// Terminal Text Animation
class TerminalText {
    constructor(element) {
        this.element = element;
        this.words = JSON.parse(this.element.getAttribute('data-words') || '["Hello, World!"]');
        this.speed = parseInt(this.element.getAttribute('data-speed') || '100');
        this.delay = parseInt(this.element.getAttribute('data-delay') || '1000');
        this.loop = this.element.hasAttribute('data-loop');
        this.cursor = this.element.hasAttribute('data-cursor');
        
        this.current = 0;
        this.isDeleting = false;
        this.text = '';
        
        if (this.cursor) {
            this.element.classList.add('terminal-cursor');
        }
        
        this.type();
    }
    
    type() {
        const current = this.current % this.words.length;
        const fullText = this.words[current];
        
        if (this.isDeleting) {
            this.text = fullText.substring(0, this.text.length - 1);
        } else {
            this.text = fullText.substring(0, this.text.length + 1);
        }
        
        this.element.textContent = this.text;
        
        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.text === fullText) {
            typeSpeed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            this.current++;
            typeSpeed = 500;
            
            if (!this.loop && this.current >= this.words.length) {
                return;
            }
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Intersection Observer for Section Animations - Optimized to prevent forced reflow
function createIntersectionObserver() {
    const sections = document.querySelectorAll('.section');
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        // Use requestAnimationFrame to batch DOM operations
        requestAnimationFrame(() => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        });
    }, options);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Enhanced Smooth Scrolling for Navigation
function setupEnhancedSmoothScrolling() {
    // Create scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);
    
    // Cache DOM measurements to prevent forced reflow
    let scrollTimeout;
    let cachedHeight = 0;
    
    // Cache height once on load
    function cacheHeight() {
        cachedHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    }
    
    // Update scroll indicator width - Optimized to prevent forced reflow
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                requestAnimationFrame(() => {
                    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    const scrolled = (winScroll / cachedHeight) * 100;
                    scrollIndicator.style.width = scrolled + '%';
                });
                scrollTimeout = null;
            }, 16); // ~60fps throttling
        }
    });
    
    // Cache height on load and resize
    cacheHeight();
    window.addEventListener('resize', cacheHeight, { passive: true });

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear any existing active classes
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (!targetElement) return;
            
            // Remove any existing highlight classes
            sections.forEach(section => {
                section.classList.remove('section-highlight');
            });
            
            // Get the sticky navigation height for proper offset calculation
            const navHeight = document.getElementById('main-nav').offsetHeight;
            
            // Calculate the target position with proper offset
            const targetOffset = targetElement.offsetTop;
            const scrollOffset = targetOffset - navHeight - 15; // 15px spacing below nav
            
            // Ensure we don't scroll past the top of the page
            const finalScrollOffset = Math.max(0, scrollOffset);
            
            // Debug logging (remove this after testing)
            console.log('Navigation height:', navHeight);
            console.log('Target offset:', targetOffset);
            console.log('Scroll offset:', scrollOffset);
            console.log('Final scroll:', finalScrollOffset);
            
            // Smooth scroll to target with proper offset
            window.scrollTo({
                top: finalScrollOffset,
                behavior: 'smooth'
            });
            
            // After scrolling is complete, add highlight effect
            setTimeout(() => {
                targetElement.classList.add('section-highlight');
                
                // Remove highlight class after animation completes
                setTimeout(() => {
                    targetElement.classList.remove('section-highlight');
                }, 1500);
            }, 500); // Slight delay to ensure scroll completes
        });
    });
}

// Matrix Code Rain
function createMatrixCodeRain() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-5';
    canvas.style.opacity = '0.1';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(canvas.width / 20);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = '15px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * 20, drops[i] * 20);
            
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Resize handler - Throttled to prevent forced reflow
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(() => {
                requestAnimationFrame(() => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                });
                resizeTimeout = null;
            }, 16); // ~60fps throttling
        }
    });
    
    return setInterval(draw, 50);
}

// Active Navigation Link - Optimized to prevent forced reflow
function setupActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Cache section measurements to prevent forced reflows
    let sectionCache = [];
    let lastScrollY = 0;
    let ticking = false;
    
    // Cache section positions once on load
    function cacheSectionPositions() {
        sectionCache = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop,
            height: section.clientHeight
        }));
    }
    
    // Update navigation without DOM queries
    function updateNavigation() {
        const scrollY = window.pageYOffset;
        let current = '';
        
        for (const section of sectionCache) {
            if (scrollY >= section.top - 200) {
                current = section.id;
            }
        }
        
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${current}`;
            if (isActive && !link.classList.contains('active')) {
                link.classList.add('active');
            } else if (!isActive && link.classList.contains('active')) {
                link.classList.remove('active');
            }
        });
        
        ticking = false;
    }
    
    // Throttled scroll handler using requestAnimationFrame
    function onScroll() {
        lastScrollY = window.pageYOffset;
        if (!ticking) {
            requestAnimationFrame(updateNavigation);
            ticking = true;
        }
    }
    
    // Cache positions on load and resize
    cacheSectionPositions();
    window.addEventListener('resize', cacheSectionPositions, { passive: true });
    
    // Use passive scroll listener for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
}

// Initialize Terminal Commands
function initTerminalCommands() {
    const commandElements = document.querySelectorAll('[data-terminal-command]');
    
    commandElements.forEach(element => {
        const command = element.getAttribute('data-terminal-command');
        const output = element.getAttribute('data-terminal-output');
        const delay = parseInt(element.getAttribute('data-terminal-delay') || '100');
        
        let commandText = '';
        let currentIndex = 0;
        
        const typeCommand = () => {
            if (currentIndex < command.length) {
                commandText += command[currentIndex];
                element.textContent = commandText;
                currentIndex++;
                setTimeout(typeCommand, delay);
            } else if (output) {
                const outputElement = document.createElement('div');
                outputElement.classList.add('terminal-output');
                outputElement.textContent = output;
                element.parentNode.insertBefore(outputElement, element.nextSibling);
            }
        };
        
        typeCommand();
    });
}

// Back to Top Button - Optimized to prevent forced reflow
function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    let lastScrollY = 0;
    let ticking = false;
    
    function updateBackToTop() {
        const scrollY = window.pageYOffset;
        const shouldShow = scrollY > 300;
        
        if (shouldShow && !backToTopButton.classList.contains('visible')) {
            backToTopButton.classList.add('visible');
        } else if (!shouldShow && backToTopButton.classList.contains('visible')) {
            backToTopButton.classList.remove('visible');
        }
        
        ticking = false;
    }
    
    function onScroll() {
        lastScrollY = window.pageYOffset;
        if (!ticking) {
            requestAnimationFrame(updateBackToTop);
            ticking = true;
        }
    }
    
    // Use passive scroll listener for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Scroll to top with animation when button is clicked
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add a glitch effect to the button when clicked
        backToTopButton.style.transform = 'scale(1.1)';
        backToTopButton.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
        
        setTimeout(() => {
            backToTopButton.style.transform = '';
            backToTopButton.style.boxShadow = '';
        }, 300);
        
        // Scroll to top with smooth animation
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// On Page Load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Matrix Rain
    const matrixRain = new MatrixRain();
    
    // Add subtle matrix code rain in background
    const matrixInterval = createMatrixCodeRain();
    
    // Initialize Section Animations
    createIntersectionObserver();
    
    // Initialize Enhanced Smooth Scrolling
    setupEnhancedSmoothScrolling();
    
    // Initialize Active Navigation
    setupActiveNavigation();
    
    // Initialize Back to Top Button
    setupBackToTop();
    
    // Terminal text animations
    document.querySelectorAll('[data-words]').forEach(element => {
        new TerminalText(element);
    });
    
    // Initialize terminal commands
    initTerminalCommands();
    
    // Set first nav link as active by default
    const firstNavLink = document.querySelector('.nav-link');
    if (firstNavLink) firstNavLink.classList.add('active');
    
    // Add CSS class for section animations on load - Batch DOM operations
    setTimeout(() => {
        const firstSection = document.querySelector('.section');
        if (firstSection) {
            firstSection.classList.add('visible', 'section-highlight');
            setTimeout(() => {
                firstSection.classList.remove('section-highlight');
            }, 1500);
        }
    }, 500);
}); 