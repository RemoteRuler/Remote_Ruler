/**
 * Remote Ruler - Pro Search Interface
 * Copyright (c) 2025 Remote Ruler. All rights reserved.
 * Designed by Fahim Monayem Sopnil.
 */

const canvas = document.getElementById('gravityCanvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

// --------------------------------------------------
// Content Protection (No Right-Click / No Select)
// --------------------------------------------------
document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && (event.key === 'u' || event.key === 'U' || event.key === 'c' || event.key === 'C')) {
        event.preventDefault();
    }
});

// --------------------------------------------------
// Random Quote Logic (Non-repeating)
// --------------------------------------------------
function displayRandomQuote() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle || typeof quoteLibrary === 'undefined') return;

    // Load history from local storage
    let seenIndices = JSON.parse(localStorage.getItem('seenQuotes') || '[]');

    // If we've seen all quotes, reset the history
    if (seenIndices.length >= quoteLibrary.length) {
        seenIndices = [];
    }

    // Find available indices
    const availableIndices = [];
    for (let i = 0; i < quoteLibrary.length; i++) {
        if (!seenIndices.includes(i)) {
            availableIndices.push(i);
        }
    }

    // Pick a random index from available ones
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

    // Update DOM
    // Split long quotes nicely if possible, or just display
    const quote = quoteLibrary[randomIndex];

    // Simple heuristic: bold the last few words or just display clearly
    // For this specific design, we'll just put the whole quote in the simplified style
    // or try to keep the "Big Text <br> Bold Text" format if we can split it.

    // Let's just create a nice single block for the quote
    heroTitle.innerHTML = `<span style="font-size: 0.8em; display: block; margin-bottom: 10px;">${quote}</span>`;

    // Save history
    seenIndices.push(randomIndex);
    localStorage.setItem('seenQuotes', JSON.stringify(seenIndices));
}

// Initial call
displayRandomQuote();

// Mouse interaction for Parallax
let mouse = { x: width / 2, y: height / 2 };
window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Antigravity particles (Blue/Cyan/White)
const particles = [];
// Increased density for a better effect
const numParticles = 120;

class Particle {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * width;
        // If initial, anywhere on screen. If respawning, start below bottom.
        this.y = initial ? Math.random() * height : height + 10;

        // Depth factor (0.5 to 2.5) - affects size, speed, and parallax
        this.z = Math.random() * 2 + 0.5;

        // Base upward velocity (Antigravity)
        // Closer particles (higher z) move faster
        this.vy = -1 * (Math.random() * 0.5 + 0.2) * this.z * 0.5;

        // Slight horizontal drift
        this.vx = (Math.random() - 0.5) * 0.2;

        // Size linked to depth
        this.size = Math.random() * 2 * this.z;
        this.alpha = Math.random() * 0.4 + 0.1;

        // Google Blue/Cyan/White palette
        const colors = ['#4285F4', '#24C1E0', '#FFFFFF', '#1a73e8'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        // Anti-gravity movement (Upwards)
        this.y += this.vy;
        this.x += this.vx;

        // Parallax Effect based on mouse position relative to center
        // Closer particles (higher z) shift more
        let parallaxX = (mouse.x - width / 2) * 0.0002 * this.z;
        let parallaxY = (mouse.y - height / 2) * 0.0002 * this.z;

        this.x += parallaxX;
        this.y += parallaxY;

        // Respawn if out of bounds (above top or far sides)
        if (this.y < -50 || this.x < -50 || this.x > width + 50) {
            this.reset(false);
        }
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Varying shadow blur for depth
        ctx.shadowBlur = this.z * 5;
        ctx.shadowColor = this.color;
    }
}

for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height); /* Clear canvas */

    // Draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}
animate();

// Search Logic
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    if (query) {
        const params = new URLSearchParams({
            q: query,
            kp: '-2', kl: 'us-en', kav: '1'
        });
        window.open('https://duckduckgo.com/?' + params.toString(), '_blank');
    }
});
