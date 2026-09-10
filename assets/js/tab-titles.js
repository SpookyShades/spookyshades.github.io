(function () {
  const pageTitlePlugin = function (hook, vm) {
    hook.doneEach(function () {
      const hash = window.location.hash || '';
      const path = (vm && vm.route && vm.route.path) ? vm.route.path : '';
      const isMainPage = !hash || hash === '#' || hash === '#/' || path === '/' || path === '/README';

      let title = document.title
        .replace(/^Spooks['’]\s*Repo\s*\|\s*/i, '')
        .trim();

      if (isMainPage || title.toLowerCase() === 'main page') {
        document.title = "Spooks' Repo";
        return;
      }

      if (!title) {
        const h1 = document.querySelector('.markdown-section h1');
        if (h1 && h1.textContent.trim()) {
          title = h1.textContent.trim();
        }
      }

      document.title = title ? `Spooks' Repo | ${title}` : "Spooks' Repo";
    });
  };
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], pageTitlePlugin);
}());