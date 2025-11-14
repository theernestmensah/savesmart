// SaveSmart - Animations
document.addEventListener('DOMContentLoaded', () => {
    // Fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.interactive-hover').forEach(el => {
        observer.observe(el);
    });

    // Tilt effect
    const tiltElements = document.querySelectorAll('.interactive-hover');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            el.style.transform = `translateY(-8px) perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.05)`;
            el.style.transition = 'transform 0.1s ease';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translateY(0) perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            el.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });
    });
});
