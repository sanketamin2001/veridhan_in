/**
 * Typewriter animation for the FIRST heading on each page only.
 * Targets h1 inside .hero sections.
 */
(function () {
    var SPEED = 30;

    function init() {
        // Only the first h1 on the page (hero heading)
        var hero = document.querySelector('.hero h1');
        if (!hero) return;

        var text = hero.textContent.trim();
        if (!text) return;

        hero.setAttribute('data-tw', text);
        hero.textContent = '';
        hero.style.minHeight = '1.2em';

        // Start typing after a short delay for page to settle
        setTimeout(function () {
            typewrite(hero, text);
        }, 400);
    }

    function typewrite(el, text) {
        el.classList.add('tw-typing');
        var i = 0;

        function tick() {
            if (i <= text.length) {
                el.textContent = text.slice(0, i);
                i++;
                setTimeout(tick, SPEED);
            } else {
                el.classList.remove('tw-typing');
                el.classList.add('tw-done');
            }
        }
        tick();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
