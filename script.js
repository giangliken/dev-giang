// Năm footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15,
    }
);

revealEls.forEach((el) => observer.observe(el));

// Theme toggle with persistence and system preference
const themeToggle = document.getElementById("themeToggle");
function applyTheme(isLight) {
    const iconEl = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    if (isLight) {
        document.body.classList.add('light-theme');
        localStorage.setItem('site-theme', 'light');
        if (iconEl) iconEl.textContent = '☾'; // show moon because clicking will go to dark
        if (themeToggle) themeToggle.setAttribute('aria-label', 'Chuyển sang giao diện tối');
    } else {
        document.body.classList.remove('light-theme');
        localStorage.setItem('site-theme', 'dark');
        if (iconEl) iconEl.textContent = '☀'; // show sun because clicking will go to light
        if (themeToggle) themeToggle.setAttribute('aria-label', 'Chuyển sang giao diện sáng');
    }
}

if (themeToggle) {
    // initialize: prefer saved choice, otherwise follow OS preference
    const saved = localStorage.getItem('site-theme');
    if (saved === 'light') applyTheme(true);
    else if (saved === 'dark') applyTheme(false);
    else {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLight);
    }

    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        applyTheme(!isLight);
    });
}

// Highlight current nav link based on location
(function highlightCurrentNav() {
    try {
        const links = document.querySelectorAll('.nav-links a');
        if (!links || links.length === 0) return;
        let current = window.location.pathname.split('/').pop();
        if (!current) current = 'index.html';
        links.forEach((a) => {
            const href = (a.getAttribute('href') || '').split('/').pop();
            if (!href) return;
            if (href === current) {
                a.classList.add('active');
            }
        });
    } catch (e) {
        // ignore
    }
})();

// Nếu muốn custom theme light hơn, thêm CSS dưới vào file style.css:
// body.light-theme {
//     --bg: #f7f7ff;
//     --bg-elevated: #ffffff;
//     --glass: rgba(255, 255, 255, 0.85);
//     --text: #050712;
//     --muted: #5c6075;
//     --border-subtle: rgba(0, 0, 0, 0.06);
//     --shadow-soft: 0 18px 50px rgba(0, 0, 0, 0.1);
// }

// Lightbox for certificate images
(() => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lbImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    const lbCaption = lightbox.querySelector('.lightbox-caption');

    function open(src, alt, caption) {
        lbImg.src = src;
        lbImg.alt = alt || '';
        if (lbCaption) lbCaption.textContent = caption || alt || '';
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        lbImg.src = '';
        document.body.style.overflow = '';
    }

    // Click images inside cert-grid
    document.querySelectorAll('.cert-item img').forEach((img) => {
        img.addEventListener('click', () => open(img.src, img.alt, img.dataset.caption));
    });

    // Close handlers
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('visible')) close();
    });
})();

// Auto-play background music
(function() {
    let audioPath = 'assets/sounds/Fredji - Happy Life.mp3';
    const path = window.location.pathname;

    // If the page is inside a subdirectory, adjust the path
    if (path.includes('/posts/') || path.includes('/project-details/')) {
        audioPath = '../' + audioPath;
    }

    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = 0.3; // Set a moderate volume

    let hasInteracted = false;

    function playAudio() {
        if (audio.paused) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Audio play was prevented by browser.", error);
                    // Set up a one-time interaction listener to try again
                    document.addEventListener('click', playOnInteraction, { once: true });
                    document.addEventListener('keydown', playOnInteraction, { once: true });
                });
            }
        }
    }

    function playOnInteraction() {
        playAudio();
    }
    
    // Attempt to play right away. If it fails, the catch block above will set up listeners.
    playAudio();

})();
