(function () {
    function updateCurrentNav() {
        const current = location.hash || '#/';
        const links = document.querySelectorAll('.nav-links a[href^="#/"]');

        links.forEach(link => {
            const href = link.getAttribute('href');
            const isCurrent = href === current;

            link.classList.toggle('current-page', isCurrent);

            if (isCurrent) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    window.addEventListener('hashchange', updateCurrentNav);
    document.addEventListener('DOMContentLoaded', updateCurrentNav);
})();