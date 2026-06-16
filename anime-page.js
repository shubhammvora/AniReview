// ==========================================
// AniReview — Anime Detail Page JavaScript
// ==========================================
// This file handles review functionality on individual anime pages.
// It is shared across aot.html, onepiece.html, demonslayer.html, jjk.html.
// Each page passes a unique "animeSlug" to keep reviews separate.
//
// STRUCTURE OVERVIEW:
// 1. Hamburger menu (mobile nav)
// 2. Star rating interaction
// 3. Character counter
// 4. Review loading (from localStorage, prepared for MongoDB)
// 5. Review submission (to localStorage, prepared for MongoDB)
// 6. Toast notifications
// 7. Scroll animations
// 8. Header scroll effect
// ==========================================


// ============ CONFIGURATION ============
// Each anime page sets these before loading this script:
//   window.ANIME_SLUG  — unique key like "aot", "onepiece", "demonslayer", "jjk"
//   window.ANIME_NAME  — display name like "Attack on Titan"
// ==========================================

const ANIME_SLUG = window.ANIME_SLUG || 'unknown';
const ANIME_NAME = window.ANIME_NAME || 'Unknown Anime';

// LocalStorage key for this specific anime's reviews
const STORAGE_KEY = `anireview_reviews_${ANIME_SLUG}`;


// ============ HAMBURGER MENU ============
// Toggle mobile navigation overlay on small screens
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav-overlay');

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        // Prevent body scroll when mobile nav is open
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav when any link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}


// ============ SMOOTH SCROLL ============
// Smooth scroll for anchor links on the page
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
// Interactive star rating — click to select 1-5 stars
const starRating = document.getElementById('starRating');
const ratingInput = document.getElementById('ratingValue');
let selectedRating = 0;

if (starRating) {
    const stars = starRating.querySelectorAll('.star');

    // Highlight stars on hover
    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('hovered', parseInt(s.dataset.value) <= val);
            });
        });

        // Remove hover highlight when mouse leaves
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hovered'));
        });

        // Lock in the selected rating on click
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
// Show live character count for the review textarea
const reviewText = document.getElementById('reviewText');
const charCount = document.getElementById('charCount');

if (reviewText && charCount) {
    reviewText.addEventListener('input', () => {
        charCount.textContent = reviewText.value.length;
    });
}


// ============ REVIEW SYSTEM ============
// Avatar color gradients for user initials
const avatarColors = [
    'linear-gradient(135deg, #4FAEEA, #2d8bc9)',
    'linear-gradient(135deg, #FF9233, #ff6b1a)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'linear-gradient(135deg, #f43f5e, #e11d48)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
];

// --- Helper Functions ---

// Convert a numeric rating (1-5) into star characters
function getStarString(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// Get the first letter of a name for the avatar
function getInitial(name) {
    return name.charAt(0).toUpperCase();
}

// Pick a gradient color based on the user's name
function getAvatarColor(name) {
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
}

// Format a date string into a readable format
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}


// --- Create a Review Card DOM Element ---
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


// --- Fetch Reviews ---
// Currently loads from localStorage.
// Future MongoDB: Replace this function body with an API call.
async function fetchReviews() {

    const response = await fetch(
        `http://localhost:5000/reviews/${ANIME_NAME}`
    );

    return await response.json();
}


// --- Load and Display Reviews ---
// Gets reviews from fetchReviews() and the default reviews, then renders them.
async function loadReviews() {
    const container = document.getElementById(`reviewsContainer${capitalize(ANIME_SLUG)}`);
    if (!container) return;

    container.innerHTML = '';

    // Get user-submitted reviews (from localStorage or future MongoDB)
    const userReviews = await fetchReviews();

    // Get default placeholder reviews for this anime
    const defaults = getDefaultReviews();

    // Combine: user reviews first, then defaults
    const allReviews = [...userReviews, ...defaults];

    // Render each review card into the container
    allReviews.forEach(review => {
        container.appendChild(createReviewCard(review));
    });
}


// --- Save a New Review ---
// Currently saves to localStorage.
// Future MongoDB: Replace with a POST request to your API.
async function saveReview(reviewData) {

    console.log("SENDING TO BACKEND", reviewData);

    const response = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewData)
    });

    console.log("RESPONSE STATUS:", response.status);
}


// --- Capitalize first letter (for building container IDs) ---
function capitalize(str) {
    // Handles slugs like "aot" -> "AOT", "onepiece" -> "OnePiece", etc.
    const map = {
        'aot': 'AOT',
        'onepiece': 'OnePiece',
        'demonslayer': 'DemonSlayer',
        'jjk': 'JJK'
    };
    return map[str] || str.charAt(0).toUpperCase() + str.slice(1);
}


// --- Default Reviews Per Anime ---
// These act as placeholder community reviews.
// Future MongoDB: These will be removed once real reviews exist in the database.
function getDefaultReviews() {
    const defaults = {
        'aot': [
            {
                name: 'Sakura',
                anime: 'Attack on Titan',
                rating: 5,
                text: 'Absolutely incredible anime! The story keeps you on the edge of your seat with every episode. The character development and world-building are top-notch.',
                date: '2026-06-10'
            },
            {
                name: 'Takeshi',
                anime: 'Attack on Titan',
                rating: 5,
                text: 'The final season was a masterpiece. Isayama created one of the greatest stories in anime history. Every twist was perfectly executed.',
                date: '2026-06-08'
            },
            {
                name: 'Mina',
                anime: 'Attack on Titan',
                rating: 4,
                text: 'Amazing world-building and plot twists. The animation quality improved so much over the seasons. Some pacing issues in the middle arcs though.',
                date: '2026-06-05'
            }
        ],
        'onepiece': [
            {
                name: 'Riku',
                anime: 'One Piece',
                rating: 5,
                text: 'One Piece is a masterpiece that just keeps getting better. The Wano arc is phenomenal. Oda is a genius storyteller.',
                date: '2026-06-09'
            },
            {
                name: 'Nami',
                anime: 'One Piece',
                rating: 5,
                text: 'Over 1000 episodes and it never gets boring. The Straw Hat crew feels like family. Oda foreshadows everything years in advance!',
                date: '2026-06-07'
            },
            {
                name: 'Daichi',
                anime: 'One Piece',
                rating: 4,
                text: 'The world-building is unmatched in anime. Each island feels unique and alive. The only downside is the pacing in some filler arcs.',
                date: '2026-06-04'
            }
        ],
        'demonslayer': [
            {
                name: 'Yuki',
                anime: 'Demon Slayer',
                rating: 4,
                text: 'The animation quality by Ufotable is absolutely breathtaking. Every fight scene is a visual masterpiece. The story is simple but heartfelt.',
                date: '2026-06-08'
            },
            {
                name: 'Hinata',
                anime: 'Demon Slayer',
                rating: 5,
                text: 'Tanjiro is such a lovable protagonist. His determination to save his sister drives every emotional moment. The Mugen Train arc had me in tears.',
                date: '2026-06-06'
            },
            {
                name: 'Koji',
                anime: 'Demon Slayer',
                rating: 4,
                text: 'Visually the best anime ever made. The breathing techniques are so creatively animated. Zenitsu and Inosuke add great comedy relief.',
                date: '2026-06-03'
            }
        ],
        'jjk': [
            {
                name: 'Haruto',
                anime: 'Jujutsu Kaisen',
                rating: 5,
                text: 'JJK hits different! The power system is so creative and the fights are insanely well animated. Gojo is the coolest character in modern anime.',
                date: '2026-06-07'
            },
            {
                name: 'Ren',
                anime: 'Jujutsu Kaisen',
                rating: 5,
                text: 'The Shibuya Incident arc is peak anime. MAPPA went above and beyond with the animation. The character depth rivals the best shonen series.',
                date: '2026-06-05'
            },
            {
                name: 'Aiko',
                anime: 'Jujutsu Kaisen',
                rating: 4,
                text: 'Gege Akutami created a dark and thrilling world. The cursed energy system is fascinating. Sukuna is one of the best anime villains ever.',
                date: '2026-06-02'
            }
        ]
    };

    return defaults[ANIME_SLUG] || [];
}


// ============ TOAST NOTIFICATION ============
// Show a temporary popup message at the bottom of the screen
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
        toastMsg.textContent = message;
        // Use red gradient for errors, green for success
        if (isError) {
            toast.style.background = 'linear-gradient(135deg, #f43f5e, #e11d48)';
        } else {
            toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            toast.style.background = ''; // Reset to default
        }, 3000);
    }
}


// ============ FORM SUBMISSION ============
// Handle the review form submit event
const reviewForm = document.getElementById(`reviewForm${capitalize(ANIME_SLUG)}`);

if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Gather form values
        const name = document.getElementById('reviewName').value.trim();
        const rating = parseInt(ratingInput.value);
        const text = reviewText.value.trim();

        // Validate — all fields must be filled
        if (!name || !rating || !text) {
            showToast('Please fill all fields and select a rating!', true);
            return;
        }

        // Build the review data object
        // Future MongoDB: This object will be sent as JSON in a POST request
        const newReview = {
            name: name,
            anime: ANIME_NAME,
            rating: rating,
            text: text,
            date: new Date().toISOString().split('T')[0]
        };

        // Future MongoDB:
        // POST review to database
        // await fetch(`/api/reviews/${ANIME_SLUG}`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(newReview)
        // });

        // Save the review (currently to localStorage)
        await saveReview({
    name: name,
    anime: ANIME_NAME,
    rating: rating,
    review: text
});

        // Reload the reviews to show the new one
        loadReviews();

        // Reset the form
        reviewForm.reset();
        selectedRating = 0;
        ratingInput.value = 0;
        if (charCount) charCount.textContent = '0';
        if (starRating) {
            starRating.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
        }

        // Show success message
        showToast('Review submitted successfully! 🎉');

        // Scroll up to the reviews section so user can see their review
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


// ============ LOAD REVIEWS ON PAGE LOAD ============
loadReviews();


// ============ SCROLL REVEAL ANIMATIONS ============
// Fade-in elements as they scroll into view
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));


// ============ HEADER SCROLL EFFECT ============
// Darken the header background when user scrolls down
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
