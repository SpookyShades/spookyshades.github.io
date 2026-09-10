(function () {
    const MAX_RESULTS = 30;
    let searchIndex = [];
    let searchReady = false;

    const PAGE_MANIFEST = [
        { path: 'ats/alberta.md', title: 'Alberta', game: 'ATS' },
        { path: 'ats/arizona.md', title: 'Arizona', game: 'ATS' },
        { path: 'ats/arkansas.md', title: 'Arkansas', game: 'ATS' },
        { path: 'ats/britishcolumbia.md', title: 'British Columbia', game: 'ATS' },
        { path: 'ats/california.md', title: 'California', game: 'ATS' },
        { path: 'ats/colorado.md', title: 'Colorado', game: 'ATS' },
        { path: 'ats/idaho.md', title: 'Idaho', game: 'ATS' },
        { path: 'ats/illinois.md', title: 'Illinois', game: 'ATS' },
        { path: 'ats/indiana.md', title: 'Indiana', game: 'ATS' },
        { path: 'ats/iowa.md', title: 'Iowa', game: 'ATS' },
        { path: 'ats/kansas.md', title: 'Kansas', game: 'ATS' },
        { path: 'ats/kentucky.md', title: 'Kentucky', game: 'ATS' },
        { path: 'ats/louisiana.md', title: 'Louisiana', game: 'ATS' },
        { path: 'ats/mexico.md', title: 'Mexico', game: 'ATS' },
        { path: 'ats/minnesota.md', title: 'Minnesota', game: 'ATS' },
        { path: 'ats/mississippi.md', title: 'Mississippi', game: 'ATS' },
        { path: 'ats/missouri.md', title: 'Missouri', game: 'ATS' },
        { path: 'ats/montana.md', title: 'Montana', game: 'ATS' },
        { path: 'ats/nebraska.md', title: 'Nebraska', game: 'ATS' },
        { path: 'ats/nevada.md', title: 'Nevada', game: 'ATS' },
        { path: 'ats/newmexico.md', title: 'New Mexico', game: 'ATS' },
        { path: 'ats/northdakota.md', title: 'North Dakota', game: 'ATS' },
        { path: 'ats/oklahoma.md', title: 'Oklahoma', game: 'ATS' },
        { path: 'ats/oregon.md', title: 'Oregon', game: 'ATS' },
        { path: 'ats/southdakota.md', title: 'South Dakota', game: 'ATS' },
        { path: 'ats/tennessee.md', title: 'Tennessee', game: 'ATS' },
        { path: 'ats/texas.md', title: 'Texas', game: 'ATS' },
        { path: 'ats/utah.md', title: 'Utah', game: 'ATS' },
        { path: 'ats/washington.md', title: 'Washington', game: 'ATS' },
        { path: 'ats/wisconsin.md', title: 'Wisconsin', game: 'ATS' },
        { path: 'ats/wyoming.md', title: 'Wyoming', game: 'ATS' },

        { path: 'ets2/ets2base.md', title: 'Base Map ETS2', game: 'ETS2' },
        { path: 'ets2/balticsea.md', title: 'Beyond the Baltic Sea', game: 'ETS2' },
        { path: 'ets2/blacksea.md', title: 'Road to the Black Sea', game: 'ETS2' },
        { path: 'ets2/goingeast.md', title: 'Going East!', game: 'ETS2' },
        { path: 'ets2/greece.md', title: 'Greece', game: 'ETS2' },
        { path: 'ets2/heart-of-russia.md', title: 'Heart of Russia', game: 'ETS2' },
        { path: 'ets2/iberia.md', title: 'Iberia', game: 'ETS2' },
        { path: 'ets2/italy.md', title: 'Italia', game: 'ETS2' },
        { path: 'ets2/nordic-horizons.md', title: 'Nordic Horizons', game: 'ETS2' },
        { path: 'ets2/scandinavia.md', title: 'Scandinavia', game: 'ETS2' },
        { path: 'ets2/france.md', title: 'Vive la France!', game: 'ETS2' },
        { path: 'ets2/west-balkans.md', title: 'West Balkans', game: 'ETS2' }
    ];

    const DLC_GROUPS = {
        'Beyond the Baltic Sea': [
            'Estonia',
            'Finland',
            'Latvia',
            'Lithuania',
            'Russia'
        ],
        'Road to the Black Sea': [
            'Bulgaria',
            'Romania',
            'Turkey'
        ],
        'Base Map ETS2': [
            'Austria',
            'Belgium',
            'Czechia',
            'France',
            'Germany',
            'Luxembourg',
            'Netherlands',
            'Slovakia',
            'Switzerland',
            'United Kingdom'
        ],
        'Vive la France!': [
            'France'
        ],
        'Going East!': [
            'Czechia',
            'Hungary',
            'Poland',
            'Slovakia'
        ],
        'Heart of Russia': [
            'Russia'
        ],
        'Iberia': [
            'Portugal',
            'Spain'
        ],
        'Italia': [
            'Italy'
        ],
        'Nordic Horizons': [
            'Finland',
            'Norway',
            'Sweden'
        ],
        'Scandinavia': [
            'Norway',
            'Sweden',
            'Denmark'
        ],
        'West Balkans': [
            'Albania',
            'Bosnia and Herzegovina',
            'Croatia',
            'Kosovo',
            'Montenegro',
            'North Macedonia',
            'Serbia',
            'Slovenia'
        ]
    };

    function getCountryDLC(country) {
      const wanted = normalize(country);

      const matches = Object.entries(DLC_GROUPS)
          .filter(([dlc, countries]) =>
              countries.some(
                  item => normalize(item) === wanted
              )
          )
          .map(([dlc]) => dlc)
          .sort((a, b) =>
              normalize(a).localeCompare(normalize(b))
          );

      return matches.length ? matches[0] : null;
    }

    function normalize(value) {
        return String(value)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function parseCSV(text) {
      const rows = [];
      let row = [];
      let value = '';
      let quoted = false;

      for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const next = text[i + 1];

          if (char === '"' && quoted && next === '"') {
              value += '"';
              i++;
              continue;
          }

          if (char === '"') {
              quoted = !quoted;
              continue;
          }

          if (char === ',' && !quoted) {
              row.push(value.trim());
              value = '';
              continue;
          }

          if ((char === '\n' || char === '\r') && !quoted) {
              if (char === '\r' && next === '\n') i++;

              row.push(value.trim());

              if (row.some(cell => cell !== '')) {
                  rows.push(row);
              }

              row = [];
              value = '';
              continue;
          }

          value += char;
      }

      if (value || row.length) {
          row.push(value.trim());

          if (row.some(cell => cell !== '')) {
              rows.push(row);
          }
      }

      if (!rows.length) return [];

      const headers = rows[0].map(header =>
          header.toLowerCase().trim()
      );

      return rows.slice(1)
          .filter(row => {
              const firstCell = (row[0] || '').trim();
              return !firstCell.startsWith('#');
          })
          .map(row => {
              const result = {};

              headers.forEach((header, i) => {
                  result[header] = (row[i] || '').trim();
              });

              return result;
          });
    }

    function getPagePath(path) {
        return '#/' + path.replace(/\.md$/i, '');
    }

    function getDLCInfo(title) {
        const info = [];

        Object.entries(DLC_GROUPS).forEach(([dlc, countries]) => {
            if (normalize(dlc) === normalize(title)) {
                info.push({ dlc, countries });
            }
        });

        return info;
    }

    function loadPages() {
        return PAGE_MANIFEST.map(page => {
            const dlcInfo = getDLCInfo(page.title);

            return {
                type: 'page',
                title: page.title,
                path: getPagePath(page.path),
                game: page.game,
                dlc: dlcInfo.length ? dlcInfo[0].dlc : null,
                countries: dlcInfo.length ? dlcInfo[0].countries : []
            };
        });
    }

    async function loadCSVResults() {
      const response = await fetch('data.csv');

      if (!response.ok) {
          throw new Error('Could not load data.csv');
      }

      const rows = parseCSV(await response.text());

      return rows.map(row => {
          const country = row.state;
          const ets2DLC = getCountryDLC(country);

          let path;
          let game;
          let dlc = null;

          if (ets2DLC) {
              const page = PAGE_MANIFEST.find(
                  item =>
                      normalize(item.title) ===
                      normalize(ets2DLC)
              );

              if (page) {
                  path = getPagePath(page.path);
                  game = 'ETS2';
                  dlc = ets2DLC;
              }
          }

          if (!path) {
              path = '#/ats/' + normalize(country);
              game = 'ATS';
          }

          return {
              type: 'target',
              target: row.target,
              code: row.code,
              state: country,
              className: row.class,
              path: path,
              dlc: dlc,
              game: game,
              scrollTarget: 'Mileage Targets'
          };
      });
    }

    function addPageCountryResults(page, matches, query) {
      if (!page.dlc) return;

      page.countries.forEach(country => {
          const countryName = normalize(country);

          if (countryName === query) {
              matches.push({
                  ...page,
                  displayTitle:
                      country.toUpperCase() +
                      ' (' + page.dlc + ')',
                  subtitle:
                      page.game + ' • ' + page.dlc,
                  priority: 2,
                  resultType: 'country'
              });
          } else if (countryName.startsWith(query)) {
              matches.push({
                  ...page,
                  displayTitle:
                      country.toUpperCase() +
                      ' (' + page.dlc + ')',
                  subtitle:
                      page.game + ' • ' + page.dlc,
                  priority: 15,
                  resultType: 'country'
              });
          } else if (countryName.includes(query)) {
              matches.push({
                  ...page,
                  displayTitle:
                      country.toUpperCase() +
                      ' (' + page.dlc + ')',
                  subtitle:
                      page.game + ' • ' + page.dlc,
                  priority: 25,
                  resultType: 'country'
              });
          }
      });
    }

    function search(query) {
        const q = normalize(query);

        if (!q) return [];

        const matches = [];

        searchIndex.forEach(item => {
            if (item.type === 'page') {
                const title = normalize(item.title);

                if (title === q) {
                    matches.push({
                        ...item,
                        priority: 0,
                        resultType: 'page'
                    });
                } else if (title.startsWith(q)) {
                    matches.push({
                        ...item,
                        priority: 20,
                        resultType: 'page'
                    });
                } else if (title.includes(q)) {
                    matches.push({
                        ...item,
                        priority: 30,
                        resultType: 'page'
                    });
                }

                addPageCountryResults(item, matches, q);
                return;
            }

            const target = normalize(item.target);
            const code = normalize(item.code);

            if (target === q || code === q) {
                matches.push({
                    ...item,
                    priority: 10,
                    resultType: 'target'
                });
            } else if (
                target.startsWith(q) ||
                code.startsWith(q)
            ) {
                matches.push({
                    ...item,
                    priority: 15,
                    resultType: 'target'
                });
            } else if (
                target.includes(q) ||
                code.includes(q)
            ) {
                matches.push({
                    ...item,
                    priority: 40,
                    resultType: 'target'
                });
            }
        });

        const unique = new Map();

        matches.forEach(item => {
            let key;

            if (item.resultType === 'target') {
              key =
                  'target:' +
                  item.path +
                  ':' +
                  normalize(item.target) +
                  ':' +
                  normalize(item.code) +
                  ':' +
                  normalize(item.state);
             } else if (
                item.resultType === 'country'
            ) {
                key =
                    'country:' +
                    normalize(item.displayTitle);
            } else {
                key =
                    item.resultType +
                    ':' +
                    item.path +
                    ':' +
                    normalize(
                        item.displayTitle || item.title
                    );
            }

            if (!unique.has(key)) {
                unique.set(key, item);
            }
        });

        return [...unique.values()]
            .sort((a, b) => {
                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }

                return (
                    a.target || a.title || ''
                ).localeCompare(
                    b.target || b.title || ''
                );
            })
            .slice(0, MAX_RESULTS);
    }

    function renderResults(query) {
        const results =
            document.getElementById('search-results');

        if (!results) return;

        if (!query.trim()) {
            results.innerHTML = '';
            results.classList.remove('visible');
            return;
        }

        if (!searchReady) {
            results.innerHTML =
                '<div class="search-no-results">' +
                'Search index is still loading...' +
                '</div>';
            results.classList.add('visible');
            return;
        }

        const matches = search(query);

        if (!matches.length) {
            results.innerHTML =
                '<div class="search-no-results">' +
                'No matches found.' +
                '</div>';

            results.classList.add('visible');
            return;
        }

        results.innerHTML = matches.map(item => {
            if (
                item.resultType === 'page' ||
                item.resultType === 'dlc' ||
                item.resultType === 'country'
            ) {
                return `
                    <a
                        class="search-result search-page-result"
                        href="${escapeHtml(item.path)}"
                    >
                        <div class="search-result-title">
                            ${escapeHtml(
                                item.displayTitle ||
                                item.title
                            )}
                        </div>
                        <div class="search-result-match">
                            ${escapeHtml(
                                item.subtitle ||
                                item.game + ' • Page'
                            )}
                        </div>
                    </a>
                `;
            }

            return `
              <a
                  class="search-result search-target-result"
                  href="${escapeHtml(item.path)}"
                  data-scroll-target="Mileage Targets"
              >
                  <div class="search-result-title">
                      ${escapeHtml(item.target)}
                  </div>
                  <div class="search-result-match">
                      ${escapeHtml(item.code)}
                      • ${escapeHtml(item.state)}
                      • ${escapeHtml(item.className)}
                      ${item.dlc
                          ? ' • ' + escapeHtml(item.dlc)
                          : ''}
                  </div>
              </a>
          `;
        }).join('');

        results.classList.add('visible');
    }

    function scrollToMileageTargets() {
        const headings =
            document.querySelectorAll(
                '.markdown-section h3'
            );

        for (const heading of headings) {
            if (
                normalize(heading.textContent) ===
                normalize('Mileage Targets')
            ) {
                heading.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                return true;
            }
        }

        return false;
    }

    function initializeSearch() {
        const input =
            document.getElementById('repo-search');

        const clear =
            document.getElementById('search-clear');

        const results =
            document.getElementById('search-results');

        if (!input || !clear || !results) {
            console.error(
                'Search elements not found.'
            );
            return;
        }

        input.addEventListener('input', () => {
            const hasText =
                input.value.trim().length > 0;

            clear.style.display =
                hasText ? 'block' : 'none';

            renderResults(input.value);
        });

        clear.addEventListener('click', () => {
            input.value = '';
            clear.style.display = 'none';
            results.innerHTML = '';
            results.classList.remove('visible');
            input.focus();
        });

        input.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                results.classList.remove('visible');
            }
        });

        results.addEventListener('click', event => {
            const result =
                event.target.closest(
                    '.search-target-result'
                );

            if (!result) return;

            const target =
                result.dataset.scrollTarget;

            if (!target) return;

            sessionStorage.setItem(
                'searchScrollTarget',
                target
            );

            setTimeout(() => {
                if (scrollToMileageTargets()) {
                    sessionStorage.removeItem(
                        'searchScrollTarget'
                    );
                }
            }, 350);
        });

        document.addEventListener('click', event => {
            if (
                !event.target.closest(
                    '.custom-search'
                )
            ) {
                results.classList.remove('visible');
            }
        });
    }

    async function buildSearchIndex() {
        try {
            const pages = loadPages();
            const csvResults =
                await loadCSVResults();

            searchIndex = [
                ...pages,
                ...csvResults
            ];

            searchReady = true;

            console.log(
                'Search index loaded:',
                searchIndex.length,
                'items'
            );
        } catch (error) {
            console.error(
                'Search index failed:',
                error
            );

            searchReady = false;

            const results =
                document.getElementById(
                    'search-results'
                );

            if (results) {
                results.innerHTML =
                    '<div class="search-no-results">' +
                    'Search failed to load. ' +
                    'Check the browser console.' +
                    '</div>';
            }
        }
    }

    document.addEventListener(
        'DOMContentLoaded',
        () => {
            initializeSearch();
            buildSearchIndex();
        }
    );

    window.addEventListener(
        'load',
        () => {
            const target =
                sessionStorage.getItem(
                    'searchScrollTarget'
                );

            if (!target) return;

            let attempts = 0;

            const timer = setInterval(() => {
                attempts++;

                if (
                    scrollToMileageTargets() ||
                    attempts >= 20
                ) {
                    clearInterval(timer);

                    if (attempts < 20) {
                        sessionStorage.removeItem(
                              'searchScrollTarget'
                        );
                    }
                }
            }, 100);
        }
    );
})();