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
      const match = html.match(/<!--\s*state-nav:\s*(ats|ets2)\s*-->/);
      if (!match) return html;

      const navType = match[1];
      const nav = renderStateNav(navType, vm.route.path);

      return html.replace(match[0], nav);
    });
  }, window.$docsify.plugins || []);
})();
