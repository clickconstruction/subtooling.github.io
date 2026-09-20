/**
 * The sheet beside the form (loaded last). On a wide screen the Job Value preview sits next to
 * the form and re-renders as you type. It calls the page's OWN generateJobValuePreview(), so the
 * sheet is exactly what "Preview Job Value" always showed; this file only keeps both on screen.
 * On a narrow screen nothing here runs: Preview, then Edit, as before.
 */
(function () {
    'use strict';
    var form = document.getElementById('fixtureForm');
    var section = document.getElementById('jobValuePreviewSection');
    if (!form || !section || typeof generateJobValuePreview !== 'function' || !window.matchMedia) return;
    var main = section.parentNode;
    var mq = window.matchMedia('(min-width: 1100px)');
    var previewBtn = document.getElementById('previewJobValue');
    var editBtn = document.getElementById('editJobValue');
    var heading = section.querySelector('.preview-header h2');
    var headingText = heading ? heading.textContent : '';
    var live = false, timer = null;

    function render() {
        if (!live) return;
        try { generateJobValuePreview(); } catch (e) { return; }
        section.style.display = 'block';
        form.style.display = '';
    }
    function schedule() { if (timer) clearTimeout(timer); timer = setTimeout(render, 150); }
    function setLive(on) {
        live = on;
        main.classList.toggle('has-live-sheet', on);
        if (previewBtn) previewBtn.style.display = on ? 'none' : '';
        if (editBtn) editBtn.style.display = on ? 'none' : '';
        if (heading) heading.textContent = on ? 'The sheet as it will print' : headingText;
        if (on) render(); else { section.style.display = 'none'; form.style.display = ''; }
    }
    form.addEventListener('input', schedule);
    form.addEventListener('change', schedule);
    form.addEventListener('click', function () { setTimeout(render, 80); }); // chips, x, sample, clear
    var box = document.getElementById('fixtureItems');
    if (box && window.MutationObserver) new MutationObserver(schedule).observe(box, { childList: true, subtree: true });

    var onChange = function () { if (mq.matches !== live) setLive(mq.matches); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
    function start() { if (mq.matches) setLive(true); }
    if (document.readyState === 'complete') setTimeout(start, 50); else window.addEventListener('load', function () { setTimeout(start, 50); });
})();
