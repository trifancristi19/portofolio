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

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(this.resize, 100);
        });

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

function createIntersectionObserver() {
    const sections = document.querySelectorAll('.section');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
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

function setupEnhancedSmoothScrolling() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);

    let scrollTimeout;
    let cachedHeight = 0;

    function cacheHeight() {
        cachedHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                requestAnimationFrame(() => {
                    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    const scrolled = (winScroll / cachedHeight) * 100;
                    scrollIndicator.style.width = scrolled + '%';
                });
                scrollTimeout = null;
            }, 16);
        }
    });

    cacheHeight();
    window.addEventListener('resize', cacheHeight, { passive: true });

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));

            link.classList.add('active');

            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (!targetElement) return;

            sections.forEach(section => {
                section.classList.remove('section-highlight');
            });

            const navHeight = document.getElementById('main-nav').offsetHeight;

            const targetOffset = targetElement.offsetTop;
            const scrollOffset = targetOffset - navHeight - 15;

            const finalScrollOffset = Math.max(0, scrollOffset);

            window.scrollTo({
                top: finalScrollOffset,
                behavior: 'smooth'
            });

            setTimeout(() => {
                targetElement.classList.add('section-highlight');

                setTimeout(() => {
                    targetElement.classList.remove('section-highlight');
                }, 1500);
            }, 500);
        });
    });
}

function setupActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    let sectionCache = [];
    let lastScrollY = 0;
    let ticking = false;

    function cacheSectionPositions() {
        sectionCache = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop,
            height: section.clientHeight
        }));
    }

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

    function onScroll() {
        lastScrollY = window.pageYOffset;
        if (!ticking) {
            requestAnimationFrame(updateNavigation);
            ticking = true;
        }
    }

    cacheSectionPositions();
    window.addEventListener('resize', cacheSectionPositions, { passive: true });

    window.addEventListener('scroll', onScroll, { passive: true });
}

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

    window.addEventListener('scroll', onScroll, { passive: true });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();

        backToTopButton.style.transform = 'scale(1.1)';
        backToTopButton.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';

        setTimeout(() => {
            backToTopButton.style.transform = '';
            backToTopButton.style.boxShadow = '';
        }, 300);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        new MatrixRain();
    }

    createIntersectionObserver();

    setupEnhancedSmoothScrolling();

    setupActiveNavigation();

    setupBackToTop();

    document.querySelectorAll('[data-words]').forEach(element => {
        new TerminalText(element);
    });

    initTerminalCommands();

    const firstNavLink = document.querySelector('.nav-link');
    if (firstNavLink) firstNavLink.classList.add('active');

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