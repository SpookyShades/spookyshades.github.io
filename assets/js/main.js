// hover map descriptions
document.addEventListener("mouseover", e => {
  const state = e.target.closest(".state");
  if (!state) return;

  const container = state.closest(".map-container");
  if (!container) return;

  // label is the element immediately before the container
  const label = container.previousElementSibling;
  if (!label || !label.classList.contains("map-label")) return;

  const nameLabel = label.querySelector(".map-label-name");
  const typeLabel = label.querySelector(".map-label-type");

  if (!nameLabel || !typeLabel) return;

  nameLabel.textContent = state.dataset.name;
  typeLabel.textContent =
    state.dataset.type === "map" ? "Map" :
    state.dataset.type === "both" ? "Map & Mileage Target" :
    "Mileage Target";
});

// hovering

document.addEventListener("mouseout", e => {
  const state = e.target.closest(".state");
  if (!state) return;

  const container = state.closest(".map-container");
  if (!container) return;

  const label = container.previousElementSibling;
  if (!label || !label.classList.contains("map-label")) return;

  const nameLabel = label.querySelector(".map-label-name");
  const typeLabel = label.querySelector(".map-label-type");

  if (!nameLabel || !typeLabel) return;

  nameLabel.textContent = "-----";
  typeLabel.innerHTML = "&nbsp;";
});

// button
document.addEventListener("DOMContentLoaded", () => {

  const infoBtn = document.getElementById("info-btn");
  const closeBtn = document.getElementById("close-info");
  const modal = document.getElementById("info-modal");
});

document.addEventListener("click", e => {
  if (e.target.id === "info-btn") {
    const panel = document.getElementById("info-panel");
    panel.hidden = !panel.hidden;
  }
});

// consistent browser tab title for all pages
window.$docsify.plugins = [].concat(function(hook, vm) {
  hook.doneEach(function() {
    document.title = "Spooks' TruckSim Repository";
  });
}, window.$docsify.plugins || []);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("table tr").forEach(row => {
    if (row.textContent.includes("★")) {
      row.classList.add("new");
    }
  });
});

window.$docsify.plugins = [].concat(function (hook) {
  hook.doneEach(function () {
    window.scrollTo(0, 0);
  });
}, window.$docsify.plugins || []);

// update banner
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
  hook.doneEach(function () {
    const banner = document.getElementById("update-banner");
    if (banner) banner.hidden = false;
  });
});

// map hover tooltip
function initializeMapTooltips() {

    const containers = document.querySelectorAll(".map-container");
    containers.forEach(container => {

        const tooltip = container.querySelector(".map-tooltip");
        const states = container.querySelectorAll(".state");
        if (!tooltip || states.length === 0) return;

        const typeLabels = {
            mileage: "Mileage Target",
            map: "Map",
            both: "Mileage Target + Map"
        };

        states.forEach(state => {
            state.addEventListener("mouseenter", () => {
                tooltip.classList.add("visible");
            });
            state.addEventListener("mouseleave", () => {
                tooltip.classList.remove("visible");
            });
            state.addEventListener("mousemove", (e) => {

                const name = state.dataset.name || "Unknown";
                const type = state.dataset.type || "";
                const flags = (state.dataset.flags || "")
                    .split(" ")
                    .filter(Boolean);

                const flagHTML = flags.map(flag =>
                    `<span class="flag flag-${flag}"></span>`
                ).join("");

                tooltip.innerHTML = `
                    <div class="map-tooltip-title">
                        ${name}
                        ${flags.length ? " • " : ""}
                        ${flagHTML}
                    </div>

                    <div class="map-tooltip-type">
                        ${typeLabels[type] || type}
                    </div>
                `;

                const rect = container.getBoundingClientRect();
                tooltip.style.left =
                    (e.clientX - rect.left + 15) + "px";
                tooltip.style.top =
                    (e.clientY - rect.top + 15) + "px";
            });

        });

    });

}

window.addEventListener("load", () => {
    setTimeout(initializeMapTooltips, 300);
});