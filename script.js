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

// Theme toggle (demo đơn giản: đảo background + text-color)
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
    });
}

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
