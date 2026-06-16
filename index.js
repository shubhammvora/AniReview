// ==========================================
// AniReview — Main JavaScript
// ==========================================

// ============ SLIDER ============
const track = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

const totalSlides = slides.length;
let currentIndex = 0;
let slideInterval;

function updateSliderPosition() {
    if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSliderPosition();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSliderPosition();
}

function resetTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.dataset.index);
        updateSliderPosition();
        resetTimer();
    });
});

resetTimer();

// ============ HAMBURGER MENU ============
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav-overlay');

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.getElementById('main-header').offsetHeight;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ============ STAR RATING ============
const starRating = document.getElementById('starRating');
const ratingInput = document.getElementById('ratingValue');
let selectedRating = 0;

if (starRating) {
    const stars = starRating.querySelectorAll('.star');

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('hovered', parseInt(s.dataset.value) <= val);
            });
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hovered'));
        });

        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            ratingInput.value = selectedRating;
            stars.forEach(s => {
                s.classList.toggle('selected', parseInt(s.dataset.value) <= selectedRating);
            });
        });
    });
}

// ============ CHARACTER COUNT ============
const reviewText = document.getElementById('reviewText');
const charCount = document.getElementById('charCount');

if (reviewText && charCount) {
    reviewText.addEventListener('input', () => {
        charCount.textContent = reviewText.value.length;
    });
}

// ============ REVIEW SYSTEM ============
const reviewForm = document.getElementById('reviewForm');
const reviewsContainer = document.getElementById('reviewsContainer');

const avatarColors = [
    'linear-gradient(135deg, #4FAEEA, #2d8bc9)',
    'linear-gradient(135deg, #FF9233, #ff6b1a)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'linear-gradient(135deg, #f43f5e, #e11d48)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
];

const defaultReviews = [
    {
        name: 'Sakura',
        anime: 'Attack on Titan',
        rating: 5,
        text: 'Absolutely incredible anime! The story keeps you on the edge of your seat with every episode. The character development and world-building are top-notch. A must-watch for any anime fan.',
        date: '2026-06-10'
    },
    {
        name: 'Riku',
        anime: 'One Piece',
        rating: 5,
        text: 'One Piece is a masterpiece that just keeps getting better. The Wano arc is phenomenal. Oda is a genius storyteller who makes you laugh, cry, and cheer all in one episode.',
        date: '2026-06-09'
    },
    {
        name: 'Yuki',
        anime: 'Demon Slayer',
        rating: 4,
        text: 'The animation quality by Ufotable is absolutely breathtaking. Every fight scene is a visual masterpiece. The story is simple but heartfelt.',
        date: '2026-06-08'
    },
    {
        name: 'Haruto',
        anime: 'Jujutsu Kaisen',
        rating: 5,
        text: 'JJK hits different! The power system is so creative and the fights are insanely well animated. Gojo is the coolest character in modern anime, no debate.',
        date: '2026-06-07'
    },
    {
        name: 'Aoi',
        anime: 'Spy x Family',
        rating: 4,
        text: 'Such a wholesome and fun anime! Anya is the most adorable character ever. A perfect blend of comedy, action, and heartwarming family moments.',
        date: '2026-06-06'
    },
    {
        name: 'Kenji',
        anime: 'Chainsaw Man',
        rating: 4,
        text: 'Raw, chaotic, and absolutely wild. Chainsaw Man breaks all the conventions of shonen anime. MAPPA did an incredible job with the animation and atmosphere.',
        date: '2026-06-05'
    }
];

function getStarString(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function getInitial(name) {
    return name.charAt(0).toUpperCase();
}

function getAvatarColor(name) {
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
        <div class="review-header">
            <div class="review-avatar" style="background: ${getAvatarColor(review.name)}">
                ${getInitial(review.name)}
            </div>
            <div class="review-meta">
                <h4>${review.name}</h4>
                <span class="review-anime">${review.anime}</span>
            </div>
            <div class="review-stars">${getStarString(review.rating)}</div>
        </div>
        <p class="review-text">${review.review}</p>
        <span class="review-date">${formatDate(review.date)}</span>
    `;
    return card;
}

async function loadReviews() {

    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = '';

    try {

        const response = await fetch(
            "http://localhost:5000/reviews"
        );

        const reviews = await response.json();

        reviews.forEach(review => {
            reviewsContainer.appendChild(
                createReviewCard(review)
            );
        });

    } catch (err) {
        console.log(err);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reviewName').value.trim();
        const anime = document.getElementById('reviewAnime').value;
        const rating = parseInt(ratingInput.value);
        const text = reviewText.value.trim();

        if (!name || !anime || !rating || !text) {
            showToast('Please fill all fields and select a rating!');
            const toast = document.getElementById('toast');
            if (toast) {
                toast.style.background = 'linear-gradient(135deg, #f43f5e, #e11d48)';
                setTimeout(() => toast.style.background = '', 3500);
            }
            return;
        }

        const newReview = {
            name,
            anime,
            rating,
            text,
            date: new Date().toISOString().split('T')[0]
        };


        // Reset form
        reviewForm.reset();
        selectedRating = 0;
        ratingInput.value = 0;
        charCount.textContent = '0';
        starRating.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));

        showToast('Review submitted successfully! 🎉');

        // Scroll to reviews
        setTimeout(() => {
            const reviewsSection = document.getElementById('reviews');
            if (reviewsSection) {
                const headerHeight = document.getElementById('main-header').offsetHeight;
                const top = reviewsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }, 500);
    });
}

loadReviews();

// ============ SCROLL REVEAL ANIMATIONS ============
const revealElements = document.querySelectorAll('.reveal');
const animeCards = document.querySelectorAll('.anime-card');

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Staggered card animation
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, i * 100);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

animeCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
});

// ============ HEADER SCROLL EFFECT ============
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(15, 25, 35, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%)';
        header.style.boxShadow = 'none';
    }
});


// ============ ANIME CARD CLICK NAVIGATION ============
// When a user clicks on an anime card that has a data-href attribute,
// navigate to the corresponding anime detail page.
// Cards without data-href (like Spy x Family, Chainsaw Man) stay as they are.
document.querySelectorAll('.anime-card[data-href]').forEach(card => {
    card.addEventListener('click', () => {
        const href = card.getAttribute('data-href');
        if (href) {
            window.location.href = href;
        }
    });
});