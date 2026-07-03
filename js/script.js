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
        this.canvas.style.opacity = '0.06';
        this.canvas.style.pointerEvents = 'none';
        document.body.appendChild(this.canvas);

        this.fontSize = 16;
        this.maxColumns = window.innerWidth < 768 ? 45 : 70;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        this.drops = [];
        this.running = true;

        this.resize();
        this.draw = this.draw.bind(this);
        this.resizeHandler = this.resize.bind(this);

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(this.resizeHandler, 150);
        });

        document.addEventListener('visibilitychange', () => {
            this.running = !document.hidden;
        });

        this.interval = setInterval(this.draw, 120);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.maxColumns = window.innerWidth < 768 ? 45 : 70;
        const columnCount = Math.min(this.maxColumns, Math.floor(this.canvas.width / this.fontSize));
        this.drops = Array.from({ length: columnCount }, () => Math.floor(Math.random() * -20));
    }

    draw() {
        if (!this.running) return;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            this.ctx.fillText(char, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }
    }

    destroy() {
        clearInterval(this.interval);
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

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const backToTopButton = document.getElementById('back-to-top');

    let cachedHeight = 0;
    let sectionCache = [];
    let ticking = false;

    function cacheLayout() {
        cachedHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        sectionCache = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop
        }));
    }

    function updateOnScroll() {
        const scrollY = window.pageYOffset;

        if (cachedHeight > 0) {
            scrollIndicator.style.width = `${(scrollY / cachedHeight) * 100}%`;
        }

        if (backToTopButton) {
            backToTopButton.classList.toggle('visible', scrollY > 300);
        }

        let current = '';
        for (const section of sectionCache) {
            if (scrollY >= section.top - 200) {
                current = section.id;
            }
        }

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

    cacheLayout();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', cacheLayout, { passive: true });

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
            const scrollOffset = Math.max(0, targetElement.offsetTop - navHeight - 15);

            window.scrollTo({
                top: scrollOffset,
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

    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
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

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        new MatrixRain();
    }

    createIntersectionObserver();
    setupEnhancedSmoothScrolling();

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