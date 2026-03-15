// Force scroll to top on refresh as early as possible
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

window.onload = function() {
    window.scrollTo(0, 0);
};

window.scrollTo(0, 0);

// Intersection Observer for scroll reveal animations
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Dynamic Navigation Active State
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');

    const updateActiveNav = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - (sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);

    // Smooth Scroll for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSector = document.querySelector(targetId);
            
            if (targetSector) {
                window.scrollTo({
                    top: targetSector.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Glassmorphism Header Scroll Effect 
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(12, 12, 13, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(12, 12, 13, 0.85)';
            header.style.boxShadow = 'none';
        }
    });

    // Hero Section Parallax (Subtle)
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroContent && scrolled < 800) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroContent.style.opacity = 1 - (scrolled / 600);
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navWrapper = document.querySelector('header nav');

    if (menuToggle && navWrapper) {
        menuToggle.addEventListener('click', () => {
            navWrapper.classList.toggle('active');
            menuToggle.classList.toggle('open');
            
            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            if (navWrapper.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navWrapper.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // --- Language Switcher Logic ---
    const langBtn = document.getElementById('lang-switch');
    let currentLang = 'en';

    const updateLanguage = (lang) => {
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });

        // Update Button Text
        const btnText = langBtn.querySelector('.lang-text');
        btnText.textContent = btnText.getAttribute(`data-${lang}`);

        // Update Document Direction & Font
        if (lang === 'ar') {
            document.body.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.body.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'en');
        }
        
        currentLang = lang;
    };

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const nextLang = currentLang === 'en' ? 'ar' : 'en';
            updateLanguage(nextLang);
        });
    }

    // --- Hero Canvas Particles ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const ripples = [];
        let sparkles = [];

        window.addEventListener('mousedown', (e) => {
            ripples.push({ x: e.clientX, y: e.clientY, r: 0, opacity: 0.6 });
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;

            // Updated Glow Position
            const glow = document.querySelector('.hero-glow');
            if (glow) {
                glow.style.left = e.clientX + 'px';
                glow.style.top = e.clientY + 'px';
            }

            // Blob Parallax Effect
            const blobs = document.querySelectorAll('.blob');
            blobs.forEach((blob, index) => {
                const shift = (index + 1) * 20;
                const bx = (e.clientX / window.innerWidth - 0.5) * shift;
                const by = (e.clientY / window.innerHeight - 0.5) * shift;
                blob.style.transform = `translate(${bx}px, ${by}px)`;
            });

            // 3D Tilt Effect
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const x = e.clientX / window.innerWidth - 0.5;
                const y = e.clientY / window.innerHeight - 0.5;
                heroContent.style.transform = `
                    rotateY(${x * 15}deg) 
                    rotateX(${y * -15}deg)
                    translateZ(60px)
                `;
            }
        });

        // Magnetic Buttons Effect
        const magneticBtns = document.querySelectorAll('.btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        class Sparkle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.alpha = 0;
                this.speed = Math.random() * 0.01 + 0.005;
                this.maxAlpha = Math.random() * 0.5 + 0.1;
                this.growing = true;
            }
            update() {
                if (this.growing) {
                    this.alpha += this.speed;
                    if (this.alpha >= this.maxAlpha) this.growing = false;
                } else {
                    this.alpha -= this.speed;
                    if (this.alpha <= 0) {
                        this.x = Math.random() * canvas.width;
                        this.y = Math.random() * canvas.height;
                        this.growing = true;
                    }
                }
            }
            draw() {
                ctx.fillStyle = `rgba(197, 160, 89, ${this.alpha})`;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = Math.random() > 0.5 ? '#c5a059' : '#8a7b5c';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;

                // Mouse interaction - Attraction
                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        this.x += dx / 80;
                        this.y += dy / 80;
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            sparkles = [];
            for (let i = 0; i < 100; i++) particles.push(new Particle());
            for (let i = 0; i < 60; i++) sparkles.push(new Sparkle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Sparkles
            sparkles.forEach(s => { s.update(); s.draw(); });

            // Draw Ripples
            ripples.forEach((ripple, i) => {
                ripple.r += 6;
                ripple.opacity -= 0.015;
                if (ripple.opacity <= 0) ripples.splice(i, 1);
                else {
                    ctx.strokeStyle = `rgba(197, 160, 89, ${ripple.opacity})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2); ctx.stroke();
                }
            });

            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // Draw connecting lines between close particles
                for (let j = index + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(197, 160, 89, ${0.15 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        };

        init();
        animate();
    }
});
