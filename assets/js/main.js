// hover map descriptions (supports multiple maps)
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
