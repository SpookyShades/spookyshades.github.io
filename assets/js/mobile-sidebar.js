document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth > 767) return;

    const button = document.createElement("button");
    button.id = "mobile-sidebar-toggle";
    button.setAttribute("aria-label", "Toggle navigation");
    button.setAttribute("aria-expanded", "false");

    button.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    const overlay = document.createElement("div");
    overlay.id = "mobile-sidebar-overlay";

    document.body.appendChild(overlay);
    document.body.appendChild(button);

    function openSidebar() {
        document.body.classList.add("mobile-sidebar-open");
        button.setAttribute("aria-expanded", "true");
    }

    function closeSidebar() {
        document.body.classList.remove("mobile-sidebar-open");
        button.setAttribute("aria-expanded", "false");
    }

    button.addEventListener("click", function () {
        if (document.body.classList.contains("mobile-sidebar-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener("click", closeSidebar);
    overlay.addEventListener("touchmove", function (e) {
        e.preventDefault();
    }, { passive: false });

    document.addEventListener("click", function (e) {
        if (
            document.body.classList.contains("mobile-sidebar-open") &&
            e.target.closest(".sidebar a")
        ) {
            closeSidebar();
        }
    });
});