/*
 * Shared self-learning helpers for every page.
 * - Lesson pages (<script src="learner.js" data-lesson="id">): Home button,
 *   "mark as done" + "next lesson" bar, and self-test mode on the answer key.
 * - Landing page (data-lesson="home"): learning path progress on the cards.
 * - Every page: fractions written as "3/10" are shown as stacked fractions.
 * Progress lives in localStorage and every access is guarded, so pages still
 * work when storage is unavailable.
 */
(function () {
  /*
   * The learning path, in order. Topics appear on the landing page in this
   * order, and the "Next" button follows it too.
   * To add a lesson: put its .html file in the lessons/ folder, then add an entry
   * to the right topic below (id = the file name without .html).
   */
  var TOPICS = [
    {
      id: 'statistics',
      title: 'Topic 1 · Statistics',
      intro: 'Measures of central tendency and spread: how to describe a set of data.',
      comingSoon: 'More interactive statistics lessons are coming soon.',
      lessons: [
        { id: 'statistics-notes', title: 'Mean, Mode, Median & Variance', url: 'statistics-notes.html',
          tag: 'Notes', word: 'statistics', c1: '#e6d3f0', c2: '#f7d6de',
          blurb: 'Step-by-step worked examples for raw data, frequency tables and grouped data.',
          how: 'Copy each step into your notebook as you go.' }
      ]
    },
    {
      id: 'probability',
      title: 'Topic 2 · Probability',
      intro: 'Syllabus 4.3: the basic concept of probability, tree diagrams, and dependent, independent, mutually exclusive and non-mutually exclusive events.',
      lessons: [
        { id: 'presentation', title: 'Probability Presentation', url: 'presentation.html',
          tag: 'Learn', word: 'learn', c1: '#f3c2cf', c2: '#c9a07e',
          blurb: 'Slides with animated tree diagrams, worked examples and quick "try it" questions.',
          how: 'Use Next / Previous at your own speed. Answer each question before you reveal it.' },
        { id: 'probability-destinations', title: 'Probability: Travel Edition', url: 'probability-destinations.html',
          tag: 'Explore', word: 'explore', c1: '#d6ecf0', c2: '#e3eefc',
          blurb: 'Syllabus 4.3: the basic concept and dependent, independent, mutually exclusive and non-mutually exclusive events, each with an interactive trip from Langkawi to Sabah.',
          how: 'Change the choices and press the buttons in each example, then try the quick checks and the "Which type?" game.' },
        { id: 'probability-practice', title: 'Probability Practice', url: 'probability-practice.html',
          tag: 'Practice', word: 'practice', c1: '#fff0e3', c2: '#f3c2cf',
          blurb: 'Every probability exercise on one page, sorted by skill from easy to hard, with an interactive tree diagram explorer.',
          how: 'Work each question on paper, then tap the blurred answer to check it.' },
        { id: 'probability-lab', title: 'Probability Lab', url: 'probability-lab.html',
          tag: 'Lab', word: 'experiment', c1: '#e6d3f0', c2: '#d6ecf0',
          blurb: 'Explore binomial and normal distributions with interactive graphs and guided calculations.',
          how: 'Change the values, work through each step, and check your answers.' }
      ]
    }
  ];
  var LESSONS = [];
  TOPICS.forEach(function (t) { t.lessons.forEach(function (l) { LESSONS.push(l); }); });

  var KEY = 'sp-progress-v1';

  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* storage unavailable or corrupt */ }
    if (!s || typeof s !== 'object') s = {};
    return {
      done: s.done && typeof s.done === 'object' ? s.done : {},
      last: typeof s.last === 'string' ? s.last : null
    };
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }
  function indexOf(id) {
    for (var i = 0; i < LESSONS.length; i++) if (LESSONS[i].id === id) return i;
    return -1;
  }

  var script = document.currentScript;
  var lessonId = script && script.getAttribute('data-lesson');

  var css = [
    '.sp-ui, .sp-ui * { box-sizing: border-box; font-family: "Quicksand", system-ui, -apple-system, sans-serif; }',
    '.sp-pill { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 14px; border-radius: 999px;',
    '  background: rgba(255,255,255,.92); color: #7a3a4d; border: 1px solid #f1d3dc; font-size: 14px; font-weight: 700;',
    '  text-decoration: none; cursor: pointer; box-shadow: 0 6px 18px rgba(160,90,110,.22); backdrop-filter: blur(8px);',
    '  -webkit-backdrop-filter: blur(8px); transition: transform .15s ease, background .15s ease; line-height: 1; }',
    '.sp-pill:hover { transform: translateY(-1px); background: #fff; }',
    '.sp-pill svg { width: 18px; height: 18px; flex: none; }',
    '.sp-pill.sp-done { background: #b0506c; color: #fff; border-color: #b0506c; }',
    '.sp-home { position: fixed; top: 12px; left: 12px; z-index: 2147483000; }',
    '.sp-bar { position: fixed; left: 12px; bottom: 12px; z-index: 2147483000; display: flex; gap: 8px; flex-wrap: wrap; max-width: calc(100vw - 24px); }',
    /* The presentation has its own Previous/Next buttons and full-screen slides:
       show icon-only buttons in the corner so they cover as little as possible */
    '.sp-lesson-presentation .sp-bar .sp-label { display: none; }',
    '.sp-lesson-presentation .sp-bar .sp-pill { padding: 0 11px; }',
    '.sp-toast { position: fixed; left: 50%; top: 16px; transform: translateX(-50%); z-index: 2147483001; background: #7a3a4d; color: #fff;',
    '  padding: 10px 16px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,.2); opacity: 0; transition: opacity .25s; pointer-events: none; }',
    '.sp-toast.show { opacity: 1; }',
    '@media (max-width: 640px) { .sp-pill .sp-label { display: none; } .sp-pill { padding: 0 11px; }',
    '  .sp-bar { left: auto; right: 12px; bottom: 92px; flex-direction: column; } body.sp-lesson { padding-bottom: 72px; } }',
    /* Self-test mode on the answer key */
    '.sp-hide .sp-answer { filter: blur(7px); cursor: pointer; user-select: none; transition: filter .2s; }',
    '.sp-hide .sp-answer.sp-shown { filter: none; cursor: auto; user-select: auto; }',
    '.sp-answer:focus-visible { outline: 3px solid #b0506c; outline-offset: 3px; }',
    '.sp-selftest { margin: 16px auto; max-width: 900px; padding: 14px 18px; border-radius: 14px; background: #fff4f7; border: 1px solid #f1d3dc; color: #5b2a39; font-size: 15px; line-height: 1.5; }',
    '.sp-selftest b { color: #7a3a4d; }',
    '.sp-selftest button { margin-top: 8px; }',
    /* Stacked fractions (see typesetFractions) */
    '.sp-frac { position: relative; display: inline-flex; flex-direction: column; align-items: stretch; vertical-align: middle;',
    '  text-align: center; line-height: 1.15; margin: 0 .1em; white-space: nowrap; font-size: .95em; }',
    '.sp-frac > span { display: block; padding: 0 .15em; }',
    '.sp-frac > span:last-child { border-top: max(1px, .07em) solid currentColor; }',
    '.sp-frac > .sp-frac-slash { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }'
  ].join('\n');

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'sp-ui sp-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 2200);
  }

  var ICON_HOME = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
  var ICON_NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function lessonPage() {
    var idx = indexOf(lessonId);
    var state = load();
    state.last = lessonId;
    save(state);
    document.body.classList.add('sp-lesson', 'sp-lesson-' + lessonId);

    var home = document.createElement('a');
    home.className = 'sp-ui sp-pill sp-home';
    home.href = 'index.html';
    home.setAttribute('aria-label', 'Home');
    home.innerHTML = ICON_HOME + '<span class="sp-label">Home</span>';
    document.body.appendChild(home);

    var bar = document.createElement('div');
    bar.className = 'sp-ui sp-bar';

    var doneBtn = document.createElement('button');
    doneBtn.type = 'button';
    doneBtn.className = 'sp-pill';
    function renderDone() {
      var done = !!load().done[lessonId];
      doneBtn.classList.toggle('sp-done', done);
      doneBtn.innerHTML = ICON_CHECK + '<span class="sp-label">' + (done ? 'Completed' : 'Mark as done') + '</span>';
      doneBtn.setAttribute('aria-pressed', done ? 'true' : 'false');
      doneBtn.setAttribute('aria-label', done ? 'Completed' : 'Mark as done');
      doneBtn.title = done ? 'Completed' : 'Mark as done';
    }
    doneBtn.addEventListener('click', function () {
      var s = load();
      s.done[lessonId] = !s.done[lessonId];
      save(s);
      renderDone();
      if (s.done[lessonId]) toast('Nice work! Lesson marked as done ✨');
    });
    renderDone();
    bar.appendChild(doneBtn);

    var next = LESSONS[idx + 1];
    if (next) {
      var nextLink = document.createElement('a');
      nextLink.className = 'sp-pill';
      nextLink.href = next.url;
      nextLink.title = 'Next: ' + next.title;
      nextLink.setAttribute('aria-label', 'Next lesson: ' + next.title);
      nextLink.innerHTML = '<span class="sp-label">Next: ' + next.title + '</span>' + ICON_NEXT;
      bar.appendChild(nextLink);
    }
    document.body.appendChild(bar);

    if (lessonId === 'probability-practice') selfTest();
  }

  function selfTest() {
    // Everything that gives an answer away: answers, working, the correct choice,
    // finished tree diagrams and notes. "Key Formula" notes stay visible as hints.
    var answers = [];
    document.querySelectorAll('.answer, .work-shown, .multiple-choice-correct, .tree-diagram, .note').forEach(function (el) {
      if (el.classList.contains('note') && el.querySelector('.formula')) return;
      if (el.parentElement && el.parentElement.closest('.sp-answer')) return;
      el.classList.add('sp-answer');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', 'Hidden answer. Press to reveal.');
      answers.push(el);
    });
    if (!answers.length) return;
    document.body.classList.add('sp-hide');

    function reveal(el) {
      el.classList.add('sp-shown');
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
    }
    function hideAll() {
      answers.forEach(function (el) {
        el.classList.remove('sp-shown');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', 'Hidden answer. Press to reveal.');
      });
    }

    var box = document.createElement('div');
    box.className = 'sp-ui sp-selftest';
    box.innerHTML = '<b>Self-test mode:</b> answers are hidden. Try each question on paper first, ' +
      'then tap a blurred answer to reveal it and check your work.<br>';
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'sp-pill';
    function renderToggle() {
      toggle.textContent = document.body.classList.contains('sp-hide') ? 'Show all answers' : 'Hide answers again';
    }
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('sp-hide');
      if (document.body.classList.contains('sp-hide')) hideAll();
      else answers.forEach(reveal);
      renderToggle();
    });
    renderToggle();
    box.appendChild(toggle);

    var anchor = document.getElementById('sp-selftest-anchor') || document.querySelector('h2') || document.body.firstElementChild;
    anchor.parentNode.insertBefore(box, anchor.nextSibling);

    function hiddenAnswerFor(target) {
      if (!document.body.classList.contains('sp-hide')) return null;
      var el = target.closest && target.closest('.sp-answer');
      return el && !el.classList.contains('sp-shown') ? el : null;
    }
    document.addEventListener('click', function (e) {
      var el = hiddenAnswerFor(e.target);
      if (el) reveal(el);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var el = hiddenAnswerFor(e.target);
      if (el) { e.preventDefault(); reveal(el); }
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function renderTopics() {
    var root = document.getElementById('topics');
    if (!root) return;
    var html = '';
    TOPICS.forEach(function (topic) {
      html += '<section class="topic" id="topic-' + topic.id + '">' +
        '<h3 class="topic-title">' + escapeHtml(topic.title) + '</h3>' +
        '<p class="topic-intro">' + escapeHtml(topic.intro) + '</p><div class="grid">';
      topic.lessons.forEach(function (l, i) {
        html += '<a class="card" href="' + escapeHtml(l.url) + '" data-lesson-card="' + escapeHtml(l.id) + '">' +
          '<div class="thumb" style="--c1:' + escapeHtml(l.c1) + ';--c2:' + escapeHtml(l.c2) + '"><span class="step">' + (i + 1) + '</span><span>' + escapeHtml(l.word) + '</span></div>' +
          '<div class="card-body"><div class="tag">Lesson ' + (i + 1) + ' · ' + escapeHtml(l.tag) + '</div>' +
          '<h3>' + escapeHtml(l.title) + '</h3><p>' + escapeHtml(l.blurb) + '</p>' +
          '<p class="how">' + escapeHtml(l.how) + '</p></div></a>';
      });
      if (topic.comingSoon) {
        html += '<div class="card soon"><div class="card-body"><div class="tag">Coming soon</div>' +
          '<p>' + escapeHtml(topic.comingSoon) + '</p></div></div>';
      }
      html += '</div></section>';
    });
    root.innerHTML = html;
  }

  function homePage() {
    var state = load();
    var cards = document.querySelectorAll('[data-lesson-card]');
    var doneCount = 0;
    for (var i = 0; i < cards.length; i++) {
      var id = cards[i].getAttribute('data-lesson-card');
      var done = !!state.done[id];
      if (done) doneCount++;
      cards[i].classList.toggle('is-done', done);
    }
    var total = LESSONS.length;
    var bar = document.getElementById('progress-fill');
    var label = document.getElementById('progress-label');
    if (bar) bar.style.width = Math.round((doneCount / total) * 100) + '%';
    if (label) label.textContent = doneCount + ' of ' + total + ' lessons completed';

    // Resume where the learner left off, or at the first unfinished lesson.
    var target = null;
    if (state.last && !state.done[state.last] && indexOf(state.last) >= 0) target = LESSONS[indexOf(state.last)];
    for (var j = 0; !target && j < LESSONS.length; j++) if (!state.done[LESSONS[j].id]) target = LESSONS[j];
    var cta = document.getElementById('continue');
    if (cta) {
      if (target) {
        cta.href = target.url;
        cta.textContent = (doneCount || state.last ? 'Continue: ' : 'Start learning: ') + target.title + ' →';
      } else {
        cta.href = LESSONS[0].url;
        cta.textContent = 'All done! Review from the start →';
      }
    }
  }

  function bindReset() {
    var reset = document.getElementById('reset-progress');
    if (reset) reset.addEventListener('click', function () {
      save({ done: {}, last: null });
      homePage();
    });
  }

  /*
   * Fractions: "3/10", "500/200,000" and "n(A)/n(S)" in the page text are shown as
   * stacked fractions, and so is anything already written as
   * <span class="sp-frac"><span>top</span><span>bottom</span></span>.
   * Pages that build their content with JavaScript are watched, so new text is
   * typeset too. The slash stays in the page (hidden), so copying and screen
   * readers still get "3/10".
   */
  var TERM = '(?:\\d+(?:,\\d{3})*(?:\\.\\d+)?|n\\([^()\\s]+\\))';
  var FRACTION = new RegExp('(?<![\\w.,/])(' + TERM + ')/(' + TERM + ')(?![\\w/])', 'g');
  var SKIP = 'script, style, textarea, input, select, code, svg, .tex, .katex, .sp-frac, .sp-ui, [data-no-frac]';

  function fraction(top, bottom) {
    var f = document.createElement('span');
    f.className = 'sp-frac';
    [top, '/', bottom].forEach(function (part, i) {
      var el = document.createElement('span');
      if (i === 1) el.className = 'sp-frac-slash';
      el.textContent = part;
      f.appendChild(el);
    });
    return f;
  }

  function typesetText(node) {
    var text = node.nodeValue;
    FRACTION.lastIndex = 0;
    if (!FRACTION.test(text)) return;
    var frag = document.createDocumentFragment();
    var last = 0;
    FRACTION.lastIndex = 0;
    text.replace(FRACTION, function (match, top, bottom, at) {
      if (at > last) frag.appendChild(document.createTextNode(text.slice(last, at)));
      frag.appendChild(fraction(top, bottom));
      last = at + match.length;
      return match;
    });
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }

  function typesetFractions(root) {
    if (root.nodeType === 3) {
      if (root.parentElement && !root.parentElement.closest(SKIP)) typesetText(root);
      return;
    }
    if (root.nodeType !== 1 || root.closest(SKIP)) return;
    // Hand-written fractions: add the hidden slash between top and bottom.
    root.querySelectorAll('.sp-frac').forEach(function (f) {
      if (f.children.length === 2) {
        var slash = document.createElement('span');
        slash.className = 'sp-frac-slash';
        slash.textContent = '/';
        f.insertBefore(slash, f.lastElementChild);
      }
    });
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(typesetText);
  }

  function watchFractions() {
    typesetFractions(document.body);
    if (!window.MutationObserver) return;
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        if (r.type === 'characterData') typesetFractions(r.target);
        else r.addedNodes.forEach(function (n) { if (n.isConnected) typesetFractions(n); });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function init() {
    injectStyles();
    watchFractions();
    if (lessonId === 'home') { renderTopics(); homePage(); bindReset(); }
    else if (lessonId) lessonPage();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
