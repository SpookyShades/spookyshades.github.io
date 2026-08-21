(function () {
    const tablePlugin = (hook, vm) => {
        hook.doneEach(() => {
            const containers = document.querySelectorAll('.custom-table');
            if (!containers.length) return;

            fetch('data.csv')
                .then(res => res.ok ? res.text() : Promise.reject('Could not load data.csv'))
                .then(csvData => {
                    const rows = parseCSV(csvData);
                    
                    // Identify highest version number for highlighting
                    const maxV = Math.max(...rows.map(r => parseFloat(r.version) || 0), 0);

                    containers.forEach(container => {
                        const cat = (container.getAttribute('data-category') || '').trim().toLowerCase();
                        const cls = (container.getAttribute('data-class') || '').trim().toLowerCase();

                        const filtered = rows.filter(r => {
                            const stateMatch = r.state.trim().toLowerCase() === cat;
                            const classMatch = !cls || r.class.trim().toLowerCase() === cls;
                            return stateMatch && classMatch;
                        });

                        if (!filtered.length) {
                            container.innerHTML = `<em>No data: state="${escapeHtml(cat)}" class="${escapeHtml(cls || 'any')}"</em>`;
                            return;
                        }

                        let html = `<table class="sortable"><thead><tr><th>Target</th><th>Version</th><th>Patch</th><th>Code</th></tr></thead><tbody>`;

                        filtered.forEach(row => {
                            const isLatest = parseFloat(row.version) === maxV;
                            const rowClass = isLatest ? ' class="latest-version"' : '';
                            const codes = row.code.split(/\s+/).filter(Boolean)
                                .map(c => `<code>${escapeHtml(c)}</code>`).join(' ');

                            html += `<tr${rowClass}>
                                <td>${escapeHtml(row.target)}</td>
                                <td>${escapeHtml(row.version)}</td>
                                <td>${escapeHtml(row.patch || '--')}</td>
                                <td>${codes}</td>
                            </tr>`;
                        });

                        container.innerHTML = html + `</tbody></table>`;

                        // Initialize Tablesort if available
                        if (window.Tablesort) {
                            new Tablesort(container.querySelector('table'));
                        } else {
                            console.warn('Tablesort not loaded.');
                        }
                    });
                })
                .catch(err => console.error('Table error:', err));
        });
    };

    // CSV Parser supporting quoted fields
    function parseCSV(str) {
        const rows = [];
        let row = [], value = '', insideQuotes = false;

        for (let i = 0; i < str.length; i++) {
            const char = str[i], next = str[i + 1];
            if (char === '"' && insideQuotes && next === '"') { value += '"'; i++; continue; }
            if (char === '"') { insideQuotes = !insideQuotes; continue; }
            if (char === ',' && !insideQuotes) { row.push(value.trim()); value = ''; continue; }
            if ((char === '\n' || char === '\r') && !insideQuotes) {
                if (char === '\r' && next === '\n') i++;
                row.push(value.trim());
                if (row.some(c => c !== '')) rows.push(row);
                row = []; value = ''; continue;
            }
            value += char;
        }
        if (value || row.length) {
            row.push(value.trim());
            if (row.some(c => c !== '')) rows.push(row);
        }

        if (!rows.length) return [];
        const headers = rows[0].map(h => h.trim().toLowerCase());
        return rows.slice(1).map(r => {
            const obj = {};
            headers.forEach((h, i) => obj[h] = (r[i] || '').trim());
            return obj;
        });
    }

    function escapeHtml(val) {
        return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    window.$docsify.plugins = [].concat(window.$docsify.plugins || [], tablePlugin);
}());