(function () {
  function renderStateNav(type, currentRoute) {
    const list = window.STATE_NAV[type];
    if (!list) return "";

    const currentSlug = currentRoute.split("/").pop();

    return `
      <div class="state-nav">
        <div class="state-nav-grid">
          ${list.map(item => {
            const isCurrent = item.slug === currentSlug;
            return isCurrent
              ? `<span class="state-nav-item current">${item.name}</span>`
              : `<a class="state-nav-item" href="#/${type}/${item.slug}">${item.name}</a>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(function (hook, vm) {
    hook.afterEach(function (html) {
      return html.replace(
       /<!--\s*state-nav:\s*(ats|ets2)\s*-->/g,
       (_, navType) => renderStateNav(navType, vm.route.path)
);
    });
  }, window.$docsify.plugins || []);
})();
