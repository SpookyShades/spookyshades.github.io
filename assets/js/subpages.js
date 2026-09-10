/* Subpage dropdowns for images */

(function () {
    function updatePageType() {
        const hash = window.location.hash || '';
        const isLandingPage = hash === '' || hash === '#' || hash === '#/';
        document.body.classList.toggle('landing-page', isLandingPage);
    }

    function makeMapSectionsCollapsible() {
        const content = document.querySelector('.markdown-section');
        if (!content || document.body.classList.contains('landing-page')) return;

        const mapsHeading = Array.from(content.querySelectorAll('h2')).find(
            h => h.textContent.trim().toLowerCase() === 'maps'
        );

        if (!mapsHeading) return;

        let current = mapsHeading.nextElementSibling;
        const mapH3s = [];

        while (current && current.tagName !== 'H2') {
            if (current.tagName === 'H3') mapH3s.push(current);
            current = current.nextElementSibling;
        }

        mapH3s.forEach((heading, index) => {
            const details = document.createElement('details');
            details.className = 'subpage-section';

            // Open the first dropdown at the top of the section by default
            if (index === 0) {
                details.open = true;
            }

            const summary = document.createElement('summary');
            summary.textContent = heading.textContent;

            const sectionContent = document.createElement('div');
            sectionContent.className = 'subpage-section-content';

            let item = heading.nextElementSibling;

            while (item && item.tagName !== 'H3' && item.tagName !== 'H2') {
                const next = item.nextElementSibling;
                sectionContent.appendChild(item);
                item = next;
            }

            details.appendChild(summary);
            details.appendChild(sectionContent);
            heading.replaceWith(details);
        });
    }

    function processPage() {
        updatePageType();
        setTimeout(makeMapSectionsCollapsible, 100);
    }

    document.addEventListener('DOMContentLoaded', processPage);
    window.addEventListener('hashchange', processPage);
})();