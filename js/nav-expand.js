// Collapse/expand persistence for course section toggles
// Semester nav links: bold via CSS class, applied with multi-shot retry
(function () {
  var STORAGE_KEY = 'mkdocs-nav-expand';
  var semesterPattern = /^\d{2}-\d{2}(春|夏|秋冬|春夏)$/;

  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {}

  // Mark semester links by text content (not href, because href varies by page)
  function markSemesters() {
    var found = 0;
    document.querySelectorAll('.md-nav__link').forEach(function (link) {
      if (semesterPattern.test(link.textContent.trim())) {
        link.classList.add('md-nav__link--semester');
        found++;
      }
    });
    return found;
  }

  // Multi-shot: try at increasing delays to catch deferred nav rendering
  function scheduleSemesterMark() {
    [0, 50, 150, 400, 1000].forEach(function (delay) {
      setTimeout(markSemesters, delay);
    });
  }

  function initToggles() {
    document.querySelectorAll('.md-nav__toggle').forEach(function (toggle) {
      var li = toggle.closest('.md-nav__item--nested');
      if (!li) return;
      var label = li.querySelector('.md-nav__link');
      if (!label) return;
      var key = label.textContent.trim();

      if (key in saved) {
        toggle.checked = saved[key];
      }

      toggle.addEventListener('change', function () {
        saved[key] = toggle.checked;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (e) {}
      });
    });
  }

  function init() {
    initToggles();
    scheduleSemesterMark();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
