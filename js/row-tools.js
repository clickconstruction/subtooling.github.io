/**
 * Row tools for both calculators (loaded after fixtures.js / total-only.js):
 *   - tap a fixture type to add a line, tap again for one more — with its piece rate on the chip;
 *   - an x on every line (the page's own button only ever removed the LAST line);
 *   - one header row instead of four labels per line;
 *   - a bar that carries the fixture count and the job total down the page.
 * The page's scripts address lines as 1..fixtureCount, so a line is removed by shifting the
 * lines below it up one and dropping the last — every existing loop (save, PDF, pre-fill link,
 * totals) keeps working untouched. Rates are READ from the page's own updateFixtureRate(), not
 * copied here, so there is one rate book.
 */
(function () {
    'use strict';
    var box = document.getElementById('fixtureItems');
    if (!box || typeof addNewFixtureItem !== 'function' || typeof removeLastFixtureItem !== 'function') return;
    var hasRates = !!document.getElementById('fixtureRate1');
    var FIELDS = ['fixtureType', 'customFixtureType', 'fixtureQuantity', 'fixtureRate', 'fixtureAmount'];
    var f = function (name, i) { return document.getElementById(name + i); };
    var count = function () { return box.querySelectorAll('.fixture-item').length; };
    var money = function (n) { return '$' + (isFinite(n) ? n : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

    function showCustom(i) { var s = f('fixtureType', i), c = f('customFixtureType', i); if (s && c) c.style.display = s.value === 'custom' ? 'block' : 'none'; }
    function copyLine(from, to) { FIELDS.forEach(function (k) { var a = f(k, from), b = f(k, to); if (a && b) b.value = a.value; }); showCustom(to); }
    function clearLine(i) {
        FIELDS.forEach(function (k) { var e = f(k, i); if (e) e.value = k === 'fixtureQuantity' ? '1' : ''; });
        showCustom(i);
    }
    function settle() {
        if (typeof window.calculateTotals === 'function') window.calculateTotals();
        if (typeof saveFormData === 'function') saveFormData();
        decorate();
        paintBar();
    }
    function removeLine(k) {
        var n = count();
        if (n <= 1) { clearLine(1); settle(); return; }
        for (var i = k; i < n; i++) copyLine(i + 1, i);
        removeLastFixtureItem();
        settle();
    }

    // ---- one header, an x per line ----------------------------------------------------------
    box.classList.add(hasRates ? 'rows-4' : 'rows-2');
    var head = el('div', 'fixture-head ' + (hasRates ? 'rows-4' : 'rows-2'));
    (hasRates ? ['Fixture', 'Qty', 'Rate ($)', 'Amount ($)', ''] : ['Fixture', 'Qty', '']).forEach(function (t) { head.appendChild(el('span', '', t)); });
    box.parentNode.insertBefore(head, box);

    function decorate() {
        Array.prototype.forEach.call(box.querySelectorAll('.fixture-item'), function (item) {
            var row = item.querySelector('.form-row');
            if (!row || row.querySelector('.line-remove')) return;
            var b = el('button', 'line-remove', '×');
            b.type = 'button';
            b.setAttribute('aria-label', 'Remove this line');
            b.addEventListener('click', function () { removeLine(parseInt(item.id.replace('fixtureItem', ''), 10)); });
            row.appendChild(b);
        });
    }

    // ---- tap to add ---------------------------------------------------------------------------
    function blankLine() {
        for (var i = 1; i <= count(); i++) { var s = f('fixtureType', i); if (s && !s.value) return i; }
        addNewFixtureItem();
        return count();
    }
    function applyType(i) {
        if (hasRates && typeof window.updateFixtureRate === 'function') window.updateFixtureRate(i);
        else if (typeof window.toggleCustomFixtureType === 'function') window.toggleCustomFixtureType(i);
        showCustom(i);
    }
    function addType(type) {
        for (var i = 1; i <= count(); i++) {
            var s = f('fixtureType', i);
            if (type !== 'custom' && s && s.value === type) {
                var q = f('fixtureQuantity', i);
                q.value = String((parseInt(q.value, 10) || 0) + 1);
                if (hasRates && typeof window.calculateFixtureAmount === 'function') window.calculateFixtureAmount(i);
                settle();
                return;
            }
        }
        var k = blankLine();
        f('fixtureType', k).value = type;
        f('fixtureQuantity', k).value = '1';
        applyType(k);
        settle();
        if (type === 'custom' && f('customFixtureType', k)) f('customFixtureType', k).focus();
    }

    function buildChips() {
        var first = f('fixtureType', 1);
        if (!first) return;
        var types = Array.prototype.map.call(first.options, function (o) { return { value: o.value, label: o.textContent }; }).filter(function (t) { return t.value; });
        var rates = {};
        if (hasRates && typeof window.updateFixtureRate === 'function') {
            // Read the page's own rate book through a scratch line, then drop it.
            addNewFixtureItem();
            var scratch = count();
            types.forEach(function (t) {
                if (t.value === 'custom') return;
                f('fixtureType', scratch).value = t.value;
                window.updateFixtureRate(scratch);
                rates[t.value] = parseFloat(f('fixtureRate', scratch).value) || 0;
            });
            removeLastFixtureItem();
        }
        var wrap = el('div', 'type-chips');
        wrap.appendChild(el('span', 'type-chips-hint', 'Tap a type to add it — tap again for one more:'));
        types.forEach(function (t) {
            var b = el('button', 'type-chip', t.label);
            b.type = 'button';
            if (rates[t.value]) b.appendChild(el('b', '', '$' + (rates[t.value] % 1 ? rates[t.value].toFixed(2) : rates[t.value])));
            b.addEventListener('click', function () { addType(t.value); });
            wrap.appendChild(b);
        });
        head.parentNode.insertBefore(wrap, head);
    }

    // ---- the bar --------------------------------------------------------------------------------
    var bar = el('div', 'job-bar');
    var main = document.querySelector('main.container') || document.body;
    main.insertBefore(bar, main.firstChild);
    function paintBar() {
        var fixtures = 0, lines = 0;
        for (var i = 1; i <= count(); i++) {
            var s = f('fixtureType', i);
            if (!s || !s.value) continue;
            lines++;
            fixtures += parseInt(f('fixtureQuantity', i).value, 10) || 0;
        }
        var total = parseFloat((document.getElementById('jobTotal') || {}).value);
        bar.textContent = '';
        var left = el('span', '');
        left.appendChild(el('b', '', String(fixtures)));
        left.appendChild(document.createTextNode(fixtures === 1 ? ' fixture on ' : ' fixtures on '));
        left.appendChild(el('b', '', String(lines)));
        left.appendChild(document.createTextNode(lines === 1 ? ' line' : ' lines'));
        var right = el('span', 'job-bar-total', 'Job total ');
        right.appendChild(el('b', isFinite(total) ? '' : 'is-empty', isFinite(total) ? money(total) : '—'));
        bar.appendChild(left);
        bar.appendChild(right);
    }

    var form = box.closest('form');
    if (form) { form.addEventListener('input', paintBar); form.addEventListener('change', function () { decorate(); paintBar(); }); }
    if (window.MutationObserver) new MutationObserver(function () { decorate(); paintBar(); }).observe(box, { childList: true });
    ['clearAllData', 'fillSampleData'].forEach(function (id) { var b = document.getElementById(id); if (b) b.addEventListener('click', function () { setTimeout(function () { decorate(); paintBar(); }, 60); }); });

    var removeLast = document.getElementById('removeFixture');
    if (removeLast) removeLast.style.display = 'none';
    var addBlank = document.getElementById('addFixture');
    if (addBlank) addBlank.textContent = '+ Blank line';

    // The page restores a saved draft / pre-fill link on its own load; build after it.
    function start() { buildChips(); decorate(); paintBar(); }
    if (document.readyState === 'complete') setTimeout(start, 0); else window.addEventListener('load', function () { setTimeout(start, 0); });
})();
