(function () {
  const mapHoverPlugin = function (hook, vm) {
    const typeLabels = { 'mileage': 'Mileage Target', 'map': 'Map', 'both': 'Mileage Target + Map' };

    hook.doneEach(function () {
      const containers = document.querySelectorAll('.map-container');
      containers.forEach(container => {
        const tooltip = container.querySelector('.map-tooltip'), states = container.querySelectorAll('.state');
        if (!tooltip || !states.length) return;

        states.forEach(state => {
          state.addEventListener('mouseenter', () => {
            const name = state.getAttribute('data-name'), rawType = state.getAttribute('data-type'), flagAttr = state.getAttribute('data-flags') || '';
            const flagCodes = flagAttr.split(/\s+/).filter(Boolean).sort();
            const count = flagCodes.length;

            const numCols = Math.ceil(count / 4);
            const numRows = Math.ceil(count / numCols);

            const flagsHtml = flagCodes.map(code => `<span class="flag flag-${code.toLowerCase()}"></span>`).join('');
            const friendlyType = typeLabels[rawType.toLowerCase()] || rawType;

            tooltip.innerHTML = `
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="display: grid; grid-template-rows: repeat(${numRows}, auto); grid-auto-flow: column; gap: 4px; align-items: center;">
                  ${flagsHtml}
                </div>
                <div style="display:flex; flex-direction:column; justify-content:center;">
                  <div class="map-tooltip-title" style="margin:0; line-height:1.2; color:#D4AF37; font-weight:bold; font-family:'Orbitron', sans-serif; font-size:0.85rem; letter-spacing:0.5px;">${name.toUpperCase()}</div>
                  <div class="map-tooltip-type" style="margin:0; font-size:0.75rem; opacity:0.7; font-family:'Inter', sans-serif;">${friendlyType}</div>
                </div>
              </div>
            `;
            tooltip.classList.add('visible');
          });

          state.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const tooltipWidth = tooltip.offsetWidth || 180;
            const posX = (x + tooltipWidth + 20 > rect.width) ? (x - tooltipWidth - 15) : (x + 15);
            tooltip.style.left = posX + 'px'; tooltip.style.top = (y + 15) + 'px';
          });

          state.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
        });
      });
    });
  };
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], mapHoverPlugin);
}());