(function () {
    'use strict';

    const CONFIG = {
        initialScale: 1,
        maxScale: 20,
        minScale: 0.5,
        wheelStep: 0.35,
        doubleClickStep: 2.5,
        keyboardStep: 0.4
    };

    let image = null;
    let overlay = null;
    let closeButton = null;
    let controls = null;
    let scale = 1;
    let x = 0;
    let y = 0;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;
    let hasMoved = false;

    // Multi-touch tracking
    const activePointers = new Map();
    let initialPinchDistance = 0;
    let initialPinchScale = 1;
    let lastTapTime = 0;

    function createOverlay() {
        if (overlay) return;

        overlay = document.createElement('div');
        overlay.className = 'image-zoom-overlay';

        closeButton = document.createElement('button');
        closeButton.className = 'image-zoom-close';
        closeButton.type = 'button';
        closeButton.setAttribute('aria-label', 'Close image');
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', close);
        overlay.appendChild(closeButton);

        controls = document.createElement('div');
        controls.className = 'image-zoom-controls';

        const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'image-zoom-btn';
        zoomInBtn.type = 'button';
        zoomInBtn.setAttribute('aria-label', 'Zoom in');
        zoomInBtn.textContent = '+';
        zoomInBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            zoomAt(scale + CONFIG.keyboardStep, window.innerWidth / 2, window.innerHeight / 2);
        });

        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'image-zoom-btn';
        zoomOutBtn.type = 'button';
        zoomOutBtn.setAttribute('aria-label', 'Zoom out');
        zoomOutBtn.textContent = '−';
        zoomOutBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            zoomAt(scale - CONFIG.keyboardStep, window.innerWidth / 2, window.innerHeight / 2);
        });

        controls.appendChild(zoomInBtn);
        controls.appendChild(zoomOutBtn);
        overlay.appendChild(controls);

        document.body.appendChild(overlay);

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) {
                close();
            }
        });
    }

    function apply() {
        if (!image) return;
        image.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    function clamp() {
        if (!image) return;
        const rect = image.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxX = Math.max(0, (rect.width - viewportWidth) / 2);
        const maxY = Math.max(0, (rect.height - viewportHeight) / 2);

        x = Math.max(-maxX, Math.min(maxX, x));
        y = Math.max(-maxY, Math.min(maxY, y));
    }

    function zoomAt(newScale, clientX, clientY) {
        if (!image) return;

        newScale = Math.max(CONFIG.minScale, Math.min(CONFIG.maxScale, newScale));
        if (newScale === scale) return;

        const rect = image.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const pointX = clientX - centerX;
        const pointY = clientY - centerY;
        const scaleChange = newScale - scale;

        x -= pointX * (scaleChange / scale);
        y -= pointY * (scaleChange / scale);

        scale = newScale;

        clamp();
        apply();
    }

    function wheel(event) {
        event.preventDefault();
        const direction = event.deltaY < 0 ? 1 : -1;
        zoomAt(scale + direction * CONFIG.wheelStep, event.clientX, event.clientY);
    }

    function pointerDown(event) {
        activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (activePointers.size === 1) {
            hasMoved = false;
            dragging = true;
            startX = event.clientX;
            startY = event.clientY;
            originX = x;
            originY = y;
            image.classList.add('zoom-dragging');
            try { image.setPointerCapture(event.pointerId); } catch (_) {}
        } else if (activePointers.size === 2) {
            dragging = false;
            const pts = Array.from(activePointers.values());
            initialPinchDistance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
            initialPinchScale = scale;
        }

        event.preventDefault();
    }

    function pointerMove(event) {
        if (!activePointers.has(event.pointerId)) return;
        activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (activePointers.size === 2) {
            const pts = Array.from(activePointers.values());
            const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
            if (initialPinchDistance > 0) {
                const pinchFactor = currentDist / initialPinchDistance;
                const midX = (pts[0].x + pts[1].x) / 2;
                const midY = (pts[0].y + pts[1].y) / 2;
                zoomAt(initialPinchScale * pinchFactor, midX, midY);
            }
            event.preventDefault();
            return;
        }

        if (dragging) {
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;

            x = originX + dx;
            y = originY + dy;
            clamp();
            apply();
            event.preventDefault();
        }
    }

    function pointerUp(event) {
        activePointers.delete(event.pointerId);
        try { image.releasePointerCapture(event.pointerId); } catch (_) {}

        if (activePointers.size === 1) {
            const remaining = Array.from(activePointers.values())[0];
            startX = remaining.x;
            startY = remaining.y;
            originX = x;
            originY = y;
            dragging = true;
        } else if (activePointers.size === 0) {
            dragging = false;
            if (image) image.classList.remove('zoom-dragging');

            // Handle mobile tap / double-tap
            if (!hasMoved) {
                const now = Date.now();
                if (now - lastTapTime < 300) {
                    doubleClick(event);
                    lastTapTime = 0;
                } else {
                    lastTapTime = now;
                }
            }
        }
    }

    function doubleClick(event) {
        event.preventDefault();
        if (scale < 2) {
            zoomAt(CONFIG.doubleClickStep, event.clientX, event.clientY);
        } else {
            scale = 1;
            x = 0;
            y = 0;
            apply();
        }
    }

    function keyDown(event) {
        if (!image) return;

        if (event.key === '+' || event.key === '=') {
            event.preventDefault();
            zoomAt(scale + CONFIG.keyboardStep, window.innerWidth / 2, window.innerHeight / 2);
        } else if (event.key === '-' || event.key === '_') {
            event.preventDefault();
            zoomAt(scale - CONFIG.keyboardStep, window.innerWidth / 2, window.innerHeight / 2);
        } else if (event.key === '0') {
            event.preventDefault();
            scale = 1;
            x = 0;
            y = 0;
            apply();
        } else if (event.key === 'Escape') {
            close();
        }
    }

    function open(source) {
        if (image) close();

        createOverlay();

        image = source.cloneNode(true);
        image.className = 'zoomed-image';

        // Strip attributes and inline styling so the cloned image doesn't fill the overlay
        image.removeAttribute('width');
        image.removeAttribute('height');
        image.removeAttribute('style');

        overlay.appendChild(image);
        overlay.classList.add('visible');
        document.body.classList.add('image-zoom-open');

        scale = CONFIG.initialScale;
        x = 0;
        y = 0;

        image.addEventListener('wheel', wheel, { passive: false });
        image.addEventListener('pointerdown', pointerDown);
        image.addEventListener('pointermove', pointerMove);
        image.addEventListener('pointerup', pointerUp);
        image.addEventListener('pointercancel', pointerUp);
        image.addEventListener('dblclick', doubleClick);
        image.addEventListener('dragstart', e => e.preventDefault());

        requestAnimationFrame(() => apply());
    }

    function close() {
        if (!overlay) return;

        overlay.classList.remove('visible');
        document.body.classList.remove('image-zoom-open');

        if (image) {
            image.remove();
            image = null;
        }

        activePointers.clear();
        scale = 1;
        x = 0;
        y = 0;
        dragging = false;
    }

    function initialize() {
        document.addEventListener('click', function (event) {
            const clickedImg = event.target.closest('.markdown-section img');
            if (!clickedImg) return;

            const link = clickedImg.closest('a');
            if (link) {
                const href = (link.getAttribute('href') || '').toLowerCase();
                // Allow lightbox if link points to an image file or is a placeholder
                if (/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(href) || href === '#' || href === '') {
                    event.preventDefault();
                    open(clickedImg);
                }
                return;
            }

            event.preventDefault();
            open(clickedImg);
        });

        document.addEventListener('keydown', keyDown);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();