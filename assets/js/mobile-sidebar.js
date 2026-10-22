document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth > 767) return;

    const button = document.createElement("button");
    button.id = "mobile-sidebar-toggle";
    button.type = "button";
    button.setAttribute("aria-label", "Toggle navigation");
    button.setAttribute("aria-expanded", "false");

    button.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    const overlay = document.createElement("div");
    overlay.id = "mobile-sidebar-overlay";

    // Append overlay, then button
    document.body.appendChild(overlay);
    document.body.appendChild(button);

    // Make sure the sidebar itself is higher in the DOM stacking order
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
        // Ensuring the sidebar element itself isn't trapped in a lower z-index parent
        sidebar.style.pointerEvents = "auto";
    }

    function openSidebar() {
        document.body.classList.add("mobile-sidebar-open");
        button.setAttribute("aria-expanded", "true");
    }

    function closeSidebar() {
        document.body.classList.remove("mobile-sidebar-open");
        button.setAttribute("aria-expanded", "false");
    }

    button.addEventListener("click", function (e) {
        e.stopPropagation();
        if (document.body.classList.contains("mobile-sidebar-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener("click", closeSidebar);

    // Prevent background scrolling through the overlay without breaking sidebar touches
    overlay.addEventListener("touchmove", function (e) {
        e.preventDefault();
    }, { passive: false });

    // Close when a link inside the sidebar is clicked
    document.addEventListener("click", function (e) {
        if (
            document.body.classList.contains("mobile-sidebar-open") &&
            e.target.closest(".sidebar a")
        ) {
            closeSidebar();
        }
    });
});