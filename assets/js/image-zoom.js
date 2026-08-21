(function () {
    'use strict';

    const CONFIG = {
        initialScale: 0.8,
        maxScale: 20,
        wheelStep: 0.5,
        doubleClickStep: 2,
        keyboardStep: 0.5
    };

    let image = null;
    let overlay = null;
    let closeButton = null;
    let scale = 1;
    let x = 0;
    let y = 0;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;

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

        document.body.appendChild(overlay);

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) close();
        });
    }

    function apply() {
        if (!image) return;

        image.style.transform =
            `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
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

        newScale = Math.max(
            1,
            Math.min(CONFIG.maxScale, newScale)
        );

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

        zoomAt(
            scale + direction * CONFIG.wheelStep,
            event.clientX,
            event.clientY
        );
    }

    function pointerDown(event) {
        if (event.button !== 0 || scale <= 1) return;

        dragging = true;

        startX = event.clientX;
        startY = event.clientY;
        originX = x;
        originY = y;

        image.classList.add('zoom-dragging');

        image.setPointerCapture(event.pointerId);

        event.preventDefault();
    }

    function pointerMove(event) {
        if (!dragging) return;

        x = originX + event.clientX - startX;
        y = originY + event.clientY - startY;

        clamp();
        apply();

        event.preventDefault();
    }

    function pointerUp(event) {
        if (!dragging) return;

        dragging = false;

        image.classList.remove('zoom-dragging');

        try {
            image.releasePointerCapture(event.pointerId);
        } catch (_) {}
    }

    function doubleClick(event) {
        event.preventDefault();

        if (scale < 2) {
            zoomAt(
                Math.min(2, CONFIG.maxScale),
                event.clientX,
                event.clientY
            );
            return;
        }

        if (scale < 4) {
            zoomAt(
                Math.min(4, CONFIG.maxScale),
                event.clientX,
                event.clientY
            );
            return;
        }

        if (scale < 8) {
            zoomAt(
                Math.min(8, CONFIG.maxScale),
                event.clientX,
                event.clientY
            );
            return;
        }

        scale = 1;
        x = 0;
        y = 0;
        apply();
    }

    function keyDown(event) {
        if (!image) return;

        if (event.key === '+' || event.key === '=') {
            event.preventDefault();

            zoomAt(
                scale + CONFIG.keyboardStep,
                window.innerWidth / 2,
                window.innerHeight / 2
            );
        }

        if (event.key === '-' || event.key === '_') {
            event.preventDefault();

            zoomAt(
                scale - CONFIG.keyboardStep,
                window.innerWidth / 2,
                window.innerHeight / 2
            );
        }

        if (event.key === '0') {
            event.preventDefault();

            scale = 1;
            x = 0;
            y = 0;

            apply();
        }

        if (event.key === 'Escape') {
            close();
        }
    }

    function open(source) {
        if (image) close();

        createOverlay();

        image = source.cloneNode(true);

        image.className = 'zoomed-image';

        image.removeAttribute('width');
        image.removeAttribute('height');

        overlay.appendChild(image);
        overlay.classList.add('visible');

        document.body.classList.add('image-zoom-open');

        scale = CONFIG.initialScale;
        x = 0;
        y = 0;

        image.addEventListener(
            'wheel',
            wheel,
            { passive: false }
        );

        image.addEventListener(
            'pointerdown',
            pointerDown
        );

        image.addEventListener(
            'pointermove',
            pointerMove
        );

        image.addEventListener(
            'pointerup',
            pointerUp
        );

        image.addEventListener(
            'pointercancel',
            pointerUp
        );

        image.addEventListener(
            'dblclick',
            doubleClick
        );

        image.addEventListener(
            'dragstart',
            function (event) {
                event.preventDefault();
            }
        );

        requestAnimationFrame(function () {
            apply();
        });
    }

    function close() {
        if (!overlay) return;

        overlay.classList.remove('visible');
        document.body.classList.remove('image-zoom-open');

        if (image) {
            image.remove();
            image = null;
        }

        scale = 1;
        x = 0;
        y = 0;
        dragging = false;
    }

    function initialize() {
        document.addEventListener(
            'click',
            function (event) {
                const target =
                    event.target.closest(
                        '.markdown-section img'
                    );

                if (!target || image) return;

                event.preventDefault();

                open(target);
            }
        );

        document.addEventListener(
            'keydown',
            keyDown
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initialize
        );
    } else {
        initialize();
    }
})();