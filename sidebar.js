// Veridhan — Main site JavaScript
document.addEventListener('DOMContentLoaded', function () {

    // ── Navbar toggle (mobile) ──
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ── Highlight active page ──
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(function (link) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // ── Scroll-based fade-in animations ──
    var fadeElements = document.querySelectorAll('.fade-up');
    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        fadeElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ── Waitlist Modal (NinjaTrader / Opening Range Bot pages) ──
    var modal = document.getElementById('waitlist-modal');
    var openBtns = document.querySelectorAll('.open-waitlist-btn');
    var closeBtn = document.getElementById('close-waitlist-modal');

    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openBtns.forEach(function (btn) {
        btn.addEventListener('click', openModal);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }
});