/**
 * Subtle 3D Dot Grid Background
 * Dots flow naturally with scroll (parallax per depth layer) and respond to mouse.
 */
(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'dots-bg';
    canvas.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let w, h;
    let dots = [];
    const SPACING = 48;
    const BASE_RADIUS = 1.2;
    const MOUSE_INFLUENCE = 14;

    // Smooth values
    let mouse = { x: -9999, y: -9999 };
    let smoothMouse = { x: -9999, y: -9999 };
    let scrollY = 0;
    let smoothScroll = 0;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildGrid();
    }

    function buildGrid() {
        dots = [];
        // Extra rows above and below to cover parallax overflow
        const cols = Math.ceil(w / SPACING) + 2;
        const rows = Math.ceil(h / SPACING) + 6;
        for (let r = -3; r < rows; r++) {
            for (let c = -1; c < cols; c++) {
                const seed = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
                const depth = seed - Math.floor(seed); // 0..1
                dots.push({
                    baseX: c * SPACING,
                    baseY: r * SPACING,
                    depth: depth,
                    radius: BASE_RADIUS + depth * 0.6,
                    opacity: 0.08 + depth * 0.12,
                    // Each dot scrolls at a rate determined by its depth
                    // depth 0 = moves with page (scroll rate 1.0), depth 1 = barely moves (scroll rate 0.3)
                    scrollRate: 0.3 + (1 - depth) * 0.7,
                });
            }
        }
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function draw() {
        smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.06);
        smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.06);
        smoothScroll = lerp(smoothScroll, scrollY, 0.1);

        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const mx = (smoothMouse.x - cx) / cx || 0;
        const my = (smoothMouse.y - cy) / cy || 0;

        const totalRows = Math.ceil(h / SPACING) + 6;
        const totalHeight = totalRows * SPACING;

        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];

            // Mouse parallax based on depth
            const parallaxFactor = (d.depth - 0.5) * 2;
            const offsetX = mx * MOUSE_INFLUENCE * parallaxFactor;
            const offsetY = my * MOUSE_INFLUENCE * parallaxFactor;

            // Scroll: each dot moves at its own rate, creating depth separation
            // scrollRate 1.0 = moves with the page fully, 0.3 = stays mostly still
            let y = d.baseY - smoothScroll * d.scrollRate + offsetY;

            // Wrap dots vertically so the grid is infinite
            y = ((y % totalHeight) + totalHeight) % totalHeight - 3 * SPACING;

            const x = d.baseX + offsetX;

            // Only draw if visible
            if (y > -SPACING && y < h + SPACING && x > -SPACING && x < w + SPACING) {
                ctx.beginPath();
                ctx.arc(x, y, d.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 169, 110, ${d.opacity})`;
                ctx.fill();
            }
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('scroll', function () {
        scrollY = window.pageYOffset || document.documentElement.scrollTop;
    }, { passive: true });

    resize();
    draw();
})();
