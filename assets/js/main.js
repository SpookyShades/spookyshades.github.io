// hover map descriptions
document.addEventListener("mouseover", e => {
  const state = e.target.closest(".state");
  if (!state) return;

  const container = state.closest(".map-container");
  if (!container) return;

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
