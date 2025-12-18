// ===== Initialize AOS =====
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    initCountdown();
    // initRSVPForm(); // Removed old form init
    initRSVPModalForm(); // New modal form init
    initMusicPlayer();
});

// ===== Modals Logic =====
function openRSVPModal() {
    const modal = document.getElementById('rsvpModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeRSVPModal() {
    const modal = document.getElementById('rsvpModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function openGiftModal() {
    const modal = document.getElementById('giftModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeGiftModal() {
    const modal = document.getElementById('giftModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function initRSVPModalForm() {
    const form = document.getElementById('rsvpFormModal');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Cảm ơn bạn đã xác nhận tham dự!');
            closeRSVPModal();
            form.reset();
        });
    }
}

// ===== Music Player =====
function initMusicPlayer() {
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    if (!musicBtn || !bgMusic) {
        return;
    }
    let isPlaying = false;
    const INTRO_SKIP_SECONDS = 0;

    function skipIntroIfNeeded() {
        if (bgMusic.readyState >= 1) {
            const duration = bgMusic.duration;
            let skipTo = INTRO_SKIP_SECONDS;

            if (Number.isFinite(duration) && duration > 0) {
                if (duration <= INTRO_SKIP_SECONDS) {
                    skipTo = 0;
                } else {
                    skipTo = INTRO_SKIP_SECONDS;
                }
            }

            if (bgMusic.currentTime < skipTo) {
                try {
                    bgMusic.currentTime = skipTo;
                } catch (error) {
                    console.log('Unable to skip intro yet:', error);
                }
            }
        }
    }

    function toggleMusic() {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            musicBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>';
        } else {
            skipIntroIfNeeded();
            bgMusic.play().then(() => {
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            }).catch(e => {
                console.log("Audio play failed", e);
                alert("Vui lòng chạm vào màn hình để phát nhạc!");
            });
        }
        isPlaying = !isPlaying;
    }

    musicBtn.addEventListener('click', toggleMusic);

    bgMusic.addEventListener('loadedmetadata', skipIntroIfNeeded);
    bgMusic.addEventListener('play', skipIntroIfNeeded);
    bgMusic.addEventListener('ended', () => {
        bgMusic.currentTime = INTRO_SKIP_SECONDS;
        bgMusic.play();
    });

    // Auto play attempt with user interaction fallback
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            isPlaying = true;
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            skipIntroIfNeeded();
        }).catch(error => {
            // Auto-play was prevented
            console.log("Autoplay prevented");
            // Add a one-time click listener to body to start music
            document.body.addEventListener('click', function() {
                if (!isPlaying) {
                    skipIntroIfNeeded();
                    bgMusic.play();
                    isPlaying = true;
                    musicBtn.classList.add('playing');
                    musicBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
                }
            }, { once: true });
        });
    }
}


// ===== Countdown Timer =====
function initCountdown() {
    // Set wedding date (Change this to your actual wedding date)
    const weddingDate = new Date('2025-12-28T10:00:00').getTime();
    
    const countdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdown);
            document.getElementById('countdown').innerHTML = '<h2 style="font-family: var(--font-heading); font-size: 3rem;">The Big Day is Here! 🎉</h2>';
        }
    }, 1000);
}

// ===== RSVP Form Submission =====
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            attendance: document.getElementById('attendance').value,
            guests: document.getElementById('guests').value,
            message: document.getElementById('message').value
        };
        
        // Here you would typically send this data to a server
        console.log('RSVP Data:', formData);
        
        // Show success message
        alert('Cảm ơn bạn đã xác nhận! Chúng tôi rất mong được gặp bạn tại lễ cưới.');
        
        // Reset form
        form.reset();
    });
}

// ===== Map Functions =====
function openMap(location) {
    // Replace these with actual coordinates
    const locations = {
        ceremony: 'https://www.google.com/maps/search/?api=1&query=10.762622,106.660172',
        reception: 'https://www.google.com/maps/search/?api=1&query=10.762622,106.660172'
    };
    
    window.open(locations[location], '_blank');
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// ===== Gallery Lightbox =====
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Here you can implement a lightbox/modal to show full-size images
            console.log('Gallery item clicked');
            // You could use a library like GLightbox or create a custom modal
        });
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// ===== Parallax Effect =====
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-content');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== Loading Animation =====
function initLoadingAnimation() {
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger animations
        setTimeout(() => {
            document.querySelectorAll('.fade-in, .zoom-in, .slide-up').forEach(el => {
                el.style.opacity = '1';
            });
        }, 100);
    });
}

// ===== Form Validation =====
function initFormValidation() {
    const form = document.getElementById('rsvpForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = 'var(--primary-color)';
            }
        });
    });
}

// ===== Initialize All Functions =====
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initRSVPForm();
    initMusicPlayer();
    initScrollAnimations();
    initGalleryLightbox();
    initSmoothScroll();
    initParallax();
    initLoadingAnimation();
    initFormValidation();
    
    // Add entrance animations
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== Utility Functions =====

// Add floating animation to elements
function addFloatingAnimation(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
    });
}

// Create floating animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Add floating effect to couple hearts
addFloatingAnimation('.couple-heart');

// ===== Confetti Effect (Optional) =====
function createConfetti() {
    const colors = ['#c9a96e', '#8b7355', '#d4af37', '#f5f7fa'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        confetti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

// Trigger confetti on page load (optional)
// window.addEventListener('load', createConfetti);

// ===== Mobile Menu Toggle (if needed) =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
}

// ===== Image Lazy Loading =====
function initLazyLoading() {
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

// ===== Console Message =====
console.log('%c💒 Wedding Invitation Website ', 'background: #c9a96e; color: white; font-size: 20px; padding: 10px;');
console.log('%cMade with ❤️ for a special day', 'color: #c9a96e; font-size: 14px;');